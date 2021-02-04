let video;
let poseNet;



var type = "r"

function changeTo(v){
    type = v;
    var arm = document.getElementById("armType")
    if (type == "r"){
        arm.textContent = "Right"
    }else if(type=="l"){
        arm.textContent = "Left"
    }else if(type="b"){
        arm.textContent = "Both"
    }
}

curl = {
    elbow: null,
    wrist: null,
    shoulder: null,
    bicep: null,
    forearm: null,
    arc: null,
    angle: null,
    reps: 0,
    goingUp: true,
}
directions = [
    "Flex and decrease angle of elbow",
    "Extend and increase angle of elbow"
]
function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO)
    video.hide ();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on("pose", getPoses)
}

function modelLoaded(){
    console.log("pose net ready")
}

function getPoses(poses){
    if (poses.length > 0){
        if(type=="r"){
            curl.elbow = poses[0].pose.rightElbow
            curl.wrist = poses[0].pose.rightWrist
            curl.shoulder = poses[0].pose.rightShoulder
        }else if(type=="l"){
            curl.elbow = poses[0].pose.leftElbow
            curl.wrist = poses[0].pose.leftWrist
            curl.shoulder = poses[0].pose.leftShoulder
        }else if(type="b"){
            curl.elbow = [poses[0].pose.leftElbow, poses[0].pose.rightElbow]
            curl.wrist = [poses[0].pose.leftWrist, poses[0].pose.rightWrist]
            curl.shoulder = [poses[0].pose.leftShoulder, poses[0].pose.rightShoulder]
        }
        
    }
    
}

function singleCheck(){
    if(curl.elbow != null && curl.elbow.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.elbow.x, curl.elbow.y, 25)
    }

    if(curl.wrist != null && curl.wrist.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.wrist.x, curl.wrist.y, 25)
    }

    if(curl.shoulder != null && curl.shoulder.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.shoulder.x, curl.shoulder.y, 25)
    }

    // draw bicep
    if(curl.shoulder != null && 
        curl.elbow != null && 
        curl.shoulder.confidence > .3 && 
        curl.elbow.confidence > .3){
        stroke(0, 255, 0)
        line( curl.shoulder.x, curl.shoulder.y, curl.elbow.x, curl.elbow.y)
        curl.bicep = calcDist(curl.shoulder, curl.elbow)
    }

    // draw forearm
    if(curl.wrist != null && 
        curl.elbow != null && 
        curl.wrist.confidence > .3 && 
        curl.elbow.confidence > .3){
        stroke(0, 255, 0)
        line( curl.wrist.x, curl.wrist.y, curl.elbow.x, curl.elbow.y)
        curl.forearm = calcDist(curl.wrist, curl.elbow);
    }

    // arc
    if(curl.wrist != null && 
        curl.shoulder != null && 
        curl.wrist.confidence > .3 && 
        curl.shoulder.confidence > .3){
        curl.arc = calcDist(curl.wrist, curl.shoulder);
    }

    // calculate angle
    if(curl.arc && curl.bicep && curl.forearm){
        curl.angle = lawCosines(curl.forearm, curl.bicep, curl.arc) * 90;
        const angleId = document.getElementById("angle")
        angleId.textContent = Math.round(curl.angle, 2)
        
        if(curl.goingUp && curl.angle < 100){
            curl.goingUp = false
            curl.reps += 1
            const repCounter = document.getElementById("reps")
            repCounter.textContent = curl.reps
            const dirAlert = document.getElementById("directionsAlert")
            dirAlert.className = "alert alert-primary"
            const dirText = document.getElementById("directionsText")
            dirText.textContent = directions[1]
        }else if(!curl.goingUp && curl.angle > 250){
            curl.goingUp = true
            const dirAlert = document.getElementById("directionsAlert")
            dirAlert.className = "alert alert-warning"
            const dirText = document.getElementById("directionsText")
            dirText.textContent = directions[0]

        }
    }
}

function bothCheck(){
    if(curl.elbow[0] != null && curl.elbow[0].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.elbow[0].x, curl.elbow[0].y, 25)
    }
    if(curl.elbow[1] != null && curl.elbow[1].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.elbow[1].x, curl.elbow[1].y, 25)
    }

    if(curl.wrist[0] != null && curl.wrist[0].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.wrist[0].x, curl.wrist[0].y, 25)
    }
    if(curl.wrist[1] != null && curl.wrist[1].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.wrist[1].x, curl.wrist[1].y, 25)
    }

    if(curl.shoulder[0] != null && curl.shoulder[0].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.shoulder[0].x, curl.shoulder[0].y, 25)
    }
    if(curl.shoulder[1] != null && curl.shoulder[1].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.shoulder[1].x, curl.shoulder[1].y, 25)
    }

    // draw bicep
    if(curl.shoulder[0] != null && 
        curl.elbow[0] != null && 
        curl.shoulder[0].confidence > .3 && 
        curl.elbow[0].confidence > .3){
        stroke(0, 255, 0)
        line( curl.shoulder[0].x, curl.shoulder[0].y, curl.elbow[0].x, curl.elbow[0].y)
        curl.bicep = calcDist(curl.shoulder[0], curl.elbow[0])
    }

    // draw forearm
    if(curl.wrist[0] != null && 
        curl.elbow[0] != null && 
        curl.wrist[0].confidence > .3 && 
        curl.elbow[0].confidence > .3){
        stroke(0, 255, 0)
        line( curl.wrist[0].x, curl.wrist[0].y, curl.elbow[0].x, curl.elbow[0].y)
        curl.forearm = calcDist(curl.wrist[0], curl.elbow[0]);
    }

    // arc
    if(curl.wrist[0] != null && 
        curl.shoulder[0] != null && 
        curl.wrist[0].confidence > .3 && 
        curl.shoulder[0].confidence > .3){
        curl.arc = calcDist(curl.wrist[0], curl.shoulder[0]);
    }

    // calculate angle
    if(curl.arc && curl.bicep && curl.forearm){
        curl.angle = lawCosines(curl.forearm, curl.bicep, curl.arc) * 90;
        const angleId = document.getElementById("angle")
        angleId.textContent = Math.round(curl.angle, 2)
        
        if(curl.goingUp && curl.angle < 100){
            curl.goingUp = false
            curl.reps += 1
            const repCounter = document.getElementById("reps")
            repCounter.textContent = curl.reps
            const dirAlert = document.getElementById("directionsAlert")
            dirAlert.className = "alert alert-primary"
            const dirText = document.getElementById("directionsText")
            dirText.textContent = directions[1]
        }else if(!curl.goingUp && curl.angle > 250){
            curl.goingUp = true
            const dirAlert = document.getElementById("directionsAlert")
            dirAlert.className = "alert alert-warning"
            const dirText = document.getElementById("directionsText")
            dirText.textContent = directions[0]

        }
    }
}

function draw(){
    image(video, 0, 0);

    if (type == "r" || type == "l"){
        singleCheck()
    }else if(type == "b"){
        bothCheck()
    }
    

}

function lawCosines(a, b, c){
    return Math.acos((c**2 - b**2 - a**2)/(-2*a*b))
}

function calcDist(obj1, obj2){
    return Math.sqrt((obj1.x-obj2.x)**2 + (obj1.y - obj2.y)**2)
}
