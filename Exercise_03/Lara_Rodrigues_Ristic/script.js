console.log("---* Levels and traps * ---");

const levelOne = [true, false, true, true, true];
const levelTwo = [true, false, true, false, true, true, false];
const levelThree = [true, true, false, true, false, true, true, false];
const levels = [levelOne, levelTwo, levelThree]; 
const gameSection = document.getElementById('game-section');
const pressSpace = document.getElementById('press-space');

const popup = document.getElementById('popup');
const popupImage = document.getElementById('popup-image');
const popupMessage = document.getElementById('popup-message');

const restartButton = document.getElementById('restart-button');

function showPopup(imageSrc, message) {
    popupImage.src = imageSrc;
    popupMessage.textContent = message;
    popup.style.display = 'flex';
};

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        gameSection.classList.toggle('hidden');
        gameSection.classList.toggle('active');
        pressSpace.classList.toggle('active');
        pressSpace.classList.toggle('hidden');
        showPopup('Assets/start.gif', 'Choose your step');
    }
});


console.log(levels);

console.log("---* Position of the character * ---");
let currentLevel = 0; // which level we are on at the beggining
let currentPosition = -1; // which step of the level we are on at the beggining
console.log(`Level ${currentLevel + 1} started!`);


// shuffle the levels boolean when the game is restarted
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// to show where we are
function updateLevelInfo() {
    const levelText = document.getElementById('level-text');
    levelText.textContent = `Level: ${currentLevel + 1}, Step: ${currentPosition + 1}`;
}

// reseting the game and shuffling the levels
function gameReset() {
    console.log("Game reset");
    levels.forEach(level => shuffleArray(level));
    currentLevel = 0; // Back to first level
    currentPosition = -1; // Begininng of the level
    console.log(`Level ${currentLevel + 1} started!`);
    updateLevelInfo();
}

restartButton.addEventListener('click', function() {
    gameReset();
    showPopup('Assets/start.gif', 'Choose your step')
});


// Checking if we passed the game cleared the level or fell in the trap

function checkStatus() {
    console.log(`Position: ${currentPosition}, Level: ${currentLevel + 1}`);
    
    updateLevelInfo();

    //Did we clear the level or finish the game
    if (currentPosition >= levels[currentLevel].length) {

        // Did we clear the level
        if (currentLevel < levels.length - 1) {
            console.log("Level completed! Moving to the next level.");
            currentLevel++;
            currentPosition = -1;
            showPopup('Assets/next_level.gif', 'Congrats you passed the level, Start next level');

        console.log(`Level ${currentLevel + 1} started!`);
        console.log(currentPosition);

        // We cleared the game
        } else {
            console.log("You're a wizard Harry'");
            gameReset(); // The game restarts only when we finish all the levels
            console.log(levels);
            showPopup('Assets/game_passed.gif', 'Congrats you passed the game!');
        }
    }
    else {   // still on the path
        
        
        if (levels[currentLevel][currentPosition] === true) {  // No trap next, step
            console.log("No trap, choose your next step");
            showPopup('Assets/clear.gif', 'No trap, choose your next step');
        } 
        else {  // Trap - restart the level
            console.log("You fell into a trap, restarting the level...");
            currentPosition = -1;
            showPopup('Assets/trap.webp', 'You fell into a trap! Restarting the level');
        }
    }
}

document.addEventListener('keydown', (keyEvent) => {
    switch(keyEvent.key) {
        case 'ArrowUp':  
            console.log("jump");
            currentPosition += 2;
            checkStatus();
            break;

        case 'ArrowRight':
            console.log("step");
            currentPosition ++;
            checkStatus();
            break;
    }
});
