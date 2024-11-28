const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const button = document.getElementById('toggle');
const hueSlider = document.getElementById('hueSlider'); // Slider for controlling hue
const minRadiusSlider = document.getElementById('minRadiusSlider'); // Slider for controlling min radius slider

// Setting the screen dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioContext;
let analyser;
let dataArray;
let source;
let microphoneStream;
let playing = false;

// Start listening
function startMicrophone() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024; // Resolution of frequency data --> power of 2
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      microphoneStream = stream; // Save the stream for stopping later
      source = audioContext.createMediaStreamSource(stream); // Connect microphone
      source.connect(analyser); // Attach analyser
      playing = true; // Update the state
      animate(); // Start visualization loop
    })
    .catch(err => console.error("We are having issues accessing your microphone:", err));
}

// Stop listening
function stopMicrophone() {
  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop()); // Stop all tracks
    microphoneStream = null; // Reset the microphone stream
  }
  if (audioContext) {
    audioContext.close(); // Shut down audio context
    audioContext = null; // Reset the audio context
  }
  playing = false; // Reset playing state
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
}

// Toggle 
function toggleMicrophone() {
  if (!playing) {
    startMicrophone();
  } else {
    stopMicrophone();
  }
}

// Animation
function animate() {
  if (!playing) return; // Exit early if the microphone is off

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2); // Centering the visualization

  analyser.getByteFrequencyData(dataArray); // Get frequency data
  
  console.log(dataArray); // console the Array

  // Set stroke color from on the hue slider value
  const hue = map(parseInt(hueSlider.value, 10), parseInt(hueSlider.min, 10), parseInt(hueSlider.max, 10), 0, 360);
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

  ctx.beginPath();

  const bufferLength = dataArray.length;
  const minRadius = parseFloat(minRadiusSlider.value); // Get minRadius from the slider
  const maxRadius = 500; // Fixed maxRadius (adjust as desired)

  for (let i = 0; i < bufferLength; i++) {
    const angle = (i / bufferLength) * 2 * Math.PI;
    const amplitude = dataArray[i]; // Value between 0 and 255
    const radius = map(amplitude, 0, 255, minRadius, maxRadius); // Map amplitude to radius
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();

  ctx.restore();

  requestAnimationFrame(animate);
}

// translate value captured in readable
function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

button.addEventListener('click', toggleMicrophone);

