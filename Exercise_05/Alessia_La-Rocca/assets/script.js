const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const ctx = CANVAS.getContext("2d");

const BUTTON = document.getElementById("start_listening");
const LETTER_INPUT = document.getElementById("letter_input");

function setupCanvas() {
    CANVAS.width = CONTAINER.offsetWidth;
    CANVAS.height = window.innerHeight;
}
setupCanvas();

let analyser;
let dataArray;
let baseFontSize = 100; // Base font size for the letter
let smoothedVolume = 0;

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
            alert('Unable to access microphone. Please check your permissions.');
            console.error('Error accessing microphone:', err);
        });
}

function draw() {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

    analyser.getByteTimeDomainData(dataArray);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        let value = dataArray[i] - 128;
        sum += value * value;
    }
    let volume = Math.sqrt(sum / dataArray.length); // RMS volume

    // Smooth volume for stable size changes
    smoothedVolume = 0.8 * smoothedVolume + 0.2 * volume;

    // Scale font size based on smoothed volume
    let fontSize = baseFontSize + smoothedVolume * 150;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#5f25e0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the letter in the center of the canvas
    const letter = LETTER_INPUT?.value || "SCREAM";
    ctx.fillText(letter, CANVAS.width / 2, CANVAS.height / 2);

    requestAnimationFrame(draw);
}

// Adjust canvas on window resize
window.addEventListener("resize", setupCanvas);

// Start listening on button click
BUTTON.addEventListener("click", () => {
    startAudio();
});
