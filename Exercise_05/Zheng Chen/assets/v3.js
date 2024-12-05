const CANVAS = document.getElementById('canvas');
const CONTAINER = document.getElementById('container');
const ctx = CANVAS.getContext('2d');
const START = document.getElementById('start');
const STOP = document.getElementById('stop');
const CLEAN = document.getElementById('clean');
let COLOR_INPUT1 = document.getElementById('color_input1'); // Canvas background color input
let COLOR_INPUT2 = document.getElementById('color_input2'); // Brush color input

// Set canvas dimensions and color
CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;
const width = CANVAS.width;
const height = CANVAS.height;

// Set initial background color to white and brush color to black
let backgroundColor = "#ffffff"; // Canvas background color (white)
let brushColor = "blue"; // Brush color (black)
CANVAS.style.backgroundColor = backgroundColor; // Set initial background color

let analyser;
let dataArray;
let audioContext;
let audioStream;
let animationFrameId;

// Set the center of the canvas as the origin of the coordinate system
let centerX = width/2;
let centerY = height/2;


// Update canvas background color when user selects a new color
COLOR_INPUT1.addEventListener('input', (e) => {
    backgroundColor = e.target.value; // Update background color
    CANVAS.style.backgroundColor = backgroundColor; // Apply background color to canvas
    console.log('Canvas background color:', backgroundColor);
});

// Update brush color when user selects a new color
COLOR_INPUT2.addEventListener('input', (e) => {
    brushColor = e.target.value; // Update brush color
    console.log('Brush color:', brushColor);
});

// Start audio analysis
function startAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512; // Number of frequency bins (smaller number for faster drawing)
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream; // Save the stream for later cleanup
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            draw(); // Start visualization
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
        });
}

// Stop audio analysis
function stopAudio() {
    if (audioContext) {
        audioContext.close(); // Close the audio context to release resources
        audioContext = null;
    }
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop()); // Stop the microphone
        audioStream = null;
    }
    cancelAnimationFrame(animationFrameId); // Stop the animation loop
}

function draw() {
    analyser.getByteFrequencyData(dataArray); // 获取频率数据

    const maxAmplitude = Math.max(...dataArray); // 获取最大振幅用于比例缩放


    // 循环遍历频率数据并绘制点
    for (let i = 0; i < dataArray.length; i++) {
        const amplitude = dataArray[i]; // 当前频率的振幅值

        // 将振幅映射到画布的y坐标
        const y = (amplitude / maxAmplitude) * height * 0.5;

        // 线性映射频率到x坐标
        const x = (i / dataArray.length) * width * 0.5;

        // 调整坐标，将绘制移动到画布右上角
        const adjustedX = centerX + x;  // x轴偏移中心点
        const adjustedY = centerY - y; // 翻转y并相对中心偏移

        // 在控制台输出点的坐标
        console.log(`Point ${i}: x=${adjustedX.toFixed(2)}, y=${adjustedY.toFixed(2)}`);

        // 绘制点
        ctx.fillStyle = brushColor;
        ctx.fillRect(adjustedX, adjustedY, 1, 1); // 在调整后的坐标处绘制一个小矩形
    }

    animationFrameId = requestAnimationFrame(draw); // 循环动画
}


// Clear canvas
CLEAN.addEventListener('click', () => {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
});

// Event listeners
START.addEventListener("click", startAudio);
STOP.addEventListener("click", stopAudio);
