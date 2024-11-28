const canvas = document.getElementById('audioCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const colorPicker = document.getElementById('colorPicker');
const lineWidthInput = document.getElementById('lineWidth');


let audioContext, analyser, dataArray, source, animationFrameId;
let isRunning = false;
let imageObjects = [];


function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


async function startAudio() {
    if (isRunning) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        isRunning = true;
        stopButton.disabled = false;
        startButton.disabled = true;

        draw();
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access the microphone. Please check permissions.');
    }
}

function stopAudio() {
    if (!isRunning) return;

    isRunning = false;
    stopButton.disabled = true;
    startButton.disabled = false;

    if (audioContext) {
        audioContext.close();
    }
    if (source) {
        source.disconnect();
    }
    cancelAnimationFrame(animationFrameId);
}


function draw() {
    if (!isRunning) return;

 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    analyser.getByteTimeDomainData(dataArray);

   
    ctx.lineWidth = lineWidthInput.value;
    ctx.strokeStyle = colorPicker.value;
    ctx.beginPath();

    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;

    let noiseLevel = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0; 
        const y = (v * canvas.height) / 2;

        noiseLevel += Math.abs(v - 1); 

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

 
    animationFrameId = requestAnimationFrame(draw);
}
startButton.addEventListener('click', startAudio);
stopButton.addEventListener('click', stopAudio);