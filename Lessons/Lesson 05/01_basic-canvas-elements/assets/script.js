const CANVAS = document.getElementById("canvas");
const ctx = CANVAS.getContext("2d");

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const width = CANVAS.width;
const height = CANVAS.height;
console.log(width,height);

const SIZE = 250;
const S_X = width/2 - SIZE/2;
const S_Y = height/2 - SIZE/2;

// rectangle
ctx.fillStyle = "blue";
ctx.rect(S_X,S_Y,SIZE,SIZE);
ctx.fill();

// circle
ctx.beginPath();
ctx.strokeStyle = "black";
ctx.lineWidth = "10";
ctx.arc(width/2,100,50, 0, Math.PI * 2); // x, y, radius, starting angle (radians), ending angle (radians)
ctx.stroke();
ctx.closePath();

// line
ctx.beginPath();
ctx.strokeStyle = "orange";
ctx.lineWidth = "3";
ctx.moveTo(0,0);
ctx.lineTo(width/2,height/2);
ctx.lineTo(width,0);
ctx.stroke();
ctx.closePath();

// text
ctx.fillStyle = "white";
ctx.font = "40px Arial";
ctx.textAlign = "center";
ctx.fillText("hello! / ciao!", width/2, height/2);
