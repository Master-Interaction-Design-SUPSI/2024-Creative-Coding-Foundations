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
let brushColor = "#000000"; // Brush color (black)
CANVAS.style.backgroundColor = backgroundColor; // Set initial background color

let analyser;
let dataArray;
let audioContext;
let audioStream;
let animationFrameId;

// Set the center of the canvas as the origin of the coordinate system
let centerX = width / 2;
let centerY = height / 2;

// Initialize previous point as the center of the canvas
let prevX = centerX;
let prevY = centerY;

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

// Draw waveform using frequency data (frequency as x, amplitude as y)
// This time we will draw a continuous curve starting from the center of the canvas
function draw() {
    analyser.getByteFrequencyData(dataArray); // Get frequency data

    const maxAmplitude = Math.max(...dataArray); // Get max amplitude for scaling purposes

    // Start drawing path
    ctx.beginPath();
    ctx.moveTo(prevX, prevY); // Start from the previous point (initially the center)

    // Loop through frequency data and draw a continuous curve
    for (let i = 0; i < dataArray.length; i++) {
        const amplitude = dataArray[i]; // Get the amplitude for this frequency bin
        const y = (amplitude / maxAmplitude) * height; // Map amplitude to y-axis (reversed)

        // Map frequency index to x-coordinate (spread across canvas width)
        const x = (i / dataArray.length) * width;

        // Calculate the adjusted x, y coordinates starting from the center
        const adjustedX = centerX + (x - width / 2);  // Map frequency to x-axis
        const adjustedY = centerY - (y - height / 2); // Map amplitude to y-axis (invert y for better visualization)

        // Log the current coordinates to the console
        // console.log(`Updated Coordinates: x: ${adjustedX}, y: ${adjustedY}`);

        // Draw the line from the previous point to the current point
        ctx.lineTo(adjustedX, adjustedY);
    }

    ctx.strokeStyle = brushColor;
    ctx.stroke(); // Render the path

    // Update the previous point for the next iteration
    prevX = centerX + (dataArray.length / 2); // Update prevX for next frame
    prevY = centerY; // Keep prevY at center for smooth line transitions

    animationFrameId = requestAnimationFrame(draw); // Loop the animation
}

// Clear canvas
CLEAN.addEventListener('click', () => {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    prevX = centerX; // Reset starting position to center
    prevY = centerY; // Reset starting position to center
});

// Event listeners
START.addEventListener("click", startAudio);
STOP.addEventListener("click", stopAudio);
