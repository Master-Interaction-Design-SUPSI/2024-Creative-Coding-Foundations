const CANVAS = document.getElementById('myCanvas');
const ctx = CANVAS.getContext('2d');
const BUTTON_START = document.getElementById('start_listening');
const BUTTON_CHANGE = document.getElementById('change_colors');
const BUTTON_CHANGE_SHAPE = document.getElementById('change_shape');

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const width = CANVAS.width;
const height = CANVAS.height;

let analyser, dataArray;
let colors = ['#FF5733', '#33FF57', '#3357FF', '#F5FF33', '#FF33FB', '#33FFF6'];
let radiusStep = 50;
let isCircle = true; // Flag to toggle shapes


function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; 
    const bufferLength = analyser.frequencyBinCount; 
    dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            const source = audioContext.createMediaStreamSource(stream); 
            source.connect(analyser);
            draw(); 
        })
        .catch((err) => {
            console.error('Error accessing microphone:', err);
        });
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);

        const avgVolume =
            dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

        console.log(`Average Volume: ${avgVolume}`); // Log the average volume to the console

        for (let i = 0; i < 6; i++) {
            const size = radiusStep * (i + 1) + avgVolume; // Scale up based on audio input
            const x = width / 2;
            const y = height / 2;

            ctx.beginPath();
            ctx.strokeStyle = colors[i];
            ctx.lineWidth = 5;

            if (isCircle) {
                ctx.arc(x, y, size, 0, Math.PI * 2);
            } else {
                ctx.rect(x - 2*size / 2, y - 2*size / 2, 2*size, 2*size);
            }

            ctx.stroke();
        }
    }

    requestAnimationFrame(draw);
}

function changeColors() {
    colors = colors.map(() => `hsl(${Math.random() * 360}, 100%, 50%)`);
}

function toggleShape() {
    isCircle = !isCircle; 
}

BUTTON_START.addEventListener('click', startAudio);
BUTTON_CHANGE.addEventListener('click', changeColors);
BUTTON_CHANGE_SHAPE.addEventListener('click', toggleShape);



