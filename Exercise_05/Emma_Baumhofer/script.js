const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("canvas-container");
const ctx = CANVAS.getContext("2d");

const BUTTON = document.getElementById("open-mic");

// Dynamically set the canvas width and height
function resizeCanvas() {
    CANVAS.width = CONTAINER.offsetWidth;
    CANVAS.height = CONTAINER.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Variables
let analyser;
let dataArray;
let selectedShape = "circle"; // Default shape

// Shape selection logic
document.querySelectorAll("#shape-selection .shape").forEach((shape) => {
    shape.addEventListener("click", (e) => {
        selectedShape = e.target.classList.contains("circle")
            ? "circle"
            : e.target.classList.contains("square")
            ? "square"
            : "triangle";
        console.log(`Selected shape: ${selectedShape}`);
    });
});


function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Size of the frequency data (this will affect resolution)
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

// for security reasons, ask user to allow use of the microphone


// Visualization function
function draw(){
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

    analyser.getByteTimeDomainData(dataArray);
    console.log(dataArray);

    const dynamicSize = dataArray[2] / 2 + 20;
    const centerX = CANVAS.width / 2;
    const centerY = CANVAS.height / 2;

    //Draw soundwave
    ctx.beginPath();
    ctx.strokeStyle = "whitesmoke";
    const gap = CANVAS.width / dataArray.length;
    for (let i = 0; i < dataArray.length; i++) {
        const y = (dataArray[i] / 255) * CANVAS.height;

        if (i === 0) {
            ctx.moveTo(i * gap, y);
        } else {
            ctx.lineTo(i * gap, y);
        }
    }
    ctx.stroke();

    // Draw the selected shape
    ctx.fillStyle = "whitesmoke";
    ctx.beginPath();
    if (selectedShape === "circle") {
        ctx.arc(centerX, centerY, dynamicSize, 0, Math.PI * 2);
        ctx.fill();
    } else if (selectedShape === "square") {
        const size = dynamicSize;
        ctx.rect(centerX - size / 2, centerY - size / 2, size, size);
        ctx.fill();
    } else if (selectedShape === "triangle") {
        const size = dynamicSize * 1.5; // Adjust triangle size
        ctx.moveTo(centerX, centerY - size / 2);
        ctx.lineTo(centerX - size / 2, centerY + size / 2);
        ctx.lineTo(centerX + size / 2, centerY + size / 2);
        ctx.closePath();
        ctx.fill();
    }

    requestAnimationFrame(draw);
}

// Start the microphone visualization when the button is clicked
BUTTON.addEventListener("click", () => {
    startAudio();
});