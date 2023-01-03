//Move cell 400px in 5 seconds
const cell = document.getElementById('cell');
const Movement = 400,Peroid = 5000;
let requestAnimationFrameID =null,startTimeStamp,animationFinished=false,previousTimeStamp;

function move(timestamp) {
    startTimeStamp = startTimeStamp === undefined ? timestamp:startTimeStamp;
    const speed = Movement/Peroid;
    const elapsedTime = timestamp - startTimeStamp;

    if(previousTimeStamp!==timestamp){
        const progress = Math.min(elapsedTime * speed,400);
        cell.style.transform = `translateX(${progress}px)`;
        if(progress === 400){
            animationFinished=true;
        }
    }

    if(elapsedTime < Peroid){ // Stop the animation after 5 seconds
        previousTimeStamp = timestamp;
        if(!animationFinished){
            requestAnimationFrameID = window.requestAnimationFrame(move)
        }
    }
}

function start() {
    requestAnimationFrameID = window.requestAnimationFrame(move);
}

function stop() {
    window.cancelAnimationFrame(requestAnimationFrameID)
}
