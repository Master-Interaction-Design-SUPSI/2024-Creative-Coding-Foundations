const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const ctx = CANVAS.getContext("2d");

const SLIDER_SIZE = document.getElementById("slider_size");

CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;

const width = CANVAS.width;
const height = CANVAS.height;

let value_size = 1;
let mouseX = 0;
let mouseY = 0;

const img = new Image();
img.src = "assets/cat.png";

img.onload = function (){
    draw();
}

function draw(){
    // ctx.clearRect(0,0,width,height); // erase the previous frame

    let img_width = img.width * value_size * 0.1;
    let img_height = img.height * value_size * 0.1;

    ctx.save();
    ctx.translate(-img_width/2,-img_height/2);
    ctx.drawImage(img,mouseX, mouseY,img_width,img_height)
    ctx.restore();

    let positions = `X: ${mouseX}; Y: ${mouseY}`;
    console.log(positions);

    requestAnimationFrame(draw);
}

SLIDER_SIZE.addEventListener("input", function() {
    value_size = SLIDER_SIZE.value;
})

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left; // mouseX within the whole window - x position of the canvas
    mouseY = event.clientY - rect.top; // mouseY within the whole window - y position of the canvas
    // console.log(mouseX,mouseY)
});