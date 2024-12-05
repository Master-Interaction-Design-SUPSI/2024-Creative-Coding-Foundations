const CANVAS = document.getElementById("canvas");
const ctx = CANVAS.getContext("2d");

const BUTTON = document.getElementById("start_listening");
const barWidthSlider = document.getElementById("barWidth");
const blurLevelSlider = document.getElementById("blurLevel");
const hueControlSlider = document.getElementById("hueControl");

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const width = CANVAS.width;
const height = CANVAS.height;

let analyser;
let dataArray;

function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
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

function drawVisualiser(bufferLength, barWidth, dataArray, blurLevel, hueControl) {
    let x = 0;

    CANVAS.style.filter = `blur(${blurLevel}px)`;

    for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i] * 1.5;

        ctx.save();
        ctx.translate(width / 2, height / 2);

        const angle = i * Math.PI * 10 / bufferLength;
        ctx.rotate(angle);

        const hue = (hueControl + i * 0.4) % 360;

        const minBrightness = 0;
        const maxBrightness = 75;
        const brightness = minBrightness + (barHeight / 255) * (maxBrightness - minBrightness);

        ctx.fillStyle = `hsl(${hue}, 100%, ${brightness}%)`;

        ctx.fillRect(0, 0, barWidth, barHeight);

        ctx.restore();
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    analyser.getByteFrequencyData(dataArray);

    const bufferLength = dataArray.length;
    const barWidth = barWidthSlider.value;
    const blurLevel = blurLevelSlider.value;
    const hueControl = hueControlSlider.value;

    drawVisualiser(bufferLength, barWidth, dataArray, blurLevel, hueControl);

    requestAnimationFrame(draw);
}

BUTTON.addEventListener("click", function () {
    startAudio();
});
