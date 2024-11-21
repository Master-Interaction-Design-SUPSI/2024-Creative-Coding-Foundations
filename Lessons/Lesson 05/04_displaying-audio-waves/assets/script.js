const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const ctx = CANVAS.getContext("2d");

const BUTTON = document.getElementById("start_listening");

// setup the canvas width
CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;
const width = CANVAS.width;
const height = CANVAS.height;

let analyser;
let dataArray;
let circleRadius = 50;

function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Size of the frequency data (this will affect resolution)
    let bufferLength = analyser.frequencyBinCount; // Number of frequency data points
    dataArray = new Uint8Array(bufferLength); 

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream); // Create audio source from microphone
            source.connect(analyser); // Connect the source to the analyser

            draw(); // Start the visualization loop
      })
        .catch(err => {
            console.error('Error accessing microphone:', err);
    });
}

function draw(){
    ctx.clearRect(0,0,width,height);

    analyser.getByteTimeDomainData(dataArray);
    // console.log(dataArray);

    ctx.beginPath();
    ctx.strokeStyle = "black";

    let gap = canvas.width / dataArray.length;

    for(let i = 0; i < dataArray.length; i++){
        console.log(dataArray[i]);

        let y = (dataArray[i] / 255) * canvas.height;

        if (i === 0) {
            ctx.moveTo(i * gap, y);
        }
        else {
            ctx.lineTo(i * gap, y);
        }

        ctx.stroke();
    }

    circleRadius = dataArray[2] + height / 2 - 128;

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(width/2, circleRadius, 50, 0, Math.PI * 2)
    ctx.fill();

    requestAnimationFrame(draw);
}

BUTTON.addEventListener("click", () => {
    console.log("ok");

    startAudio();
})
