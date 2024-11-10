const canvasContainer = document.getElementById("canvasContainer");
const fileInput = document.getElementById("fileInput");
const generateBtn = document.getElementById("generateBtn");
const colorTone = document.getElementById("colorTone");
const colorPickerLabel = document.querySelector(".color-picker-label");
const movingText = document.querySelector('.moving-text p');

// initialize color settings
colorTone.value = "#00FF00";
updateColors();
updateTextColor();

let filesData = []; // store dataa

// file input
fileInput.addEventListener("change", handleFile);

// generate grid
generateBtn.addEventListener("click", function() {
    const colorTone = document.getElementById("colorTone").value;

    // max 10 squares
    if (canvasContainer.children.length >= 10) return;

    // each upload has a square
    for (let { bytes, name } of filesData) {
        createGrid(bytes, colorTone, name);
    }
});

// change color
colorTone.addEventListener("input", function() {
    updateColors(); 
    updateTextColor(); 
});

// change button color
function updateColors() {
    const selectedColor = colorTone.value;
    colorPickerLabel.style.backgroundColor = selectedColor; 
}

// change moving text color
function updateTextColor() {
    const selectedColor = colorTone.value;
    movingText.style.color = selectedColor; 
}

// read bytes
function handleFile(event) {
    const files = event.target.files;
    filesData = [];

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            const bytes = new Uint8Array(arrayBuffer);
            filesData.push({ name: file.name, bytes });
        };
        reader.readAsArrayBuffer(file);
    }
}

// create grid for each file
function createGrid(bytes, colorTone, fileName) {
    // check if maximum number of squares is exceeded
    if (canvasContainer.children.length >= 10) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("canvas-wrapper");

    const canvas = document.createElement("canvas");
    const gridSize = Math.ceil(Math.sqrt(bytes.length));
    const cellSize = 15;
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;

    const fileNameElem = document.createElement("div");
    fileNameElem.innerText = fileName;
    fileNameElem.classList.add("file-name");

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "✖";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = function() {
        wrapper.remove();
        filesData = filesData.filter(f => f.name !== fileName);
    };

    wrapper.appendChild(canvas);
    wrapper.appendChild(fileNameElem);
    wrapper.appendChild(removeBtn);
    canvasContainer.appendChild(wrapper);

    const ctx = canvas.getContext("2d");

    let index = 0;
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (index >= bytes.length) return;
            const byte = bytes[index];
            const color = colorTone;

            ctx.fillStyle = `rgba(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}, ${byte / 255})`;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            index++;
        }
    }
}

// convert hex to rgb
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// clear the canvas
function clearCanvas() {
    canvasContainer.innerHTML = "";
    filesData = [];
}

// scrolling text movement
let startPosition = window.innerWidth;

function scrollText() {
    startPosition -= 1; // scrolling speed
    if (startPosition < -movingText.offsetWidth) {
        startPosition = window.innerWidth; 
    }
    movingText.style.transform = `translateX(${startPosition}px)`; 
    requestAnimationFrame(scrollText); 
}

// start scrolling text
scrollText();
