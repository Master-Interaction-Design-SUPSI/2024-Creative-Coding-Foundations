let arrayTraps = [true, true, false, true, false, true, true, false, true, false];
let currentPosition = -1;
const kirbyElement = document.createElement("div");
kirbyElement.className = "kirby";
document.getElementById("bridge").appendChild(kirbyElement);

const restartButton = document.createElement("button");
restartButton.textContent = "Restart Game";
restartButton.style.display = "none";
restartButton.onclick = gameReset;
document.body.appendChild(restartButton);

function gameReset() {
    console.log("Game reset!");
    currentPosition = -1;
    kirbyElement.style.left = "-60px";
    document.getElementById("gameMessage").style.opacity = 0;
    restartButton.style.display = "none";
    generateBridge();
}

const bridge = document.getElementById("bridge");
function generateBridge() {
    bridge.innerHTML = ""; 
    bridge.appendChild(kirbyElement); 
    arrayTraps.forEach((isTrap, index) => {
        const tile = document.createElement("div");
        tile.className = isTrap ? "safe-tile tile" : "trap-tile tile";
        bridge.appendChild(tile);
    });
}

function checkStatus() {
    console.log("Current Position:", currentPosition);

    const gameMessage = document.getElementById("gameMessage");

    if (currentPosition >= arrayTraps.length) {
        gameMessage.textContent = "You Win!";
        gameMessage.classList.remove("game-over");
        gameMessage.classList.add("win");
        gameMessage.style.opacity = 1;
        document.getElementById("winSound").play();
        restartButton.style.display = "block";
        console.log("You Win!");
    } else if (arrayTraps[currentPosition]) {
        console.log("Safe tile, keep going!");
        document.getElementById("stepSound").play();
    } else {
        gameMessage.textContent = "Game Over!";
        gameMessage.classList.remove("win");
        gameMessage.classList.add("game-over");
        gameMessage.style.opacity = 1;
        document.getElementById("gameOverSound").play();
        restartButton.style.display = "block"; 
        console.log("Game Over!");
    }
}

document.addEventListener("keydown", (event) => {
    if (currentPosition >= arrayTraps.length) {
        return; 
    }
    switch (event.key) {
        case "ArrowUp":
            console.log("Jump!");
            currentPosition += 2;
            kirbyElement.classList.add("jump");
            setTimeout(() => kirbyElement.classList.remove("jump"), 500);
            kirbyElement.style.left = `${currentPosition * 80}px`;
            document.getElementById("jumpSound").play();
            break;
        case "ArrowRight":
            console.log("Step forward!");
            currentPosition++;
            kirbyElement.classList.add("step");
            setTimeout(() => kirbyElement.classList.remove("step"), 300);
            kirbyElement.style.left = `${currentPosition * 80}px`;
            break;
        default:
            return;
    }
    checkStatus();
});

generateBridge();



