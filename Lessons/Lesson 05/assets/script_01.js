const CANVAS = document.getElementById("canvas");
const CONTAINER= document.getElementById("container");
const ctx = CANVAS.getContext("2d"); // Adding a context

const SLIDER_X = document.getElementById("slide-x")
const SLIDER_Y = document.getElementById("slide-y");

CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;

let value_x = 0;
let value_y = 0;

const width = CANVAS.width;
const height = CANVAS.height;

const img = new Image();
img.src = "assets/cat-1.jpg";

img.onload = function () {
    draw();
}


function draw() {
    /* ctx.clearRect(0,0,width,height); */

    let img_width = img.width / 8;
    let img_height = img.height / 8;

    ctx.save();
    ctx.translate(-img_width/2, -img_height/2)
    ctx.drawImage(img, mouseX, MouseY, img_width, img_height);
    ctx.restore();

    let position = `X: ${mouseX}; Y: ${mouseY}`;

/*  ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(); */

    requestAnimationFrame(draw);
}

/* SLIDER_X.addEventListener("input", function() {
    value_x = SLIDER_X.value;
})

SLIDER_Y.addEventListener("input", function() {
    value_y = SLIDER_Y.value;
}) */



let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left; // mouseX within the whole window - x position of the canvas
    mouseY = event.clientY - rect.top; // mouseY within the whole window - y position of the canvas
    console.log(mouseX, mouseY)
});