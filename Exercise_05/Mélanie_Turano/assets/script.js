const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const SLIDER_W = document.getElementById("slide_w");
const SLIDER_H = document.getElementById("slide_h");
const ctx = CANVAS.getContext("2d");
CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;


const width = CANVAS.width;
const height = CANVAS.height;
// const SIZE = 200;
// const S_X = width / 2 - SIZE / 2;
// const S_Y = height / 2 - SIZE / 2;


// ctx.fillStyle = "blue";
// ctx.rect(S_X, S_Y, SIZE, SIZE);
// ctx.fill();


// ctx.beginPath();
// ctx.fillStyle = "green";
// ctx.rect(50, 40, 200, 100); // x, y, width, height
// ctx.fill();
// // ctx.closePath();


// ctx.beginPath();
// ctx.strokeStyle = "black";
// ctx.lineWidth = "4";
// // ctx.arc(70,70,50, 0, Math.PI * 2); // x, y, radius, starting angle (radians), ending angle (radians)
// ctx.arc(70, 70, 50, 0, Math.PI); // smile
// // ctx.arc(70,70,50, Math.PI, 0); // down smile
// ctx.stroke();
// ctx.closePath();


// ctx.beginPath();
// ctx.strokeStyle = "orange";
// ctx.lineWidth = "30";
// ctx.moveTo(0, 0);
// ctx.lineTo(width / 2, height / 2);
// ctx.lineTo(width, 0);
// ctx.stroke();
// //console.log(Math.PI);


// ctx.fillStyle = "black";
// ctx.font = "40px Arial";
// ctx.textAlign = "center";
// ctx.fillText("Hello", width / 2, height / 2);
// let rectX = width / 2;
// let rectStyle = "red";
// let isRed = true;
// let yPos = height / 2;
// let dir = 1;
// let hue = 50;

// // let backgroundColor = "yellow";
// function draw() {
//     // ctx.clearRect (0, 0, width, height);
//     // hue = Math.random() * 360;
//     ctx.fillStyle = `hsl(${hue}, 100%, 48%)`;
//     ctx.rect(0, 0, width, height);
//     ctx.fill();
//     yPos += (10 * dir);
//     if (yPos > height - 50) {
//         dir = -1;
//         hue = Math.random() * 360;
//     }
//     if (yPos < 0 + 50) {
//         dir = 1;
//         hue = Math.random() * 360;
//     }
//     // ctx.fillStyle = backgroundColor; //
//     ctx.rect(0, 0, width, height);
//     ctx.fill();
//     ctx.beginPath();
//     ctx.fillStyle = "blue";
//     ctx.lineWidth = "10";
//     ctx.arc(width / 2, yPos, 50, 0, Math.PI * 2);
//     ctx.fill();
//     requestAnimationFrame(draw);
// }
// draw();
let value_w = 500;
let value_h = 500;

const img = new Image();
img.src = "assets/img/boris.webp";
img.onload = function() {
    draw();
}

function draw() {
    ctx.clearRect(0,0,width,height);
    let img_w = img.width;
    let img_h = img.height

    ctx.save()
    ctx.translate(-img_w/2, -img_h/2);
    ctx.drawImage(img, mouseX,mouseY, img.width, img.height);
    ctx.restore();
    
    let position = `X: ${mouseX}; Y:${mouseY}`;
    // ctx.fillStyle = "white";
    // ctx.font = "20px Arial";
    // ctx.fillText(position, 50, 50);
    requestAnimationFrame(draw);
}


// SLIDER_W.addEventListener("input", function() {
//     value_w = SLIDER_W.value;
//     console.log(value_w);
// });
// SLIDER_H.addEventListener("input", function() {
//     value_h = SLIDER_H.value;
//     console.log(value_h);
// });

let mouseX = 0;
let mouseY = 0;

CANVAS.addEventListener("mousemove", (event) =>{
    const RECT = CANVAS.getBoundingClientRect();
    mouseX = event.clientX - RECT.left;
    mouseY = event.clientY - RECT.top;
    console.log(mouseX + " " + mouseY);
});






