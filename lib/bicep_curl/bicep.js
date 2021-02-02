let video;
let poseNet;

curl = {
    rightElbow: null,
    rightWrist: null,
    rightShoulder: null,
    bicep: null,
    forearm: null,
    arc: null,
    angle: null,
    reps: 0,
    goingUp: true,
}
directions = [
    "Lower angle of elbow to count rep.",
    "Increase angle of elbow to reset rep."
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
        curl.rightElbow = poses[0].pose.rightElbow
        curl.rightWrist = poses[0].pose.rightWrist
        curl.rightShoulder = poses[0].pose.rightShoulder
    }
    
}

function draw(){
    image(video, 0, 0);

    
    if(curl.rightElbow != null && curl.rightElbow.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.rightElbow.x, curl.rightElbow.y, 25)
    }

    if(curl.rightWrist != null && curl.rightWrist.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.rightWrist.x, curl.rightWrist.y, 25)
    }

    if(curl.rightShoulder != null && curl.rightShoulder.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.rightShoulder.x, curl.rightShoulder.y, 25)
    }

    if(curl.rightElbow != null && curl.rightElbow.confidence > .3){
        fill(255, 0, 0)
        ellipse( curl.rightElbow.x, curl.rightElbow.y, 25)
    }

    // draw bicep
    if(curl.rightShoulder != null && 
        curl.rightElbow != null && 
        curl.rightShoulder.confidence > .3 && 
        curl.rightElbow.confidence > .3){
        stroke(0, 255, 0)
        line( curl.rightShoulder.x, curl.rightShoulder.y, curl.rightElbow.x, curl.rightElbow.y)
        curl.bicep = calcDist(curl.rightShoulder, curl.rightElbow)
    }

    // draw forearm
    if(curl.rightWrist != null && 
        curl.rightElbow != null && 
        curl.rightWrist.confidence > .3 && 
        curl.rightElbow.confidence > .3){
        stroke(0, 255, 0)
        line( curl.rightWrist.x, curl.rightWrist.y, curl.rightElbow.x, curl.rightElbow.y)
        curl.forearm = calcDist(curl.rightWrist, curl.rightElbow);
    }

    // arc
    if(curl.rightWrist != null && 
        curl.rightShoulder != null && 
        curl.rightWrist.confidence > .3 && 
        curl.rightShoulder.confidence > .3){
        curl.arc = calcDist(curl.rightWrist, curl.rightShoulder);
    }

    // calculate angle
    if(curl.arc && curl.bicep && curl.forearm){
        curl.angle = lawCosines(curl.forearm, curl.bicep, curl.arc) * 90;
        
        if(curl.goingUp && curl.angle < 100){
            curl.goingUp = false
            curl.reps += 1
            const repCounter = document.getElementById("reps")
            repCounter.textContent = curl.reps
            const dir = document.getElementById("directions")
            dir.className = "alert alert-success"
            dir.textContent = directions[1]
        }else if(!curl.goingUp && curl.angle > 250){
            curl.goingUp = true
            const dir = document.getElementById("directions")
            dir.className = "alert alert-warning"
            dir.textContent = directions[0]

        }
    }
    

}

function lawCosines(a, b, c){
    return Math.acos((c**2 - b**2 - a**2)/(-2*a*b))
}

function calcDist(obj1, obj2){
    return Math.sqrt((obj1.x-obj2.x)**2 + (obj1.y - obj2.y)**2)
}
