const gameContainer = document.getElementById("game-container");

const levelOptions = ["normal", "ice", "tree", "snowman"];
let levelLength = 14; // Initial length, will be recalculated on resize

let playerPosition = 0;
let playerState = "normal";
let isAnimating = false;
let level = [];
const platformWidth = 60;

function initializeGame() {
    const playerElement = document.createElement("div");
    playerElement.id = "player";
    playerElement.className = `player ${playerState}`;
    gameContainer.appendChild(playerElement);

    level.forEach(renderPlatform);
    renderPlatform("normal", levelLength);
}

function renderPlatform(platform, index) {
    const platformContainer = document.createElement("div");
    platformContainer.className = "platform-container";
    platformContainer.style.left = `${index * platformWidth}px`;

    const platformElement = document.createElement("div");
    platformElement.className = `platform ${platform}`;

    if (platform === "tree") {
        const dirtBlock = document.createElement("div");
        dirtBlock.className = "dirt";
        platformContainer.appendChild(dirtBlock);
    } else if (platform === "snowman") {
        const snowBlock = document.createElement("div");
        snowBlock.className = "snow";
        platformContainer.appendChild(snowBlock);
    }

    platformContainer.appendChild(platformElement);
    platformContainer.dataset.index = index;
    gameContainer.appendChild(platformContainer);
}

function calculateLevelLength() {
    const availableWidth = window.innerWidth;
    levelLength = Math.floor(availableWidth / platformWidth);
}

function renderGame() {
    const playerElement = document.getElementById("player");
    playerElement.className = `player ${playerState}`;
    playerElement.style.left = `${playerPosition * platformWidth}px`;

    level.forEach((platform, index) => {
        const platformElement = gameContainer.querySelector(`.platform-container[data-index='${index}'] .platform`);
        platformElement.className = `platform ${platform}`;
    });

    if (playerState === "sliding") {
        setTimeout(() => {
            playerState = "normal";
            renderGame();
        }, 500);
    }

    if (playerState === "jumping") {
        setTimeout(() => {
            playerState = "normal";
            isAnimating = false;
            renderGame();
        }, 800);
    }
}

function resetLevel() {
    gameContainer.innerHTML = '';
    level = ["normal"];

    for (let i = 1; i < levelLength; i++) {
        let randomOption;
        const randomNumber = Math.random();
        if (randomNumber < 0.5) {
            randomOption = "normal";
        } else if (randomNumber < 0.65) {
            randomOption = "ice";
        } else {
            randomOption = Math.random() < 0.7 ? "tree" : "snowman";
        }

        if (i > 0 && level[i - 1] !== "normal" && randomOption !== "normal") {
            randomOption = "normal";
        }
        if (i == levelLength - 1) {
            randomOption = "normal";
        }

        level.push(randomOption);
    }

    playerPosition = 0;
    playerState = "normal";
    isAnimating = false;

    initializeGame();
    renderGame();
}

// Calculate initial level length and reset level
calculateLevelLength();
resetLevel();

function checkWinOrLose() {
    const traps = ["tree", "snowman"];

    if (playerPosition >= levelLength - 1) {
        return "win";
    }
    if (traps.includes(level[playerPosition])) {
        return "lose";
    }
    return "continue";
}

function movePlayer(typeOfMovement) {
    if (isAnimating) return;

    if (typeOfMovement === "forward") {
        playerPosition++;
        playerState = "moving";
    } else if (typeOfMovement === "jump") {
        playerPosition += 2;
        playerState = "jumping";
        isAnimating = true;
    }

    const currentPlatform = level[playerPosition];

    if (currentPlatform === "ice") {
        playerState = "sliding";
        playerPosition++;
    } else if (currentPlatform === "tree" || currentPlatform === "snowman") {
        playerState = "hit";
    } else if (typeOfMovement === "jump") {
        playerState = "jumping";
    } else {
        playerState = "normal";
    }

    renderGame();
}

const delay = 700;

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        if (timeout) return;
        func.apply(this, args);
        timeout = setTimeout(() => {
            timeout = null;
        }, delay);
    };
}

const debouncedMovePlayer = debounce(movePlayer, delay);

document.addEventListener('keydown', (event) => {
    const keyPressed = event.key;
    if (keyPressed === "ArrowUp" || keyPressed === " ") {
        debouncedMovePlayer("jump");
    } else if (keyPressed === "ArrowRight") {
        debouncedMovePlayer("forward");
    }

    const result = checkWinOrLose();
    if (result === "win") {
        setTimeout(() => {
            showModal("You won!");
        }, 500);
    } else if (result === "lose") {
        setTimeout(() => {
            showModal("You lost!");
        }, 500);
    }
});

// Add resize event listener to dynamically adjust the number of platforms
window.addEventListener('resize', () => {
    calculateLevelLength(); // Recalculate the level length
    resetLevel(); // Re-render the level with the new length
});

const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalDescription = document.getElementById('modal-description');
const tryAgainButton = document.getElementById('try-again');
const newGameButton = document.getElementById('new-game');
const modalPicture = document.getElementById('modal-picture');

const congratsMessage = "Congrants! You helped Santa bring all the gifts! Christmas is saved!";
const lossMessage = "Oh Noooo! Don't let the kids wake-up with no Christmas gifts. You have to Save Christmas!";

function showModal(message) {
    modalMessage.textContent = message;

    
    if (message == "You won!"){
        modalPicture.setAttribute("src", "./images/Win Game.png")
        modalDescription.textContent = congratsMessage;
    }
    else {
        modalPicture.setAttribute("src", "./images/Lose Game.jpg")
        modalDescription.textContent = lossMessage;
    }
    
    modal.style.display = 'flex'; // Show modal
}

function hideModal() {
    modal.style.display = 'none'; // Hide modal
}

newGameButton.addEventListener('click', () => {
    hideModal();
    resetLevel(); // Reset the game completely
});