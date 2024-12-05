// Get HTML elements
const CANVAS = document.getElementById('visualizer_canvas');
const CONTAINER = document.getElementById('canvas_container');
const ctx = CANVAS.getContext('2d');
const START = document.getElementById('start');
const STOP = document.getElementById('stop');
const CLEAN = document.getElementById('clean');
const DOWNLOAD = document.getElementById('download');
const COLOR_INPUT1 = document.getElementById('color_input1');
const COLOR_INPUT2 = document.getElementById('color_input2');
const ANGLE_INPUT = document.getElementById('number_input'); // Rotation angle input
const AUTO_CLEAR = document.getElementById('auto_clear'); // Auto clear canvas
const BRUSH_SIZE_INPUT = document.getElementById('brush_size'); // Brush size
const PRESET = document.getElementById('preset'); // Preset selector
const SCALE_INPUT = document.getElementById('scale_input'); // Scale factor input

// Preset configurations
// Pop Art preset configurations
const presets = {
    none: {
        backgroundColor: "#ffffff",
        brushColor: "#000000",
        brushSize: 2,
        rotationAngle: 0
    },
    andyWarhol: {
        backgroundColor: "#ffe135", // Banana yellow
        brushColor: "#ff69b4", // Hot pink
        brushSize: 2,
        rotationAngle: 30
    },
    royLichtenstein: {
        backgroundColor: "#ffffff", // White
        brushColor: "#ff0000", // Red
        brushSize: 3,
        rotationAngle: 30
    },
    keithHaring: {
        backgroundColor: "#000000", // Black
        brushColor: "#00ff00", // Neon green
        brushSize: 4,
        rotationAngle: 60
    },
    eduardoPaolozzi: {
        backgroundColor: "#2f4f4f", // Dark slate gray
        brushColor: "#ff6347", // Tomato red
        brushSize: 2,
        rotationAngle: 90
    },
    robertRauschenberg: {
        backgroundColor: "#dcdcdc", // Light gray
        brushColor: "#4682b4", // Steel blue
        brushSize: 3,
        rotationAngle: 0
    }
};

let scaleFactor = 1; // Default scale factor (no scaling)
let backgroundColor = "#ffffff";
let brushColor = "#000000";
let brushSize = 2; // Initial brush size
CANVAS.style.backgroundColor = backgroundColor;

let analyser, dataArray, audioContext, audioStream, animationFrameId;
let isRecording = false; // Recording state flag
let isPaused = false; // Pause state flag
let actionCooldown = false; // Cooldown flag to prevent repeated triggers

// Update scale factor
SCALE_INPUT.addEventListener('input', (e) => {
    const scale = parseFloat(e.target.value);
    if (!isNaN(scale) && scale >= 0 && scale <= 2) {
        scaleFactor = scale;
        console.log('Scale factor updated:', scaleFactor);
    } else {
        alert('Please enter a valid scale factor between 0 and 2.');
        e.target.value = scaleFactor; // Revert to current valid value
    }
});

// Dynamically resize the canvas
function resizeCanvas() {
    CANVAS.width = CONTAINER.offsetWidth;
    CANVAS.height = CONTAINER.offsetHeight;
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Center point and rotation angle
let rotationAngle = 0;
let angleIncrement = 0; // Default rotation angle increment is 0

// Update background color
COLOR_INPUT1.addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        backgroundColor = color;
        CANVAS.style.backgroundColor = backgroundColor;
    } else {
        console.warn('Invalid color input, keeping the previous value.');
    }
});

// Apply preset function
function applyPreset(preset) {
    if (presets[preset]) {
        const config = presets[preset];
        backgroundColor = config.backgroundColor;
        brushColor = config.brushColor;
        brushSize = config.brushSize;
        angleIncrement = (config.rotationAngle * Math.PI) / 180;

        // Update UI
        COLOR_INPUT1.value = backgroundColor;
        COLOR_INPUT2.value = brushColor;
        BRUSH_SIZE_INPUT.value = brushSize;
        ANGLE_INPUT.value = config.rotationAngle;

        // Update canvas
        CANVAS.style.backgroundColor = backgroundColor;

        console.log(`Applied preset: ${preset}`);
    }
}

// Listen to preset selection
PRESET.addEventListener('change', (e) => {
    const selectedPreset = e.target.value;
    applyPreset(selectedPreset);
});

// Update brush color
COLOR_INPUT2.addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        brushColor = color;
    } else {
        console.warn('Invalid color input, keeping the previous value.');
    }
});

