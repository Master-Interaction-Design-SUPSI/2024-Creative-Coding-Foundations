const CANVAS = document.getElementById("my-canvas");
const ctx = CANVAS.getContext('2d');

const startButton = document.getElementById("start-listening");
const stopButton = document.getElementById("stop-listening");
const toggleButton = document.getElementById("switch");

let analyser;
let dataArray;
let animationFrame;
let audioStream;
let audioContext;

let showCircle = true; // By default, show a circle

function startAudio() {
    if (!window.AudioContext) {
        alert("AudioContext not supported")
        return;
    }

    audioContext = new window.AudioContext();

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);            
            draw();
        })
        .catch(err => console.error("Microphone error:", err));
}

function draw() {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    analyser.getByteFrequencyData(dataArray);

    const avgFrequency = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    const centerX = CANVAS.width / 2;
    const centerY = CANVAS.height / 2;
    const size = avgFrequency * 3;

    if (showCircle) {
        // Draw a circle
        ctx.beginPath();
        ctx.fillStyle = `rgb(${size}, 100, 200)`;
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Draw a square
        ctx.fillStyle = `rgb(100, ${avgFrequency}, 150)`;
        ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
    }

    animationFrame = requestAnimationFrame(draw);
}

function stopAudio() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (audioStream) audioStream.getTracks().forEach(track => track.stop());
    if (audioContext) audioContext.close();
    console.log("Stopped audio.");
}
// Event listeners for buttons
startButton.addEventListener("click", startAudio);
stopButton.addEventListener("click", stopAudio);
toggleButton.addEventListener("click", () => {
    showCircle = !showCircle;

});