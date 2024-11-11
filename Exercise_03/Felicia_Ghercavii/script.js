let arrayTraps = [false, false, true, false, true, false];
let currentPosition = 0; // starting position
const messageDisplay = document.getElementById("message");
const correctCounter = document.getElementById("progress-bar"); // progress counter
const tilesContainer = document.getElementById("tiles");
const helpContainer = document.getElementById("help-container")
const gameHero = document.getElementById("game-hero");
const helpMark = document.getElementById("help-mark");
const gameMessage = document.getElementById("game-message");
const tileWidth = 86; // tile width + border
let isDialogOpen = false;
let gameOver = false;
// Initialize the game
gameReset();
updateProgress();

// Reset the game with a new path
function gameReset() {
    gameMessage.innerHTML="<h2>Get your hero to the last tile,<br/> be careful not to step on any traps!</h2>"
    gameOver=false;
    currentPosition = 0;
    arrayTraps = generateSafePath(8); // ensures no two consecutive traps and a safe start/end
    renderTiles();
    gameHero.classList.remove('fall', 'jump'); // Reset fall and jump animations
    updateHeroPosition();
    updateProgress();
    messageDisplay.textContent = ''; // Clear the message display
}

// Generate a random path with no consecutive traps and safe start/end
function generateSafePath(length) {
    const path = [false]; // start with a safe tile
    for (let i = 1; i < length - 1; i++) {
        let element = Math.random() >= 0.5;
        if (path[i - 1] === true && element === true) {
            element = false;
        }
        path.push(element);
    }
    path.push(false); // ensure the last tile is safe
    return path;
}

// Render the tiles based on arrayTraps, initially hidden
function renderTiles() {
    tilesContainer.innerHTML = ''; // Clear existing tiles
    arrayTraps.forEach(() => {
        const tile = document.createElement('div');
        tile.classList.add('tile', 'hidden'); // Initially hidden tile
        tilesContainer.appendChild(tile);
    });
}

// Update the hero's position visually
function updateHeroPosition() {
    gameHero.style.left = `${currentPosition * tileWidth}px`;
}

// Update progress counter
function updateProgress() {
    correctCounter.innerText = `${Math.min(currentPosition + 1, arrayTraps.length)}/${arrayTraps.length}`;
}

// Reveal all tiles from previous position up to the current position
function revealTiles(previousPosition) {
    for (let i = previousPosition; i <= currentPosition; i++) {
        const tile = tilesContainer.children[i];
        if (tile) {
            tile.classList.remove('hidden');
            tile.classList.add(arrayTraps[i] ? 'trap' : 'safe');
        }
    }
}

function showReplayButton() {
    gameMessage.innerHTML=`<button id="replay-button" onclick="gameReset()">Replay</button>`;

}

// Trigger confetti at win
function triggerConfetti() {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti();
}

// Check the player's position
function checkStatus(previousPosition) {
    revealTiles(previousPosition); // Reveal tiles between previous and current position

    if(currentPosition!=0){
        gameMessage.innerHTML=""
    }
    if (currentPosition >= arrayTraps.length - 1) { // reached the end
        updateProgress();
        console.log("You’re a winner, baby!");
        triggerConfetti();
        gameOver=true;
        showReplayButton()
        messageDisplay.textContent = "You’re a winner, baby!"; // Win message
     } 
    else if (!arrayTraps[currentPosition]) { // safe tile
        messageDisplay.textContent = "No trap, you are good!"; // Safe tile message
        updateProgress();
    } else { // hit a trap
        messageDisplay.textContent = "Trap! You are food :("; // Trap tile message
        gameOver=true;
        gameHero.classList.add('fall'); // Add fall animation class
        showReplayButton();
    }
}

// Help button & overlay
helpMark.addEventListener('mouseenter', ()=>{ 
    helpMark.innerHTML="help" 
})
helpMark.addEventListener('mouseleave', ()=>{
    helpMark.innerHTML="?"
})
helpMark.addEventListener('click', toggleHelp)
function toggleHelp() {
    isDialogOpen = !isDialogOpen;
    
    if(isDialogOpen){
        helpContainer.classList.remove('invisible')
    } else {
        helpContainer.classList.add('invisible')
    }
}

// Key event listener for movement
document.addEventListener('keydown', (keyEvent) => {
    const isJumping = keyEvent.key === ' ';

    if(gameOver==true) { // Space activates replay button
        if (isJumping)  gameReset()
        return;
    } 
    const previousPosition = currentPosition; // Store previous position
 
    if (isJumping) {
        // Apply the jump animation
        gameHero.classList.add('jump');

        // Move the player two tiles forward
        currentPosition += 2;

        // Check for traps after the jump animation ends
             checkStatus(previousPosition); // Pass previous position to reveal skipped tiles
            gameHero.classList.remove('jump'); // Remove jump class after animation completes
     } else if (keyEvent.key === 'ArrowRight') {
        // Move the player one tile forward
        currentPosition += 1;
        checkStatus(previousPosition); // Reveal tile immediately after step
    }
    updateHeroPosition(); // Update the left position to reflect movement
});

// Start the game initially
gameReset();
 