// Update brush size
BRUSH_SIZE_INPUT.addEventListener('input', (e) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size) && size >= 1 && size <= 20) {
        brushSize = size;
        console.log('Brush size updated:', brushSize);
    } else {
        alert('Please enter a valid brush size between 1 and 20.');
        e.target.value = brushSize; // Revert to current value
    }
});

// Update rotation angle increment
ANGLE_INPUT.addEventListener('input', (e) => {
    let userAngle = parseFloat(e.target.value);
    if (isNaN(userAngle) || userAngle < -360 || userAngle > 360) {
        alert('Please enter a valid angle between -360 and 360');
        e.target.value = Math.min(360, Math.max(-360, userAngle || 0));
    } else {
        angleIncrement = (userAngle * Math.PI) / 180;
        console.log('Angle increment:', angleIncrement);
    }
});

// Ensure auto_clear option is off by default on page load
window.addEventListener('load', () => {
    AUTO_CLEAR.checked = false; // Default to Auto Clear Canvas off
});

// Cooldown function to delay actions by 300ms
function withCooldown(callback) {
    if (actionCooldown) return;
    actionCooldown = true;
    setTimeout(() => {
        actionCooldown = false;
    }, 300);
    try {
        callback();
    } catch (error) {
        console.error('Error in callback:', error);
        actionCooldown = false; // Ensure cooldown flag is reset
    }
}

// Start audio analysis
function startAudio() {
    if (isRecording) return;

    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            isRecording = true;
            isPaused = false;
            draw();
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
            alert('Unable to access microphone. Please check your browser settings.');
        });
}

// Stop audio analysis
function stopAudio() {
    if (!isRecording) return;

    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
    }
    cancelAnimationFrame(animationFrameId);
    isRecording = false;
    isPaused = false;
}

// Pause audio analysis
function pauseAudio() {
    if (isRecording && !isPaused) {
        cancelAnimationFrame(animationFrameId);
        isPaused = true;
    }
}

// Resume audio analysis
function resumeAudio() {
    if (isRecording && isPaused) {
        draw();
        isPaused = false;
    }
}

// Draw visualization
function draw() {
    const width = CANVAS.width;
    const height = CANVAS.height;

    analyser.getByteFrequencyData(dataArray);

    const maxAmplitude = Math.max(...dataArray);

    // Clear the canvas based on user preference
    if (AUTO_CLEAR.checked) {
        ctx.clearRect(0, 0, width, height); // Auto clear canvas
    }

    for (let i = 0; i < dataArray.length; i++) {
        const amplitude = dataArray[i];
        const y = (amplitude / maxAmplitude) * height * scaleFactor; // Apply scaling factor
        const x = (i / dataArray.length) * width * scaleFactor; // Apply scaling factor

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(scaleFactor, scaleFactor); // Add scaling transformation
        ctx.rotate(rotationAngle);
        ctx.translate(-width / 2, -height / 2);

        ctx.fillStyle = brushColor;
        ctx.fillRect(x, height - y, brushSize, brushSize);

        ctx.restore();
    }

    rotationAngle += angleIncrement;
    animationFrameId = requestAnimationFrame(draw);
}

// Clear canvas
function clearCanvas() {
    stopAudio(); // Stop audio analysis
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    rotationAngle = 0;
    isRecording = false; // Reset state
    isPaused = false;
    console.log('Canvas cleared.');
}

// Download canvas as image
function downloadCanvas() {
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = CANVAS.width;
    offscreenCanvas.height = CANVAS.height;

    offscreenCtx.fillStyle = backgroundColor;
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.drawImage(CANVAS, 0, 0, CANVAS.width, CANVAS.height);

    const dataUrl = offscreenCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'canvas-image.png';
    link.click();
}

// Keyboard event listeners
window.addEventListener('keydown', (e) => {
    withCooldown(() => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!isRecording) {
                startAudio();
            } else if (isPaused) {
                resumeAudio();
            } else {
                pauseAudio();
            }
        } else if (e.code === 'KeyC') {
            clearCanvas();
        } else if (e.code === 'KeyS') {
            downloadCanvas();
        }
    });
});

// Button event bindings (300ms cooldown)
START.addEventListener('click', () => withCooldown(startAudio));
STOP.addEventListener('click', () => withCooldown(stopAudio));
CLEAN.addEventListener('click', () => withCooldown(clearCanvas));
DOWNLOAD.addEventListener('click', () => withCooldown(downloadCanvas));
