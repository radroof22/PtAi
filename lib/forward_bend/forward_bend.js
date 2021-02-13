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
    knee: null,
    shoulder: null,
    hip: null,
    thigh: null,
    torso: null,
    arc: null,
    angle: null,
    reps: 0,
    goingUp: true,
}
directions = [
    "Bend forward",
    "Straighten out"
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
            curl.hip = poses[0].pose.rightHip
            curl.knee = poses[0].pose.rightKnee
            curl.shoulder = poses[0].pose.rightShoulder
        }else if(type=="l"){
            curl.hip = poses[0].pose.leftHip
            curl.knee = poses[0].pose.leftKnee
            curl.shoulder = poses[0].pose.leftShoulder
        }else if(type="b"){
            curl.hip = [poses[0].pose.leftHip, poses[0].pose.rightHip]
            curl.knee = [poses[0].pose.leftKnee, poses[0].pose.rightKnee]
            curl.shoulder = [poses[0].pose.leftShoulder, poses[0].pose.rightShoulder]
        }
        
    }
    
}

function singleCheck(){
    if(curl.hip != null && curl.hip.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.hip.x, curl.hip.y, 25)
    }

    if(curl.knee != null && curl.knee.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.knee.x, curl.knee.y, 25)
    }

    if(curl.shoulder != null && curl.shoulder.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.shoulder.x, curl.shoulder.y, 25)
    }

    // draw torso
    if(curl.shoulder != null && 
        curl.hip != null && 
        curl.shoulder.confidence > .3 && 
        curl.hip.confidence > .3){
        stroke(0, 255, 0)
        line( curl.shoulder.x, curl.shoulder.y, curl.hip.x, curl.hip.y)
        curl.torso = calcDist(curl.shoulder, curl.hip)
    }

    // draw thigh
    if(curl.knee != null && 
        curl.hip != null && 
        curl.knee.confidence > .3 && 
        curl.hip.confidence > .3){
        stroke(0, 255, 0)
        line( curl.knee.x, curl.knee.y, curl.hip.x, curl.hip.y)
        curl.thigh = calcDist(curl.knee, curl.hip);
    }

    // arc
    if(curl.knee != null && 
        curl.shoulder != null && 
        curl.knee.confidence > .3 && 
        curl.shoulder.confidence > .3){
        curl.arc = calcDist(curl.knee, curl.shoulder);
    }

    // calculate angle
    if(curl.thigh && curl.torso && curl.arc){
        curl.angle = lawCosines(curl.thigh, curl.torso, curl.arc) * 90;
        const angleId = document.getElementById("angle")
        angleId.textContent = Math.round(curl.angle, 2)
        if(curl.goingUp && curl.angle < 150){
            curl.goingUp = false
            curl.reps += 1
            const repCounter = document.getElementById("reps")
            repCounter.textContent = curl.reps
            const dirAlert = document.getElementById("directionsAlert")
            dirAlert.className = "alert alert-primary"
            const dirText = document.getElementById("directionsText")
            dirText.textContent = directions[1]
        }else if(!curl.goingUp && curl.angle > 270){
            curl.goingUp = true
            const dirAlert = document.getElementById("directionsAlert")
            dirAlert.className = "alert alert-warning"
            const dirText = document.getElementById("directionsText")
            dirText.textContent = directions[0]

        }
    }
}

function bothCheck(){
    if(curl.hip[0] != null && curl.hip[0].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.hip[0].x, curl.hip[0].y, 25)
    }
    if(curl.hip[1] != null && curl.hip[1].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.hip[1].x, curl.hip[1].y, 25)
    }

    if(curl.knee[0] != null && curl.knee[0].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.knee[0].x, curl.knee[0].y, 25)
    }
    if(curl.knee[1] != null && curl.knee[1].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.knee[1].x, curl.knee[1].y, 25)
    }

    if(curl.shoulder[1] != null && curl.shoulder[1].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.shoulder[1].x, curl.shoulder[1].y, 25)
    }
    if(curl.shoulder[0] != null && curl.shoulder[0].confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.shoulder[0].x, curl.shoulder[0].y, 25)
    }

    // draw torso
    if(curl.shoulder[0] != null && 
        curl.hip[0] != null && 
        curl.shoulder[0].confidence > .3 && 
        curl.hip[0].confidence > .3){
        stroke(0, 255, 0)
        line( curl.shoulder[0].x, curl.shoulder[0].y, curl.hip[0].x, curl.hip[0].y)
        curl.torso = calcDist(curl.shoulder[0], curl.hip[0])
    }
    if(curl.shoulder[1] != null && 
        curl.hip[1] != null && 
        curl.shoulder[1].confidence > .3 && 
        curl.hip[1].confidence > .3){
        stroke(0, 255, 0)
        line( curl.shoulder[1].x, curl.shoulder[1].y, curl.hip[1].x, curl.hip[1].y)
        curl.torso = calcDist(curl.shoulder[1], curl.hip[1])
    }

    // draw thigh
    if(curl.knee[0] != null && 
        curl.hip[0] != null && 
        curl.knee[0].confidence > .3 && 
        curl.hip[0].confidence > .3){
        stroke(0, 255, 0)
        line( curl.knee[0].x, curl.knee[0].y, curl.hip[0].x, curl.hip[0].y)
        curl.thigh = calcDist(curl.knee[0], curl.hip[0]);
    }
    if(curl.knee[1] != null && 
        curl.hip[1] != null && 
        curl.knee[1].confidence > .3 && 
        curl.hip[1].confidence > .3){
        stroke(0, 255, 0)
        line( curl.knee[1].x, curl.knee[1].y, curl.hip[1].x, curl.hip[1].y)
        curl.thigh = calcDist(curl.knee[1], curl.hip[1]);
    }

    // arc
    if(curl.knee[1] != null && 
        curl.shoulder[1] != null && 
        curl.knee[1].confidence > .3 && 
        curl.shoulder[1].confidence > .3){
        curl.arc = calcDist(curl.knee[1], curl.shoulder[1]);
    }
    

    // calculate angle
    if(curl.thigh && curl.torso && curl.arc){
        curl.angle = lawCosines(curl.thigh, curl.torso, curl.arc) * 90;
        const angleId = document.getElementById("angle")
        angleId.textContent = Math.round(curl.angle, 2)
        if(curl.goingUp && curl.angle < 150){
            curl.goingUp = false
            curl.reps += 1
            const repCounter = document.getElementById("reps")
            repCounter.textContent = curl.reps
            const dirAlert = document.getElementById("directionsAlert")
            dirAlert.className = "alert alert-primary"
            const dirText = document.getElementById("directionsText")
            dirText.textContent = directions[1]
        }else if(!curl.goingUp && curl.angle > 270){
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
