const CANVAS = document.getElementById('canvas');
const CONTAINER = document.getElementById('container');
const ctx = CANVAS.getContext('2d');
const START = document.getElementById('start');
const STOP = document.getElementById('stop');
const CLEAN = document.getElementById('clean');
const DOWNLOAD = document.getElementById('download');
const COLOR_INPUT1 = document.getElementById('color_input1');
const COLOR_INPUT2 = document.getElementById('color_input2');
const ANGLE_INPUT = document.getElementById('number_input'); // Rotation angle input

CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;
const width = CANVAS.width;
const height = CANVAS.height;

let backgroundColor = "#ffffff";
let brushColor = "#000000";
CANVAS.style.backgroundColor = backgroundColor;

let analyser, dataArray, audioContext, audioStream, animationFrameId;

// Center of the canvas
const centerX = width / 2;
const centerY = height / 2;

// Rotation angle in radians
let rotationAngle = 0; // Cumulative rotation angle
let angleIncrement = Math.PI / 90; // Default rotation increment (2 degrees per frame)

// Update canvas background color
COLOR_INPUT1.addEventListener('input', (e) => {
    backgroundColor = e.target.value;
    CANVAS.style.backgroundColor = backgroundColor;
});

// Update brush color
COLOR_INPUT2.addEventListener('input', (e) => {
    brushColor = e.target.value;
});

// Update rotation increment based on user input (1-360 degrees)
ANGLE_INPUT.addEventListener('input', (e) => {
    let userAngle = parseInt(e.target.value, 10);

    // Validate input range
    if (userAngle < 0) userAngle = 0;
    if (userAngle > 360) userAngle = 360;

    // Convert user input from degrees to radians per frame
    angleIncrement = (userAngle * Math.PI) / 180;
    console.log('Angle increment (radians per frame):', angleIncrement);
});

// Start audio analysis
function startAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            draw();
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
        });
}

// Stop audio analysis
function stopAudio() {
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
    }
    cancelAnimationFrame(animationFrameId);
}

// Draw visualization
function draw() {
    analyser.getByteFrequencyData(dataArray);
    const maxAmplitude = Math.max(...dataArray);

    for (let i = 0; i < dataArray.length; i++) {
        const amplitude = dataArray[i];
        const y = (amplitude / maxAmplitude) * height;
        const x = (i / dataArray.length) * width;

        const adjustedX = x;
        const adjustedY = height - y;

        ctx.save(); // Save current context state
        ctx.translate(centerX, centerY); // Move origin to canvas center
        ctx.rotate(rotationAngle); // Apply current rotation angle
        ctx.translate(-centerX, -centerY); // Restore origin

        ctx.fillStyle = brushColor;
        ctx.fillRect(adjustedX, adjustedY, 2, 2); // Draw a point

        ctx.restore(); // Restore previous context state
    }

    // Increment the rotation angle for the next frame
    rotationAngle += angleIncrement;

    animationFrameId = requestAnimationFrame(draw);
}

// Clear canvas
CLEAN.addEventListener('click', () => {
    cancelAnimationFrame(animationFrameId); // 停止动画
    ctx.clearRect(0, 0, width, height); // 清空画布
    rotationAngle = 0; // 重置旋转角度
    console.log('Canvas cleared and animation stopped.');
});

// Download canvas as an image
DOWNLOAD.addEventListener('click', () => {
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = 500;
    offscreenCanvas.height = 500;

    offscreenCtx.fillStyle = backgroundColor;
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.drawImage(CANVAS, 0, 0, width, height, 0, 0, 500, 500);

    const dataUrl = offscreenCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'canvas-image.png';
    link.click();
});

// Start/Stop audio analysis
START.addEventListener('click', startAudio);
STOP.addEventListener('click', stopAudio);
