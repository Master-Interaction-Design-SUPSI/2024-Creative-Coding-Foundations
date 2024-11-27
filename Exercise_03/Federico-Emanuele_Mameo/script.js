let bridge = [];
let currentPosition = 0;
let bridgeLength;
let arrayTraps = [];
let attempts = 0;
let saves = 0;

function startGame() {
    const bridgeContainer = document.getElementById("bridge");
    const message = document.getElementById("message");

    // Reset game state
    currentPosition = 0;
    message.textContent = "";
    bridgeContainer.innerHTML = "";
    attempts++;
    document.getElementById("attempts").textContent = attempts;

    // Generate bridge with random length and traps
    bridgeLength = Math.max((Math.floor(Math.random() * 11)), 5);
    arrayTraps = Array.from({ length: bridgeLength }, (_, i) => i === 0 ? false : Math.random() < 0.3); // No trap in first cell

    // Create the starting position cell
    const startCell = document.createElement("div");
    startCell.classList.add("cell", "start-cell");
    bridgeContainer.appendChild(startCell);

    // Create bridge cells
    for (let i = 0; i < bridgeLength; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        bridgeContainer.appendChild(cell);
    }

    // Add the goal cell at the end (where the player has to reach)
    const goalCell = document.createElement("div");
    goalCell.classList.add("cell", "goal-cell");
    goalCell.innerHTML = "<img src='assets/dog-scared_preview_rev_1.png' alt='Goal'>"; // Initial image for the goal
    bridgeContainer.appendChild(goalCell);

    // Create starting position for player
    const playerIcon = document.createElement("div");
    playerIcon.classList.add("player");
    bridgeContainer.appendChild(playerIcon);

    // Position the player at the start cell (position -1)
    playerIcon.style.left = `80px`; // Position player before the start
    updatePosition();
}

function updatePosition() {
    const playerIcon = document.querySelector(".player");
    const cells = document.querySelectorAll(".cell");

    // Position the player at the starting position
    if (currentPosition === -1) {
        playerIcon.style.left = `80px`;
        return;
    }

    // Update position
    playerIcon.style.left = `${(currentPosition + 1) * 80}px`; // Move player
    document.getElementById("moveSound").play();

    // Check if the player reached the goal
    if (currentPosition >= bridgeLength) {
        document.getElementById("message").textContent = "Yes! You saved Nalan!";
        document.getElementById("winSound").play();

        // Change the image in the goal cell
        const goalCell = cells[bridgeLength+1];
        goalCell.innerHTML = "<img src='assets/dog-happy_preview_rev_1.png' alt='Dog Saved'>"; // Change image to indicate success
        return;
    }

    // Check for trap
    if (arrayTraps[currentPosition]) {
        const cell = cells[currentPosition];
        cell.classList.add("trap-open");
        playerIcon.classList.add("player-trap");
        document.getElementById("message").textContent = "Game Over! You fell into a trap :(";
        document.getElementById("trapSound").play();

        // Change player image on trap (player dies)
        playerIcon.style.backgroundImage = "url('assets/dead-no-back-character.png')"; // Change to a 'dead' player image

        revealTraps();
        return;
    }
}

function revealTraps() {
    const cells = document.querySelectorAll(".cell");

    // Reveal all traps
    arrayTraps.forEach((isTrap, index) => {
        if (isTrap) {
            cells[index].classList.add("trap-reveal");
        }
    });
}

document.addEventListener("keydown", (keyEvent) => {
    const message = document.getElementById("message").textContent;
    if (message.includes("Game Over") || message.includes("Yes!")) return;

    switch (keyEvent.key) {
        case "ArrowUp":
            if (currentPosition + 2 <= bridgeLength) {
                currentPosition += 2;  // Move 2 steps forward (jump)
                updatePosition();
            }
            break;
        case "ArrowRight":
            if (currentPosition + 1 <= bridgeLength) {
                currentPosition += 1;  // Move 1 step forward
                updatePosition();
            }
            break;
    }
});

// Start the game on page load
startGame();