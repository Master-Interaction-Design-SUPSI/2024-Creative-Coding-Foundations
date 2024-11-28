const canvas = document.getElementById("audioCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const waveThicknessSlider = document.getElementById("waveThickness");
const waveThicknessValue = document.getElementById("waveThicknessValue");
const circleRadiusSlider = document.getElementById("circleRadius");
const circleRadiusValue = document.getElementById("circleRadiusValue");

let animationId;
let audioContext = null;
let analyser = null;
let source = null;
let stream = null;
let dataArray = null;

// Default visualizer parameters
let waveThickness = parseInt(waveThicknessSlider.value);
let circleRadius = parseInt(circleRadiusSlider.value);

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.6;
}

function draw() {
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCircleVisualizer(dataArray, analyser.frequencyBinCount, "#F9DC5C");
  drawWaveVisualizer(dataArray, analyser.frequencyBinCount, "#ff0066");

  animationId = requestAnimationFrame(draw);
}

function drawCircleVisualizer(dataArray, bufferLength, color) {
  const barWidth = (2 * Math.PI) / bufferLength;

  ctx.strokeStyle = color;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    const angle = barWidth * i;

    const x1 = canvas.width / 2 + Math.cos(angle) * circleRadius;
    const y1 = canvas.height / 2 + Math.sin(angle) * circleRadius;
    const x2 = canvas.width / 2 + Math.cos(angle) * (circleRadius + barHeight);
    const y2 = canvas.height / 2 + Math.sin(angle) * (circleRadius + barHeight);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function drawWaveVisualizer(dataArray, bufferLength, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = waveThickness; // Use adjustable thickness
  ctx.beginPath();

  for (let i = 0; i < bufferLength; i++) {
    const x = (i / bufferLength) * canvas.width;
    const y =
      canvas.height / 2 +
      (dataArray[i] / 2) * Math.sin((i / bufferLength) * Math.PI * 4);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}

startButton.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    startButton.disabled = true;
    stopButton.disabled = false;

    draw();
  } catch (err) {
    console.error("Error accessing microphone:", err);
    alert("Unable to access microphone. Please check permissions.");
  }
});

stopButton.addEventListener("click", () => {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  cancelAnimationFrame(animationId);

  startButton.disabled = false;
  stopButton.disabled = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Update wave thickness dynamically
waveThicknessSlider.addEventListener("input", (event) => {
  waveThickness = parseInt(event.target.value);
  waveThicknessValue.textContent = waveThickness; // Update display value
});

// Update circle radius dynamically
circleRadiusSlider.addEventListener("input", (event) => {
  circleRadius = parseInt(event.target.value);
  circleRadiusValue.textContent = circleRadius; // Update display value
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
