document.addEventListener('DOMContentLoaded', () => {
    const arrayTraps = [false, false, true, false, true, false, true]; // Sequence for 7 boxes
    const container = document.getElementById('rectangle-container');
    const frogIcon = document.getElementById('frog-icon');
    const flyIcon = document.getElementById('fly-icon');
    const lawnMowerRow = document.getElementById('lawn-mower-row'); 
    const hopSound = new Audio('assets/sounds/cartoon-bounce.mp3');
    let currentPosition = -1; // player position on the path

    hopSound.load();

    // Shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 7 colored rectangles
    function generateRectanglesAndTraps() {
        container.innerHTML = ''; // Clear existing rectangles
        let colors = ['#ded70d', '#2cbbf2', '#c302dd', '#df0005', '#8482ff', '#0000fe', '#307a07'];
        colors = shuffleArray(colors).slice(0, 7); 

        colors.forEach(color => {
            const rectangle = document.createElement('div');
            rectangle.classList.add('rectangle');
            rectangle.style.backgroundColor = color;
            container.appendChild(rectangle);
        });

        positionIcons(); 
    }

    // Position frog and fly icons at start and end of path
    function positionIcons() {
        const rectangles = container.children;
        const mainContainerRect = document.getElementById('main-container').getBoundingClientRect();

        if (rectangles.length < 7) return;

        // Position frog icon on first rectangle
        const firstRect = rectangles[0].getBoundingClientRect();
        frogIcon.style.left = `${firstRect.left - mainContainerRect.left + firstRect.width / 2 - frogIcon.offsetWidth / 2}px`;
        frogIcon.style.top = `${firstRect.top - mainContainerRect.top - frogIcon.offsetHeight}px`;

        // Position fly icon on last rectangle
        const lastRect = rectangles[6].getBoundingClientRect();
        flyIcon.style.left = `${lastRect.left - mainContainerRect.left + lastRect.width / 2 - flyIcon.offsetWidth / 2}px`;
        flyIcon.style.top = `${lastRect.top - mainContainerRect.top - flyIcon.offsetHeight}px`;
    }

    // Update frog position on current rectangle
    function updateFrogPosition() {
    const rectangles = container.children;
    if (currentPosition < 0 || currentPosition >= rectangles.length) return;

    const targetRect = rectangles[currentPosition].getBoundingClientRect();
    const mainContainerRect = document.getElementById('main-container').getBoundingClientRect();

    // Position frog on current rectangle
    frogIcon.style.left = `${targetRect.left - mainContainerRect.left + targetRect.width / 2 - frogIcon.offsetWidth / 2}px`;
    frogIcon.style.top = `${targetRect.top - mainContainerRect.top - frogIcon.offsetHeight}px`;
}

    // Play hop sound and move frog on jump
    function handleJump(moveBy) {
    hopSound.play();
    currentPosition = Math.min(currentPosition + moveBy, arrayTraps.length);
    checkStatus();
    updateFrogPosition();
}

// Lawn mower icons
function addLawnMowers() {
    lawnMowerRow.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const lawnMowerIcon = document.createElement('img');
        lawnMowerIcon.src = 'assets/icons/lawn-mower2.png';
        lawnMowerIcon.alt = 'Lawn Mower';
        lawnMowerIcon.classList.add('lawn-mower-icon');
        lawnMowerRow.appendChild(lawnMowerIcon);
    }
}

    // Initialize game elements
    generateRectanglesAndTraps();
    addLawnMowers();

function gameReset() {
    console.log("Game reset!");
    currentPosition = -1;  // move player back to beginning of path
}

function checkStatus() {
    console.log("Current Position:", currentPosition);

    if (currentPosition > arrayTraps.length - 1) { // End of path, win!
        console.log("You made it! Enjoy your flies.");
        gameReset();
    } else { // Still on path
        if (arrayTraps[currentPosition] === false) { // Safe square
            console.log("No traps, so far, you are safe!");
        } else { // Trap
            console.log("Trap! The mower got you this time, game over");
            gameReset();
        }
        updateFrogPosition(); // Update frog's position after each move
    }
}


// Event listener for player movements
document.addEventListener('keydown', (keyEvent) => {
    switch (keyEvent.key) {
        case ' ':   // Big hop (jump two squares)
            console.log("Big hop!");
            handleJump(2);
            currentPosition = Math.min(currentPosition + 2, arrayTraps.length);
            checkStatus();
            break;
        case 'ArrowRight':  // Small hop (move one square)
            console.log("Small hop");
            handleJump(1);
            currentPosition = Math.min(currentPosition + 1, arrayTraps.length);
            checkStatus();
            break;
    }
});


// Reposition icons on window resize
window.addEventListener('resize', positionIcons);

});