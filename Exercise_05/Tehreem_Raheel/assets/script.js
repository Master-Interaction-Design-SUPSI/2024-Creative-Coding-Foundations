// script.js
const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const ctx = CANVAS.getContext('2d');

const BUTTON = document.getElementById("start_listening");
const WAVE_COLOR = document.getElementById("wave_color");
const CIRCLE_COLOR = document.getElementById("circle_color");
const CIRCLE_SIZE = document.getElementById("circle_size");

CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;
const width = CANVAS.width;
const height = CANVAS.height;

let analyser;
let dataArray;

function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
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

function draw() {
    ctx.clearRect(0, 0, width, height);

    analyser.getByteTimeDomainData(dataArray);

    ctx.beginPath();
    ctx.strokeStyle = WAVE_COLOR.value;

    let gap = CANVAS.width / dataArray.length;

    for (let i = 0; i < dataArray.length; i++) {
        let y = (dataArray[i] / 255) * CANVAS.height;

        if (i === 0) {
            ctx.moveTo(i * gap, y);
        } else {
            ctx.lineTo(i * gap, y);
        }
    }

    ctx.stroke();

    const circlePosition = dataArray[2] + height / 2 - 128;
    const circleRadius = parseInt(CIRCLE_SIZE.value);
    const clampedCirclePosition = Math.min(Math.max(circlePosition, circleRadius), height - circleRadius);

    ctx.beginPath();
    ctx.fillStyle = CIRCLE_COLOR.value;
    ctx.shadowBlur = 30;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.shadowColor = "white";
    ctx.arc(width / 2, clampedCirclePosition, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
}

BUTTON.addEventListener("click", () => {
    startAudio();
});