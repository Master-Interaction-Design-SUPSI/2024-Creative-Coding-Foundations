const canvas = document.getElementById('nasaCanvas');
const ctx = canvas.getContext('2d');
const cursorCircle = document.getElementById('cursorCircle');
const cursorCross = document.getElementById('cursorCross');
let images = [];
let imageRotation = 0;
let imageScale = 1;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawImages();
}

resizeCanvas();

async function loadImages() {
    try {
        const response = await fetch('assets/nasa_data.json');
        const data = await response.json();
        const items = data.collection.items;

        items.forEach(item => {
            const img = new Image();
            img.src = item.links[0].href;
            img.onload = () => {
                images.push(img);
                drawImages();
            };
        });
    } catch (error) {
        console.error('Errore nel caricamento delle immagini:', error);
    }
}

function drawImages() {
    if (images.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    images.forEach(img => {
        const randomSize = Math.random() * 0.3 + 0.3;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        ctx.save();
        ctx.translate(x + (img.width * randomSize) / 2, y + (img.height * randomSize) / 2);
        ctx.rotate(imageRotation); 
        ctx.translate(-(x + (img.width * randomSize) / 2), -(y + (img.height * randomSize) / 2));
        ctx.drawImage(img, x, y, img.width * randomSize * imageScale, img.height * randomSize * imageScale);
        ctx.restore();
    });
}

canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    cursorCircle.style.left = `${mouseX - cursorCircle.offsetWidth / 2}px`;
    cursorCircle.style.top = `${mouseY - cursorCircle.offsetHeight / 2}px`;

    const circleSize = Math.min(window.innerWidth, window.innerHeight) / 3;
    cursorCircle.style.width = `${circleSize}px`;
    cursorCircle.style.height = `${circleSize}px`;

    drawImages();
});

document.getElementById('rotateBtn').addEventListener('click', () => {
    imageRotation += Math.PI / 4;
    drawImages();
});

document.getElementById('resizeBtn').addEventListener('click', () => {
    imageScale = imageScale === 1 ? 1.5 : 1;
    drawImages();
});

window.onload = loadImages;
window.onresize = resizeCanvas;