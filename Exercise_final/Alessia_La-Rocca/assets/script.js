const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const ctx = CANVAS.getContext("2d");


let baseFontSize = 100;
let pot1Value = 0; 
let light1Value = 0; 
let isItalic = false; 
let currentFontIndex = 0; 
let previousButtonState = 1; 
let currentFontWeight = 400; 
let targetFontWeight = 400; 

// Fonts list
const fonts = [
    "'Satoshi', sans-serif",
    "'Zodiak', serif",
    "'General Sans', sans-serif",
    "'Boska', serif",
    "'Ranade', sans-serif",
    "'Sentient', serif"
];

const fontNames = ["Satoshi", "Zodiak", "General Sans", "Boska", "Ranade", "Sentient"];

// Get the text input element
const letterInput = document.getElementById('letter_input');

function setupCanvas() {
    CANVAS.width = CONTAINER.offsetWidth;
    CANVAS.height = window.innerHeight;
}
setupCanvas();

// Function Font Weight with light sensor
function calculateTargetFontWeight(light1Value) {
    if (light1Value < 400) return 300; // Light
    if (light1Value < 500) return 400; // Normal
    if (light1Value < 600) return 600; // Semi-bold
    if (light1Value < 800) return 700; // Bold
    return 900; // Extra-bold
}

// Funtion to get current font
function getCurrentFont() {
    return fonts[currentFontIndex % fonts.length]; 
}

function getCurrentFontName() {
    return fontNames[currentFontIndex % fontNames.length];
}

// Smooth transition 
function updateFontWeight() {
    const step = 10; // Velocità di transizione del peso
    if (Math.abs(targetFontWeight - currentFontWeight) < step) {
        currentFontWeight = targetFontWeight; 
    } else if (currentFontWeight < targetFontWeight) {
        currentFontWeight += step;
    } else {
        currentFontWeight -= step;
    }
}

// Draw text on canvas
function draw() {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Font size based on Potentiometer
    let fontSize = baseFontSize + (pot1Value / 1023) * 200; // 200px
    let fontStyle = isItalic ? "italic" : "normal"; 
    let fontFamily = getCurrentFont(); 

    updateFontWeight();

    // Get custom input text
    const customText = letterInput.value || getCurrentFontName(); 

    // Draw the custom text
    ctx.font = `${fontStyle} ${currentFontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = "#ebff70";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(customText, CANVAS.width / 2, CANVAS.height / 2);

    requestAnimationFrame(draw);
}

// Start the draw loop
draw();

// Window resize reactive
window.addEventListener("resize", setupCanvas);

// Add data page to sensors data
function updateWebPage(data) {
    const [pot1, light1, button, switchVal] = data.map(Number); 

    pot1Value = pot1;
    light1Value = light1;

    targetFontWeight = calculateTargetFontWeight(light1Value);

    isItalic = switchVal === 1;

    if (button === 0 && previousButtonState === 1) {
        currentFontIndex = (currentFontIndex + 1) % fonts.length; 
        console.log(`Font cambiato a: ${getCurrentFontName()}`);
    }

    previousButtonState = button;

    document.getElementById('pot1_value').innerText = pot1;
    document.getElementById('light1_value').innerText = light1;
    document.getElementById('button_state').innerText = button === 0 ? "Pressed" : "Not Pressed";
    document.getElementById('switch_state').innerText = switchVal === 1 ? "ON" : "OFF";
}
