const arrayTraps = [false, false, true, false, false, true, false, false, true, false, true, false];
let currentPosition = -1;
let mario = document.getElementById('mario');
let princess = document.getElementById('princess');
let bridge = document.querySelector('.bridge');
let statusText = document.getElementById('status');
let cells = [];
let hasWon = false;

let trapSound = document.getElementById('trapSound');
let victorySound = document.getElementById('victorySound');

function createBridge() {
    for (let i = 0; i < 12; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        bridge.appendChild(cell);
        cells.push(cell);
    }
}

function gameReset() {
    currentPosition = -1;
    hasWon = false;
    mario.style.left = '0px';
    princess.style.display = 'block';
    winMessage.style.display = 'none';
    updateStatus("Start!");
    cells.forEach(cell => cell.classList.remove('green', 'red'));
}

function updateStatus(message) {
    statusText.textContent = message;
}

function checkStatus() {
    if (currentPosition === arrayTraps.length - 1 && !hasWon) {
        hasWon = true;
        updateStatus();
        winMessage.style.display = 'block';
        victorySound.play();
    } else if (arrayTraps[currentPosition]) {
        updateStatus("Oh no, you lost!");
        currentPosition = -1;
        mario.style.left = '0px';
        cells.forEach(cell => cell.classList.remove('green', 'red'));
        trapSound.play();
    } else {
        updateStatus("Safe! Keep going.");
    }
}

document.addEventListener('keydown', (keyEvent) => {
    if (hasWon) return;
    if (keyEvent.key === 'ArrowRight' && currentPosition + 1 < 12) {
        currentPosition++;
        mario.style.left = currentPosition * (100 / 12) + '%';
        checkStatus();
    } else if (keyEvent.key === ' ' && currentPosition + 2 < 12) {
        currentPosition += 2;
        mario.style.left = currentPosition * (100 / 12) + '%';
        checkStatus();
    }
});

document.getElementById('moveRight').addEventListener('click', () => {
    if (hasWon) return;
    if (currentPosition + 1 < 12) {
        currentPosition++;
        mario.style.left = currentPosition * (100 / 12) + '%';
        checkStatus();
    }
});

document.getElementById('jump').addEventListener('click', () => {
    if (hasWon) return;
    if (currentPosition + 2 < 12) {
        currentPosition += 2;
        mario.style.left = currentPosition * (100 / 12) + '%';
        checkStatus();
    }
});

createBridge();
gameReset();
