let CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const ctx = CANVAS.getContext("2d");
const BUTTON = document.getElementById("start-listening");
const RESET = document.getElementById("reset");
const COLOR_INPUT = document.getElementById("color-input");
const CIRCLE_SIZE = document.getElementById("circle_size");

//set up
CANVAS.width = window.innerWidth;
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

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const source = audioContext.createMediaStreamSource(stream); // Create audio source from microphone
      source.connect(analyser); // Connect the source to the analyser

      draw(); // Start the visualization loop
    })
    .catch((err) => {
      console.error("Error accessing microphone:", err);
    });
}

// for security reasons, it is requested to ask user to allow the use of the microphone
BUTTON.addEventListener("click", () => {
  startAudio();
});

RESET.addEventListener("click", () => {
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = "rgba(00, 100, 100, 1)";
  ctx.fill();
});

let color_circle = "lightblue";
COLOR_INPUT.addEventListener("input", function () {
  color_circle = COLOR_INPUT.value;
});

let circle_size = 0;
CIRCLE_SIZE.addEventListener("input", function () {
  circle_size = CIRCLE_SIZE.value;
  console.log(circle_size);
});

function draw() {
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = "rgba(00, 100, 100, 0.005)";
  ctx.fill();

  analyser.getByteTimeDomainData(dataArray);


  let rotationAngle = performance.now() / 1000;

  for (let i = 0; i < dataArray.length; i++) {
    let length = (dataArray[i] / 255) * (width / 4);
    ctx.save();
    ctx.translate(width / 2, height / 2);

    ctx.rotate(rotationAngle + (i * Math.PI * 2) / dataArray.length);

    ctx.beginPath();
    ctx.arc(length, circle_size, 20, 0, Math.PI * 2);
    ctx.fillStyle = color_circle;
    ctx.fill();

    ctx.restore();
  }

  requestAnimationFrame(draw);
}
