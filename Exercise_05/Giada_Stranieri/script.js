const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const shapeCountInput = document.getElementById('shapeCount');
const speedInput = document.getElementById('speed');
const shapeTypeInput = document.getElementById('shapeType');
const colorPicker = document.getElementById('colorPicker');

let analyser;
let dataArray;
let shapes = [];
let globalSpeed = 1;
let selectedShape = "all";
let customColor = false;
let chosenColor = "#ff0000";


function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
}


function getColor() {
    return customColor ? chosenColor : `hsl(${Math.random() * 360}, 80%, 60%)`;
}


function createShape(x, y) {
    const types = selectedShape === "all" ? ["circle", "rectangle", "triangle"] : [selectedShape];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = Math.random() * 30 + 10;
    const color = getColor();
    return { x, y, size, type, color, dx: (Math.random() * 4 - 2) * globalSpeed, dy: (Math.random() * 4 - 2) * globalSpeed };
}


function drawShape(shape) {
    ctx.fillStyle = shape.color;

    if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
        ctx.fill();
    } else if (shape.type === "rectangle") {
        ctx.fillRect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
    } else if (shape.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y - shape.size);
        ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
        ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
        ctx.closePath();
        ctx.fill();
    }
}


function updateShapes(audioData) {
    shapes.forEach((shape, i) => {
        
        shape.size = 10 + (audioData[i % audioData.length] / 255) * 30;

        
        shape.x += shape.dx;
        shape.y += shape.dy;

        
        if (shape.x < 0 || shape.x > canvas.width) shape.dx *= -1;
        if (shape.y < 0 || shape.y > canvas.height) shape.dy *= -1;
    });
}


function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            
            generateShapes();

            draw();
        })
        .catch(err => {
            console.error('Errore nell\'accesso al microfono:', err);
        });
}


function generateShapes() {
    shapes = [];
    const count = parseInt(shapeCountInput.value) || 30;
    for (let i = 0; i < count; i++) {
        shapes.push(createShape(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}


function draw() {
    requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    analyser.getByteFrequencyData(dataArray);

    updateShapes(dataArray);

    shapes.forEach(shape => drawShape(shape));
}


shapeCountInput.addEventListener("input", generateShapes);
speedInput.addEventListener("input", (e) => {
    globalSpeed = parseFloat(e.target.value);
    generateShapes();
});
shapeTypeInput.addEventListener("input", (e) => {
    selectedShape = e.target.value;
    generateShapes();
});
colorPicker.addEventListener("input", (e) => {
    customColor = true;
    chosenColor = e.target.value;
});


resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    generateShapes();
});

startButton.addEventListener('click', startAudio);
