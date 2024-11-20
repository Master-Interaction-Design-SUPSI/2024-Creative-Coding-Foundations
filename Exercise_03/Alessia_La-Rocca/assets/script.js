// random sequence of traps
function generateRandomTraps(totalPositions) {
    const traps = [];
    for (let i = 0; i < totalPositions; i++) {
        traps.push(Math.random() < 0.5); // 50% chance of a trap
    }
    return traps;
}

// game variables
const totalPositions = 6;
let arrayTraps = generateRandomTraps(totalPositions); 
let currentPosition = -1; 


const gameResultElement = document.getElementById("game-result");
const gameBoard = document.querySelector(".game-board");
const positions = Array.from(document.querySelectorAll(".position"));


const playerImg = document.createElement("img");
playerImg.src = "assets/img/player_neutral.png";
playerImg.classList.add("player");

// reset the game
function gameReset() {
   
    arrayTraps = generateRandomTraps(totalPositions); 
    currentPosition = -1; 
    gameResultElement.textContent = "Game reset! Press 'S' to start moving.";
    playerImg.src = "assets/img/player_neutral.png";

   
    positions.forEach((pos) => pos.innerHTML = "");
}

// update the player position
function updatePlayerPosition(prevPosition, newPosition) {
    
    if (prevPosition >= 0 && prevPosition < totalPositions) {
        positions[prevPosition].innerHTML = "";
    }

    
    if (newPosition >= 0 && newPosition < totalPositions) {
        positions[newPosition].appendChild(playerImg);

        
        if (arrayTraps[newPosition]) {
            playerImg.src = "assets/img/player_trap.png";
        } else {
            playerImg.src = "assets/img/player_neutral.png";
        }
    }
}

// check the game status
function checkStatus() {

    // Check if the player has won (reached the end of the path)
    if (currentPosition >= totalPositions) {
        gameResultElement.textContent = "WINNER! You are safe!";
        document.body.style.backgroundColor = "#0C7D47"; // green background for win
        setTimeout(gameReset, 2000); // Reset the game after 2 seconds
        return;
    }

    // Check if the player is on a trap
    if (currentPosition >= 0 && arrayTraps[currentPosition]) {
        gameResultElement.textContent = "Trap! Game over";
        document.body.style.backgroundColor = "#FD8E53"; // red background for lose
        setTimeout(gameReset, 2000); // Reset the game after 2 seconds
    } else {
        gameResultElement.textContent = `Position: ${currentPosition + 1} - Safe`;
        document.body.style.backgroundColor = "#FDF253"; // Yellow background
    }
}

// Event listener for keyboard actions
document.addEventListener("keydown", (keyEvent) => {
    const prevPosition = currentPosition;

    switch (keyEvent.key) {
        case "j": // Jump 2 positions
            currentPosition += 2;
            break;
        case "s": // Move 1 position forward
            currentPosition += 1;
            break;
    }

    updatePlayerPosition(prevPosition, currentPosition);
    checkStatus();
});
