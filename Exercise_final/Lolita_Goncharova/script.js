

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreCounter = document.getElementById("scoreCounter");




let bird = { x: 50, y: 300, radius: 15, velocity: 0 };
let gravity = 0.5;
let isGameRunning = false;
let pipes = [];
let pipeWidth = 50;
let gap = 200;
let frameCount = 0;
let score = 0;

// sound 
let audioContext;
let analyser;
let microphone;
let dataArray;
// let sensitivity = 100;



// sound input
async function initSound() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 128; //allways to the power of 2
    microphone.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);

                // audioContext
                // microphone access
                // media stream source from the microphone input
                // Sets up an AnalyserNode to extract real-time audio data
                // Connects the microphone to AnalyserNode
                // store the analyzed frequency data



 
}





function gameLoop() {
    if (!isGameRunning) return;

    
    updatePhysics();
    updatePipes();
    checkCollisions();

    
    draw();

    requestAnimationFrame(gameLoop);  //!!
}




// Physics 
function updatePhysics() {
    analyser.getByteFrequencyData(dataArray);
    const soundLevel = Math.max(...dataArray); // Get the loudest sound level

    if (soundLevel > sensitivity) bird.velocity = -2; //
    
    bird.velocity += gravity;
    bird.y += bird.velocity;
}



function updatePipes() {
    if (frameCount % 90 === 0) {
        const pipeHeight = Math.random() * (canvas.height - gap - 100) + 50;
        pipes.push({ x: canvas.width, top: pipeHeight, bottom: pipeHeight + gap });
    }

    pipes.forEach(pipe => pipe.x -= 2);



    if (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
        scoreCounter.textContent = `Score: ${score}`; // Update score 
    }

    frameCount++;
}






// Drawing 
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // bird
    ctx.fillStyle = "rgb(0, 60, 67)";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // pipes
    pipes.forEach(pipe => {
        ctx.fillStyle = "rgb(60, 138, 146)";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });

    // // score but inside the canvas 
    // ctx.fillStyle = "black";
    // ctx.font = "20px Arial";
    // ctx.fillText(`Score: ${score}`, 10, 20);
}





// Collision check

function checkCollisions() {
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        endGame();
    }

    for (let pipe of pipes) {
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
        ) {
            endGame();
        }
    }
}




function startGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    scoreCounter.textContent = `Score: ${score}`; 
    isGameRunning = true;
    gameLoop();
}




function endGame() {
    isGameRunning = false;
    alert(`Game Over 😢 Your score: ${score}, Try Again!!! `);
}






//button

document.getElementById("startButton").addEventListener("click", () => {
    if (!audioContext) initSound();
    startGame();
});





function resizeCanvas() {
    // 50%
    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.5;
}
// Call!
window.addEventListener("resize", resizeCanvas);


resizeCanvas();









let sensitivity = 100;

// maximum frequency amplitude
analyser.getByteFrequencyData(dataArray);

// frequency range 300 Hz to 3000 Hz
const startBin = Math.floor(300 / 172.27);
const endBin = Math.ceil(3000 / 172.27);
let filteredAmplitude = 0;
for (let i = startBin; i <= endBin; i++) {
    filteredAmplitude += dataArray[i];
}




if (filteredAmplitude > 300) { // detection of high amplitude detected
    sensitivity = 50; 
} else {
    sensitivity = 100; 
}


if (Math.max(...dataArray) > sensitivity) {
    bird.velocity = -6; 
}
