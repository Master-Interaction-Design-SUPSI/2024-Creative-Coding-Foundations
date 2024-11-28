const arrayTraps = [false, false, true, false, true, false, false, true, false];
console.log(arrayTraps);

let currentPosition = -1;


const gameOverMessage = document.getElementById('gameOverMessage');
const winMessage = document.getElementById('winMessage');
const stones = document.querySelectorAll('.stone');
const player = document.getElementById('player');


function gameReset() {
    console.log("Game reset!");
    currentPosition = -1; 
    

    if (gameOverMessage) gameOverMessage.style.display = 'none';
    if (winMessage) winMessage.style.display = 'none';
 
    stones.forEach(stone => stone.classList.remove('safe', 'trap'));
    

    updatePlayerPosition();
}

function checkStatus() {
    console.log(`Current Position: ${currentPosition}`);

    if (currentPosition >= arrayTraps.length) {
        console.log("WINNER! You are safe!");
        if (winMessage) {
            winMessage.style.display = 'block';
            setTimeout(gameReset, 3000);
        }
    } else {
  
        if (arrayTraps[currentPosition]) {
            console.log("Trap! Too bad, game over");
            stones[currentPosition].classList.add('trap');
            if (gameOverMessage) {
                gameOverMessage.style.display = 'block';
                setTimeout(gameReset, 3000);
            }
        } else {
            console.log("No traps, you are safe!");
            stones[currentPosition].classList.add('safe');
        }
    }
}


function updatePlayerPosition() {
    if (player && currentPosition >= 0) {
        player.style.left = `${currentPosition * 80}px`; 
    }
}

document.addEventListener('keydown', (keyEvent) => {
    if (winMessage.style.display === 'block' || gameOverMessage.style.display === 'block') return;
    
    switch(keyEvent.key) {
        case ' ': 
            console.log("Jump!");
            currentPosition += 2; 
            checkStatus();
            updatePlayerPosition();
            break;
        case 'ArrowRight': 
            console.log("Step");
            currentPosition++; 
            checkStatus();
            updatePlayerPosition();
            break;
    }
});

// Initialize game
gameReset();