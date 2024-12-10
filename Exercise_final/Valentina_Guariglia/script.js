const CANVAS = document.getElementById('myCanvas');
const ctx = CANVAS.getContext('2d');

const startButton = document.getElementById('button_start_serial');
const stopButton = document.getElementById('button_stop_serial');

// Variables
let analyser, dataArray; // Analyser processes audio and dataArray stores data
let colors = ['#33FFF6'];
let baseStep = 60;
let currentShape = 'circle'; // Choose current shape: 'circle', 'rect', or 'triangle' 
let serialPort; // Represents the serial port
let reader; // For reading data from the serial port
let numShapes = 1; // Default number of shapes
let scalingFactor = 1; // Factor to scale shapes based on window size


function resizeCanvas() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight; 

    scalingFactor = Math.min(CANVAS.width, CANVAS.height) / 800;
}


function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
    analyser = audioContext.createAnalyser(); 
    analyser.fftSize = 256; 
    dataArray = new Uint8Array(analyser.frequencyBinCount); 

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream); 
            source.connect(analyser); 
            draw(); 
        });
}


function draw() {
    ctx.globalAlpha = 0.025;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.globalAlpha = 1.0;

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);

        const avgVolume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

        for (let i = 0; i < numShapes; i++) {
            const size = (baseStep * (i + 1) + avgVolume) * scalingFactor;
            const x = CANVAS.width / 2;
            const y = CANVAS.height / 2;

            ctx.beginPath();
            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = 4;

            if (currentShape === 'circle') {
                ctx.arc(x, y, size, 0, Math.PI * 2);
            } else if (currentShape === 'rect') {
                ctx.rect(x - size / 2, y - size / 2, size, size);
            } else if (currentShape === 'triangle') {
                const height = (Math.sqrt(3) / 2) * size; 
                const halfBase = size / 2; 
            
                ctx.moveTo(x, y - height / 2); // Top vertex
                ctx.lineTo(x - halfBase, y + height / 2); // Bottom left vertex
                ctx.lineTo(x + halfBase, y + height / 2); // Bottom right vertex
                ctx.closePath();
            }

            ctx.stroke();
        }
    }

    requestAnimationFrame(draw);
}

async function handleSerialInput() {
    while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        const trimmedValue = value.trim();

        if (trimmedValue.startsWith("NUM_SHAPES")) {
            const shapeCount = parseInt(trimmedValue.split(":")[1], 10);
            if (!isNaN(shapeCount)) {
                numShapes = shapeCount;
            }
        } else {
            switch (trimmedValue) {
                case 'START_LISTENING':
                    startAudio();
                    break;
                case 'CHANGE_COLORS':
                    colors = colors.map(() => `hsl(${Math.random() * 360}, 75%, 50%)`);
                    break;
                case 'CHANGE_SHAPE':
                    if (currentShape === 'circle') {
                        currentShape = 'rect';
                    } else if (currentShape === 'rect') {
                        currentShape = 'triangle';
                    } else {
                        currentShape = 'circle';
                    }
                    break;
            }
        }
    }
}


startButton.addEventListener('click', async () => {
    serialPort = await navigator.serial.requestPort(); 
    await serialPort.open({ baudRate: 250000 }); 

    const textDecoder = new TextDecoderStream(); 
    const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader(); 
    handleSerialInput(); 

    // Toggle button visibility
    startButton.classList.add('hidden');
    stopButton.classList.remove('hidden');
});


stopButton.addEventListener('click', async () => {
    reader.cancel(); 
    await serialPort.close(); 
    reader = null; 

    
    startButton.classList.remove('hidden');
    stopButton.classList.add('hidden');
});

window.addEventListener('resize', () => {
    resizeCanvas();
});

resizeCanvas();
