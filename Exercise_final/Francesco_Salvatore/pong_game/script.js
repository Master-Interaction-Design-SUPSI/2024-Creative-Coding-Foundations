// HTML Elements
const gameContainer = document.getElementById("game-container");
const ball = document.getElementById("ball");
const paddleLeft = document.getElementById("paddle-left");
const paddleRight = document.getElementById("paddle-right");
const scoreDisplay = document.getElementById("score");

// Ball and Paddle Variables
let ballX = 286, ballY = 246; // Ball initial position
let ballSpeedX = 0, ballSpeedY = 0; // Ball starts stationary
let leftScore = 0, rightScore = 0;

// Arduino Inputs
let pot1, pot2, button; // Inputs for paddles and button
const pots = document.getElementById("pots");

// Game State
let isGameStarted = false; // Flag to track game start

// Function to update values from Arduino
function updateWebPage(data) {
  pot1 = data[0];
  pot2 = data[1];
  button = parseInt(data[2]); // Only if button is parseInt it work --> does it print the space??

  console.log("pot1: " + pot1 + ", pot2: " + pot2 + ", button: " + button);
  pots.innerText = `Paddle 1: ${parseInt(pot1 / 2)}, Paddle 2: ${parseInt(pot2 / 2)}, Button: ${button}`;  // parseInt let it print as an integer number

  if (!isGameStarted) {
    startGame(); // Check and start the game
  }
}

function startGame() {
  console.log("Tentativo di avvio gioco - Button:", button, "isGameStarted:", isGameStarted);
  
  if (button === 1 && !isGameStarted) {
    ballSpeedX = Math.random() > 0.3 ? 4 : -4; // Generate a number between 0-1; check if > 0.5 --> 3; else -3
    ballSpeedY = Math.random() > 0.5 ? 1 : 1;  // Create a tight angle

    isGameStarted = true;
    // console.log("Gioco avviato! Velocità X:", ballSpeedX, "Velocità Y:", ballSpeedY);
  }
}

// Update game state
function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collisions with top and bottom walls
  if (ballY <= 0 || ballY >= 572) ballSpeedY *= -1;  // consider ball size --> -20 container height

  // Ball collisions with paddles
  if (
    ballX <= 10 && ballY + 20 > leftPaddleY && ballY < leftPaddleY + 80
  ) {
    ballSpeedX *= -1;
  }

  if (
    ballX >= 562 && ballY + 20 > rightPaddleY && ballY < rightPaddleY + 80  // 562 consider paddle(10) origin point ball (20)
  ) {
    ballSpeedX *= -1;
  }

  // Scoring
  if (ballX <= 0) {
    rightScore++;
    resetBall();
  }

  if (ballX >= 592) {    // container width
    leftScore++;
    resetBall();
  }

  // Ensure paddles are within bounds  --> between 0 - container height-paddle(512)
  leftPaddleY = Math.min(512, Math.max(0, pot1 / 2));  
  rightPaddleY = Math.min(512, Math.max(0, pot2 / 2));

  // Update paddle positions
  paddleLeft.style.top = `${leftPaddleY}px`;
  paddleRight.style.top = `${rightPaddleY}px`;

  // Update ball position
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  // Update score display
  scoreDisplay.textContent = `${leftScore} : ${rightScore}`;
}

// Reset ball to center
function resetBall() {
  ballX = 286;
  ballY = 246;
  ballSpeedX = 0; // Stop ball motion
  ballSpeedY = 0; // Stop ball motion
  isGameStarted = false; // Allow game to restart
}

// Main game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// Start the loop (it won't move the ball until the game starts)
gameLoop();
