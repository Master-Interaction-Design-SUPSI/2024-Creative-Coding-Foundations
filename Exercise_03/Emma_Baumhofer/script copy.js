// Variables
let arrayTraps = generateTraps(7); // Dynamically generate traps
let currentPosition = 0; 
let hopSound = new Audio('assets/sounds/cartoon-bounce.mp3'); 
let mowerSound = new Audio('assets/sounds/mower-start.mp3'); 

// Generate traps - first and last always safe
function generateTraps(length) {
    let traps = Array(length).fill(false); 
    for (let i = 1; i < length - 1; i++) {
        traps[i] = Math.random() < 0.5; // 50% probability
    }
    return traps;
}

// Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Generate 7 rectangles and assign colors
function generateRectangles() {
    let colors = ['#ded70d', '#2cbbf2', '#c302dd', '#df0005', '#8482ff', '#0000fe', '#307a07'];
    colors = shuffleArray(colors).slice(0, 7);
    let container = document.getElementById('rectangle-container');
    container.innerHTML = '';

    for (let i = 0; i < colors.length; i++) {
        let rectangle = document.createElement('div');
        rectangle.style.backgroundColor = colors[i];
        rectangle.style.width = '50px';
        rectangle.style.height = '20px';
        rectangle.style.display = 'inline-block';
        rectangle.style.margin = '5px';
        rectangle.classList.add('rectangle');
        container.appendChild(rectangle);
    }
}

// Update frog icon position 
function updateFrogPosition() {
    let frogIcon = document.getElementById('frog-icon');
    let rectangles = document.querySelectorAll('#rectangle-container .rectangle');

    if (currentPosition < 0 || currentPosition >= rectangles.length) {
        frogIcon.style.display = 'none'; 
        return;
    }

    frogIcon.style.display = 'block';
    let targetRect = rectangles[currentPosition];
    frogIcon.style.left = targetRect.offsetLeft + 'px';
    frogIcon.style.top = targetRect.offsetTop - 50 + 'px'; // Position slightly above the rectangle
}

// Position the frog and fly icons on specific rectangles
function positionIcons() {
    let flyIcon = document.getElementById('fly-icon');
    let rectangles = document.querySelectorAll('#rectangle-container .rectangle');

    if (rectangles.length > 0) {
        let lastRect = rectangles[rectangles.length - 1];
        flyIcon.style.left = lastRect.offsetLeft + 'px';
        flyIcon.style.top = lastRect.offsetTop - 50 + 'px';
        flyIcon.style.display = 'block'; 
    }
}

// Handle jump logic
function handleJump(moveBy) {
    let rectangles = document.querySelectorAll('#rectangle-container .rectangle');
    currentPosition = Math.min(currentPosition + moveBy, rectangles.length - 1);

    hopSound.currentTime = 0; // Reset sound to the start
    hopSound.play();

    checkStatus();
    updateFrogPosition();
}

// Check game status
function checkStatus() {
    if (currentPosition >= arrayTraps.length) {
        console.log('You made it! Enjoy your flies.');
        resetGame();
    } else if (arrayTraps[currentPosition]) {
        console.log('Trap! The mower got you. Game over.');
        mowerSound.currentTime = 0; // Play mower sound
        mowerSound.play();
    } else {
        console.log('Safe square. Keep going!');
    }
}

// Lawn mower icon below rectangles
function showLawnMower() {
    let mowerRow = document.getElementById('lawn-mower-row');
    mowerRow.innerHTML = '';

    let lawnMowerIcon = document.createElement('img');
    lawnMowerIcon.src = 'assets/icons/lawn-mower2.png';
    lawnMowerIcon.alt = 'Lawn Mower';
    lawnMowerIcon.style.width = '50px';
    lawnMowerIcon.style.height = '50px';
    lawnMowerIcon.style.margin = '5px';

    mowerRow.appendChild(lawnMowerIcon);
}

// Reset the game
function resetGame() {
    currentPosition = 0; 
    arrayTraps = generateTraps(7);
    updateFrogPosition();
}

// Event listener for player movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        handleJump(1); // Small hop
    } else if (event.key === ' ') {
        handleJump(2); // Big hop
    }
});

// Initialize game
generateRectangles();
positionIcons();
updateFrogPosition();
showLawnMower();