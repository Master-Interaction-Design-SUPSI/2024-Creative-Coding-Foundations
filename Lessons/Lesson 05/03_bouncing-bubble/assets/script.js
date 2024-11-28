const CANVAS = document.getElementById("canvas");
const ctx = CANVAS.getContext("2d");

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const width = CANVAS.width;
const height = CANVAS.height;
console.log(width,height);

let yPos = height/2;
let dir = 1;
let hue = 50;

function draw(){
    // ctx.clearRect(0,0,width,height);

    ctx.fillStyle = `hsl(${hue}, 100%, 48%)`;
    ctx.rect(0,0,width,height);
    ctx.fill();

    if (yPos > height -50){
       dir = -1;
       hue = Math.random() * 360;
    }

    if (yPos < 0 + 50) {
        dir = 1
        hue = Math.random() * 360;
    }

    yPos += (1 * dir);
    // console.log(yPos);

    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.lineWidth = "10";
    ctx.arc(width/2,yPos,50, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);

}

draw();

