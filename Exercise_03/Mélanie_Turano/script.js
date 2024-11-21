const board = document.getElementById("board");
let playerPosition = 0;
const boardSize = 64; // 8x8
let traps = []; 
const numTraps = 10; 
const goal = 63; 


const playerImageURL = "assets/candy.png"; 

// Trap function
function generateRandomTraps() {
  traps = [];
  while (traps.length < numTraps) {
    const randomPosition = Math.floor(Math.random() * (boardSize - 1)); 
    if (randomPosition !== 0 && !traps.includes(randomPosition)) {
      traps.push(randomPosition); 
    }
  }
}

// Chessboard function
function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (i === goal) cell.classList.add("goal");
    board.appendChild(cell);
  }
  updatePlayerPosition(); 
}

// Function to let the candy move
function updatePlayerPosition() {
  document.querySelectorAll(".cell").forEach(cell => {
    if (cell.querySelector("img")) {
      cell.removeChild(cell.querySelector("img"));
    }
  });
  
  
  const playerCell = document.querySelectorAll(".cell")[playerPosition];
  const playerImage = document.createElement("img");
  playerImage.src = playerImageURL;
  playerImage.alt = "Personaggio";
  playerImage.style.width = "100%";
  playerImage.style.height = "100%";
  playerCell.appendChild(playerImage);
}


function movePlayer(steps) {
  playerPosition += steps;
  

  if (playerPosition >= boardSize) playerPosition = boardSize - 1;
  
 
  updatePlayerPosition();
  checkPosition();
}


function checkPosition() {
  if (traps.includes(playerPosition)) {
    alert("Hai perso! Sei caduto su una trappola!");
    resetGame();
  } else if (playerPosition === goal) {
    alert("Hai vinto!");
  }
}

// Reset game
function resetGame() {
  playerPosition = 0;
  generateRandomTraps(); 
  createBoard();
}

// Event listener for candy
document.getElementById("reset").addEventListener("click", resetGame);
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") movePlayer(1); // Move 1
  if (e.key === "ArrowUp") movePlayer(2);     // Jump
});


generateRandomTraps();
createBoard();
