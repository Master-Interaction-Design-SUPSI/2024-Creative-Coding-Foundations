const gridSize = 5;
let arrayTraps = Array(gridSize * gridSize).fill(false).map(() => Math.random() < 0.3);
let currentPosition = 0;
const finishPosition = gridSize * gridSize - 1;

const bridge = document.getElementById('bridge');
const feedback = document.getElementById('feedback');
const jumpSound = document.getElementById('jump-sound');
const safeSound = document.getElementById('safe-sound');
const trapSound = document.getElementById('trap-sound');
const winSound = document.getElementById('win-sound');

function generateNewPath() {
    arrayTraps = Array(gridSize * gridSize).fill(false).map(() => Math.random() < 0.3);
    arrayTraps[0] = false;
    arrayTraps[finishPosition] = false;
}

function initBridge() {
    bridge.innerHTML = '';
    arrayTraps.forEach((isTrap, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-index', index);
        
        if (index === 0) {
            tile.classList.add('start');
            tile.innerText = 'Start';
        } else if (index === finishPosition) {
            tile.classList.add('finish');
            tile.innerText = 'Finish';
        }
        
        bridge.appendChild(tile);
    });
}

function gameReset(won) {
    currentPosition = 0;
    feedback.className = '';
    feedback.innerText = won ? "Congratulations! You've crossed the bridge!" : "Game reset! Try again from the beginning.";
    
    if (won) {
        generateNewPath(); 
        initBridge(); 
    }
    updatePlayerPosition();
}

function updatePlayerPosition() {
    document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('player'));
    if (currentPosition >= 0 && currentPosition < arrayTraps.length) {
        bridge.children[currentPosition].classList.add('player');
    }
}

function checkStatus() {
    if (currentPosition === finishPosition) {
        feedback.innerText = "You WIN! You've crossed the bridge!";
        feedback.className = 'success';
        winSound.play(); 
        setTimeout(() => gameReset(true), 3000);
    } else if (arrayTraps[currentPosition]) {
        feedback.innerText = "Trap! Game over.";
        feedback.className = 'failure';
        trapSound.play();
        bridge.children[currentPosition].classList.add('trap');
        setTimeout(() => gameReset(false), 2000);
    } else {
        feedback.innerText = "Safe! Keep going.";
        feedback.className = '';
        safeSound.play();
        bridge.children[currentPosition].classList.add('safe');
    }
    updatePlayerPosition();
}

function movePlayer(direction) {
    switch(direction) {
        case 'right':
            if ((currentPosition + 1) % gridSize !== 0) currentPosition++;
            break;
        case 'left':
            if (currentPosition % gridSize !== 0) currentPosition--;
            break;
        case 'up':
            if (currentPosition - gridSize >= 0) currentPosition -= gridSize;
            break;
        case 'down':
            if (currentPosition + gridSize < arrayTraps.length) currentPosition += gridSize;
            break;
    }
    checkStatus();
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowRight':
            movePlayer('right');
            break;
        case 'ArrowLeft':
            movePlayer('left');
            break;
        case 'ArrowUp':
            movePlayer('up');
            break;
        case 'ArrowDown':
            movePlayer('down');
            break;
        case ' ':
            currentPosition += 2;
            jumpSound.play();
            checkStatus();
            break;
    }
});

generateNewPath();
initBridge();
updatePlayerPosition();
