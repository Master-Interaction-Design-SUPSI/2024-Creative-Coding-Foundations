const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const ctx = CANVAS.getContext("2d");
const circleColorInput = document.getElementById("circleColor");
const linesColorInput = document.getElementById("linesColor");

const BUTTON = document.getElementById("startListening");
const resetButton = document.getElementById("resetButton")

CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;
const width = CANVAS.width;
const height = CANVAS.height;

let analyser;
let dataArray;
let circleRadius = 30;

function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; 
    let bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength); 

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream); 
            source.connect(analyser);

            draw();
      })
        .catch(err => {
            console.error('Error accessing microphone:', err);
    });
}

function draw(){
    //ctx.clearRect(0,0,width,height);

    analyser.getByteFrequencyData(dataArray);
    // console.log(dataArray);

    let bassSum = 0;
    let symphonySum = 0;

    for (let i = 0; i < 20; i++) {
        bassSum += dataArray[i];
    }
    console.log(bassSum);
    for (let i = 50; i < dataArray.length; i++) {
        symphonySum += dataArray[i];
    }



    ctx.beginPath();

    let gap = canvas.width / (dataArray.length - 100);
    
    for (let i = 50; i < dataArray.length; i++) {
        ctx.strokeStyle = linesColorInput.value;

        let x = (i-50) * gap;
        let y = (height / 2) + ((dataArray[i]) / 128) * (height / 2);

        if (i === 50) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }




    circleRadius = bassSum/10 + 50;
    ctx.strokeStyle = circleColorInput.value;
    const circleSpacing = width/4;
    // const radius = 70;

    ctx.beginPath();
    ctx.arc(width/2, height/2, circleRadius, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width/2 - circleSpacing, height/2 , circleRadius, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width/2 + circleSpacing, height/2, circleRadius, 0, Math.PI * 2)
    ctx.stroke();


    requestAnimationFrame(draw);
}

resetButton.addEventListener("click", () => {
    console.log("ok");
    ctx.clearRect(0,0,width,height);
    startAudio();
})

BUTTON.addEventListener("click", () => {
    //console.log("ok");
    startAudio();
})