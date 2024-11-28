let character = document.getElementById('first-character');
let currentTile = 0;
let isJumping = false;
let isMoving = false;
let gameOver = false;
let animationInterval;
const jumpHeight = 100; 
const groundLevel = 400; 
let tiles = [];
let secondCharacter = document.getElementById('second-character');
let secondCharacterToggle = true;
let runningInterval;
let idleInterval;

const totalTiles = 8;

// initialize audio elements
const failAudio = new Audio('sounds/fail.mp3');
const jumpAudio = new Audio('sounds/jump.mp3');
const walkAudio = new Audio('sounds/walk.mp3');
const winAudio = new Audio('sounds/win.mp3');
const loseAudio = new Audio('sounds/lose.mp3'); 

// create the tiles for the game (random + no two consequential)
function createTiles() {
    let tilesContainer = document.getElementById('tiles');
    const tileWidth = window.innerWidth / totalTiles;

    for (let i = 0; i < totalTiles; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.width = tileWidth + 'px';
        tilesContainer.appendChild(tile);

        if (i === totalTiles - 1) {
            tile.classList.add('correct');
        } else {
            tile.classList.add(Math.random() < 0.5 ? 'correct' : 'incorrect');
        }
        tiles.push(tile);
    }
}

// keydown event listener to handle user input
document.addEventListener('keydown', function(event) {
    if (!gameOver && !isMoving) {
        if (event.key === "ArrowRight") {
            moveToNextTile();
        } else if (event.key === " " && !isJumping) {
            jumpToNextTile();
        }
    }
});

// move to the next tile
function moveToNextTile() {
    startAnimation();
    currentTile += 1;
    moveCharacter(currentTile);
    checkTile(currentTile);
    playWalkSound(); 
    stopAnimationAfterDelay(400);
}

// jump to the next tile
function jumpToNextTile() {
    startAnimation();
    isJumping = true;

    // smaller jump if on 7th tile + normal jump
    if (currentTile === 6) {
        currentTile += 1;  // 
        jumpCharacter(currentTile, 400, 200);  
    } else {
        currentTile += 2;  
        jumpCharacter(currentTile, 600, 200); 
    }

    playJumpSound(); 

    setTimeout(() => isJumping = false, 600); 
    checkTile(currentTile);
    stopAnimationAfterDelay(600);  
}

const horizontalOffset = 20;

// move character to a specific tile
function moveCharacter(tileIndex) {
    const tileWidth = window.innerWidth / totalTiles;
    const newPosition = tileIndex * tileWidth + horizontalOffset;
    character.style.left = newPosition + 'px';
}

// animate the character's jump
function jumpCharacter(tileIndex, jumpDuration, jumpHeight) {
    const tileWidth = window.innerWidth / totalTiles;
    const newPosition = tileIndex * tileWidth + horizontalOffset;
    const jumpPeak = groundLevel + jumpHeight;

    character.style.transition = `left ${jumpDuration}ms linear, bottom ${jumpDuration}ms ease-in-out`;
    character.style.left = newPosition + 'px';
    character.style.bottom = jumpPeak + 'px';

    setTimeout(() => {
        character.style.bottom = groundLevel + 'px';
    }, jumpDuration / 2);

    setTimeout(() => {
        isJumping = false;
    }, jumpDuration);
}

// start walking animation
function startAnimation() {
    isMoving = true;
    let toggle = true;
    animationInterval = setInterval(() => {
        character.src = toggle ? "https://i.postimg.cc/QtbTHPLz/right-leg.png" : "https://i.postimg.cc/L58ZfT28/left-leg.png";
        toggle = !toggle;
    }, 100);
}

// stop walking animation 
function stopAnimationAfterDelay(delay) {
    setTimeout(() => {
        clearInterval(animationInterval);
        character.src = "https://i.postimg.cc/TwGb2xsm/stand.png";
        isMoving = false;
    }, delay);
}

