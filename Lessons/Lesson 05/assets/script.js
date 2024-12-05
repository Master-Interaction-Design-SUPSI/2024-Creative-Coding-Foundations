const CANVAS = document.getElementById("canvas");
const ctx = CANVAS.getContext("2d"); //adding a context

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const width = CANVAS.width;
const height = CANVAS.height;
console.log(width, height);



const SIZE = 200;
const S_X = width/2 - SIZE/2;   //Square x position -- > to center it we use canvas widt/2 - Size of the sqaure/2 (where the center is)
const S_Y = height/2 - SIZE/2;  //Square Y position


// Creating a blue square
ctx.fillStyle = "blue";
ctx.rect(S_X,S_Y,SIZE,SIZE);   //specify x,y,w,h --> space from the top, left; width, height
ctx.fill();    //apply the style to the visual element
ctx.closePath();

ctx.beginPath();
ctx.strokeStyle = "orange"
ctx.lineWidth = "10";
ctx.arc(70,70,50, 0, Math.PI * 2);   // x,y,r,0,radians  --> x, y, radius, starting angle (radians), ending angle (radians)
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.strokeStyle = "green";
ctx.lineWidth = "5px"
ctx.moveTo(0,0)  //select the starting point of the line
ctx.lineTo(width/2, height/2);
ctx.lineTo(width, 0);
ctx.stroke();

ctx.fillStyle = "black";
ctx.font = "40px Arial";
ctx.textAlign = "center";
ctx.fillText("hello!!", width/2, height/2);


// starting animation

let rectX = width/2;
let rectStyle = "red";
let isRed = true;

function draw1(){
    ctx.clearRect(0,0,width,height);

    rectX += 10;

    if (rectX > width){
        rectX = -200;

        if (isRed == true){
            rectStyle = "green";
            isRed = false;
        }

        else {
            rectStyle = "red";
            isRed = true;
        }
    }

    ctx.beginPath();    
    ctx.fillStyle = rectStyle;
    ctx.rect(rectX,40,300,200);  
    ctx.fill();
    ctx.closePath();  

    requestAnimationFrame(draw);
    
}

/* draw1(); */


// circle

let yPos = height/2;
let dir = 1;
let hue = 50;


function draw(){

    ctx.fillStyle = `hsl(${hue}, 100%, 48%)`;
    ctx.rect(0,0,width,height);
    ctx.fill();
    
    if(yPos > height - 50){
        dir = -1;
        hue = Math.random() * 360;
    }


    if (yPos < 0 + 50){
        dir = 1;
        hue = Math.random() * 360;
    }

    yPos += (1 * dir);
    console.log(yPos);



    ctx.beginPath();    
    ctx.fillStyle = "blue";
    ctx.lineWidth = "10";  
    ctx.arc(width/2,yPos,50, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
    
}

draw();
