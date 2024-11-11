// Define three tracks (track1, track2, track3)
const track1 = [false, true, false, false, false, true, true];
const track2 = [false, false, false, true, false, false, false];
const track3 = [true, false, true, true, false, false, false];

let currentTrack = 0; // Current track (0 = track1, 1 = track2, 2 = track3)
let currentPosition = 0; // Current player's position on the track
let gridPosition = 0; // Car's position in the grid (0 to 17)
let hp = 100; // Initial HP
const HPmax = 100; // Maximum HP

let keyboardEnabled = false; // Flag to control keyboard input

// Update car's position in the grid
function updateCarPosition() {
    const cells = document.querySelectorAll('.flex-item');
    cells.forEach(cell => cell.innerHTML = ''); // Clear all cells

    const targetCell = document.getElementById(`cell-${gridPosition}`);
    if (targetCell) {
        const carImage = document.createElement("img");
        carImage.id = "car";
        carImage.src = "assets/car.png";
        targetCell.appendChild(carImage);
    }
    updateHPDisplay();
}

// Update HP display
function updateHPDisplay() {
    const hpDisplay = document.getElementById('hp');
    if (hpDisplay) hpDisplay.textContent = `HP: ${hp}`;
}

// Display message in the notice div
function displayNotice(message) {
    const noticeDiv = document.getElementById('notice');
    noticeDiv.textContent = message;
}

function checkStatus() {
    const currentPath = [track1, track2, track3][currentTrack];

    // Check if the player has reached the finish line
    if (gridPosition === 17) {
        displayNotice("Congratulations! You've reached the finish line!");
        console.log("You win!");

        // Start fireworks after the win
        startFireworks();

        // Delay the reset so the player can see the win message
        setTimeout(() => {
            resetGame();
            displayNotice("Game restarted!");
        }, 5000); // 10 second delay before game reset
        return;
    }

    // Check if out of bounds
    if (currentPosition >= currentPath.length || currentPosition < 0) {
        displayNotice("Out of bounds! Game over.");
        resetGame();
        return;
    }

    // Check if the current position is a trap
    if (currentPath[currentPosition] === false) {
        displayNotice("Safe progress!");
    } else {
        hp -= 40;
        displayNotice("HP -40%! You stepped on a trap.");
        updateHPDisplay();

        // Game ends if HP is less than or equal to 0
        if (hp <= 0) {
            displayNotice("Game Over! Your HP has run out.");
            console.log("GAME OVER!");

            // Automatically restart the game after a delay (e.g., 2 seconds)
            setTimeout(() => {
                resetGame();
                displayNotice("Game restarted!");
            }, 500); // 0.5 second delay for game over message
        }
    }
}

// Reset the game (with the restart button hidden)
function resetGame() {
    currentTrack = 0;
    currentPosition = 0;
    gridPosition = 0;
    hp = HPmax;
    updateCarPosition();
    updateHPDisplay();
    displayNotice(""); // Clear the notice
    keyboardEnabled = true; // Enable keyboard input again
}

// Cancel the game
function cancelGame() {
    document.getElementById('destination').value = ''; // Clear input
    console.log("Destination cleared. Enter a new one.");
    resetGame();
    document.getElementById('game').style.display = 'none'; // Hide game area
}

// Keyboard event listener for player movement
function handleKeydown(event) {
    if (!keyboardEnabled) return; // Ignore if keyboard input is disabled

    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            if (currentTrack > 0) {
                currentTrack--;
                gridPosition -= 6;
            }
            break;
        case 's':
        case 'ArrowDown':
            if (currentTrack < 2) {
                currentTrack++;
                gridPosition += 6;
            }
            break;
        case 'a':
        case 'ArrowLeft':
            if (gridPosition % 6 !== 0) {
                currentPosition--;
                gridPosition--;
            }
            break;
        case 'd':
        case 'ArrowRight':
            if (gridPosition % 6 !== 5) {
                currentPosition++;
                gridPosition++;
            }
            break;
        default:
            return;
    }

    checkStatus();
    updateCarPosition();
}

// Attach the event listener for keyboard inputs (but control with the flag)
document.addEventListener('keydown', handleKeydown);

// Initialize game (Hide game area initially)
resetGame();

// "Start" button event listener
document.getElementById('button-start').addEventListener('click', () => {
    const destinationInput = document.getElementById('destination').value.trim();

    if (destinationInput === "") {
        displayNotice("Please enter a destination to start the game.");
    } else {

        // Reset the game before starting it
        resetGame(); // Ensures the car starts at gridPosition 0
        
        // Start the game once the destination is entered
        startGame(destinationInput);
    }
});

// "Cancel" button event listener
document.getElementById('button-cancel').addEventListener('click', reloadPAGE);

// Start the game
function startGame(destination) {
    // Show game area
    document.getElementById('game').style.display = 'block';
    
    // Update the notice
    displayNotice(`You are heading to ${destination}. Let the adventure begin!`);
    
    // Update the <h1> element to reflect the destination
    const oldH1 = document.querySelector('h1');
    if (oldH1) {
        oldH1.textContent = `You are heading to ${destination}.`;
    } else {
        console.error('No <h1> element found!');
    }

    // Enable keyboard input after the game starts
    keyboardEnabled = true;
}

// Reload the game page after the game ends
function reloadPAGE() {
    // Reload the entire page when the user clicks the cancel button
    location.reload();
}

// Fireworks function
function startFireworks() {
    // Create a new container for the fireworks (if not already present)
    const container = document.createElement('div');
    container.classList.add('fireworks-container');
    document.getElementById('game').appendChild(container);

    // Initialize Fireworks.js correctly
    const fireworks = new Fireworks.default(container, {
        speed: 4,
        acceleration: 2,
        friction: 0.98,
        particles: 100,
    });

    fireworks.start();

    // Stop fireworks after 3 seconds
    setTimeout(() => {
        fireworks.stop();
        container.remove();
    }, 5000); //duration of fireworks
}

