// Set the API URL for the JSON file containing henna data
const API_URL = 'assets/henna.json';

fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
        hennaData = data.hennaStyles;
        renderHennaStyle(currentStyle);
        renderMandala(); // Render the default mandala
    });

// Initialize variables to store data and current selections
let hennaData = null;
let currentStyle = "Indian Henna";
let currentElement = "Ambi";
let currentLayerStyle = 1;

// Get the canvas element and set up the 2D drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Function to render details of the selected henna style
function renderHennaStyle(styleName) {
    const style = hennaData.find((style) => style.title === styleName);

    const titleElement = document.getElementById("title");
    titleElement.innerText = style.title;

    const aboutElement = document.getElementById("about");
    aboutElement.innerText = `About: ${style.description.about}`;

    const historyElement = document.getElementById("history");
    historyElement.innerText = `History: ${style.description.history}`;

    const religionElement = document.getElementById("religion");
    religionElement.innerText = `Religion: ${style.description.religion}`;

    const countryElement = document.getElementById("country");
    countryElement.innerText = `Country: ${style.description.country}`;
}

// Function to render the mandala design
function renderMandala() {
    const style = hennaData.find((style) => style.title === currentStyle);
    const images = style.designElements;

    const handImage = new Image();
    handImage.src = "assets/images/HAND.png"; // Background hand image

    handImage.onload = () => {
        // Adjust canvas to hand image dimensions
        canvas.width = handImage.width;
        canvas.height = handImage.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.drawImage(handImage, 0, 0, canvas.width, canvas.height); // Draw hand

        // Draw the "Tikki" element (center circle)
        drawCenterElement(images.Tikki.images[0]);

        // Draw the "Humps" element rotating around "Tikki"
        drawRotatingElement(images.Humps.images[0], 33.87, 8, 40, true);

        // Draw the circular outline around "Tikki"
        drawOutlineCircle(33.87);

        // Draw the "Ambi" element rotating around the outline
        drawRotatingElement(images.Ambi.images[0], 63.64, 12, 30, false);

        // Draw the "Phool" element rotating around the "Ambi" circle
        drawRotatingElement(images.FloralVines.images[0], 100, 16, 50, false);
    };
}

// Function to draw the central "Tikki" element
function drawCenterElement(imageSrc) {
    const tikkiImage = new Image();
    tikkiImage.src = imageSrc;

    tikkiImage.onload = () => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = 23.84;

        ctx.drawImage(tikkiImage, centerX - size / 2, centerY - size / 2, size, size);
    };
}

// Function to draw a rotating element around a circle
function drawRotatingElement(imageSrc, radius, count, size, rotateAngle) {
    const elementImage = new Image();
    elementImage.src = imageSrc;

    elementImage.onload = () => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angleStep = (2 * Math.PI) / count;

        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            ctx.save();
            ctx.translate(x, y);
            if (rotateAngle) {
                ctx.rotate(angle + Math.PI / 2); // Rotate the element
            }
            ctx.drawImage(elementImage, -size / 2, -size / 2, size, size);
            ctx.restore();
        }
    };
}

// Function to draw a circular outline
function drawOutlineCircle(radius) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black"; // Outline color
    ctx.lineWidth = 1; // Outline width
    ctx.stroke();
}

// Event listener for button interactions
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("style-button")) {
        currentStyle = e.target.dataset.style;
        renderHennaStyle(currentStyle);
        renderMandala();
    } else if (e.target.classList.contains("design-button")) {
        currentElement = e.target.dataset.element;
        renderMandala();
    } else if (e.target.classList.contains("style-option")) {
        currentLayerStyle = parseInt(e.target.dataset.style, 10);
        renderMandala();
    }
});