// human runs to fall position
function runToPosition(targetX) {
    stopIdleAnimation();
    
    const speed = 0.4; 
    const currentX = secondCharacter.getBoundingClientRect().left;
    const distance = Math.abs(targetX - currentX);
    const duration = distance / speed;

    // offset to stop before the robot (to not compenetrate characters)
    const offset = -150; 
    const newPosition = targetX + offset;

    secondCharacter.style.transition = `left ${duration}ms linear`;
    secondCharacter.style.left = newPosition + 'px'; // 

    runningInterval = setInterval(() => {
        secondCharacter.src = secondCharacterToggle
            ? "https://i.postimg.cc/PJ1qKrLQ/human-run-2.png"
            : "https://i.postimg.cc/Kz6zngYY/human-run-1.png";
        secondCharacterToggle = !secondCharacterToggle;
    }, 100);

    setTimeout(() => {
        clearInterval(runningInterval);
        startIdleAnimation();
    }, duration);
}

// movement animation of the human
function startIdleAnimation() {
    idleInterval = setInterval(() => {
        secondCharacter.src = secondCharacterToggle
            ? "https://i.postimg.cc/hG3htYWT/human-still-1.png"
            : "https://i.postimg.cc/hjzvz0cw/human-still-2.png";
        secondCharacterToggle = !secondCharacterToggle;
    }, 500);
}

// stop movement animation of the human
function stopIdleAnimation() {
    clearInterval(idleInterval);
}

// check the current tile 
function checkTile(tileIndex) {
    if (tileIndex >= totalTiles) return;

    const tile = tiles[tileIndex];

    if (tileIndex === totalTiles - 1) {
        // delay victory message + win sound
        setTimeout(() => {
            showGameMessage("You won! Bot can continue its thrilling escape!");
            playWinSound(); 
        }, 1000); 
        return;
    }

    //robot fall
    setTimeout(() => {
        if (tile && tile.classList.contains('incorrect')) {
            character.src = "https://i.postimg.cc/DZqRBmJp/pixel-art-robot-icon-735839-1830-8.png"; 
            gameOver = true;
            character.style.transition = "bottom 0.75s linear";
            character.style.bottom = "0px"; 
            tile.classList.add('falling'); 

            const fallPositionX = character.getBoundingClientRect().left;

            // start human run
            runToPosition(fallPositionX);

            // fall robot movement 
            let toggleStandImage = true;
            const alternatingInterval = setInterval(() => {
                character.src = toggleStandImage ? "https://i.postimg.cc/TwGb2xsm/stand.png" : "https://i.postimg.cc/DZqRBmJp/pixel-art-robot-icon-735839-1830-8.png";
                toggleStandImage = !toggleStandImage;
            }, 100); 

            // stop animation after robot fall
            setTimeout(() => {
                clearInterval(alternatingInterval);
                character.src = "https://i.postimg.cc/TwGb2xsm/stand.png"; 
            }, 1000); 

            // play fail sound
            failAudio.play(); 

            // play lose sound after the advice
            setTimeout(() => {
                loseAudio.play(); // loss sound
                showGameMessage("You lost! Bot is now in the hands of the humans.");
            }, 2000);
        }
    }, 650);
}

// show game message 
function showGameMessage(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('game-modal').style.display = 'flex'; // show the modal
}

// reload page with restart button
document.getElementById('restart-button').addEventListener('click', () => {
    location.reload(); // reload the page to restart the game
});

startIdleAnimation();
createTiles();

// play walking sound
function playWalkSound() {
    walkAudio.play();
}

// play jump sound
function playJumpSound() {
    jumpAudio.play();
}

// play win sound
function playWinSound() {
    winAudio.play();
}

let introText = document.getElementById('intro-text');

// hide intro text on click or key press
function hideIntroText() {
    introText.style.display = 'none';
}

document.addEventListener('keydown', hideIntroText);
document.addEventListener('click', hideIntroText);
