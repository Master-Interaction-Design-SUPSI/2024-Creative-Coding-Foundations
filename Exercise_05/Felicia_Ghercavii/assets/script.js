const CANVAS = document.getElementById('canvas');
const CONTAINER = document.getElementById('container'); // Create canvas & context
const ctx = CANVAS.getContext('2d'); // Append the 2D context
const START = document.getElementById('start_listening');
const COLOR_PICKER = document.getElementById('color_picker'); // Circle color picker
const SLIDER_X = document.getElementById('slider-x'); // Slider for circle size
const BG_COLOR_PICKER = document.getElementById('bg_color_picker'); // Body background color picker

// Setup the canvas dimensions
CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = 400;
const width = CANVAS.width;
const height = CANVAS.height;

let analyser;
let dataArray;

// Set initial background color from the picker value
document.body.style.backgroundColor = BG_COLOR_PICKER.value;

// Update background color on input change
BG_COLOR_PICKER.addEventListener('input', () => {
  document.body.style.backgroundColor = BG_COLOR_PICKER.value;
});

function startAudio() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256; // Size of the frequency data (affects resolution)
  let bufferLength = analyser.frequencyBinCount; // Number of frequency data points
  dataArray = new Uint8Array(bufferLength);

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const source = audioContext.createMediaStreamSource(stream); // Create audio source from microphone
      source.connect(analyser); // Connect the source to the analyser

      draw(); // Start the visualization loop
    })
    .catch(err => {
      console.error('Error accessing microphone:', err);
    });
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  // Change circle's bounce based on audio data
  let audioValue = Math.max(...dataArray) / 255;
  let bounce = audioValue * 200;
  let baseRadius = parseInt(SLIDER_X.value, 10); // User-defined radius
  let dynamicRadius = baseRadius + bounce; // Combine user size with audio bounce

  // Smooth transition for dynamicRadius using easing
  dynamicRadius = dynamicRadius * 0.8 + baseRadius * 0.2;

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = COLOR_PICKER.value; // Use the selected color
  ctx.shadowBlur = 20;
  ctx.shadowColor = COLOR_PICKER.value;
  ctx.arc(width / 2, height / 2, dynamicRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Get the audio data
  analyser.getByteTimeDomainData(dataArray);

  // Visualize the waveform
  ctx.beginPath();
  ctx.strokeStyle = 'aliceblue';
  ctx.lineWidth = 2;

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

  requestAnimationFrame(draw);
}

// Start audio when user clicks the button
START.addEventListener("click", () => {
  startAudio();
  console.log('Audio started');
});
