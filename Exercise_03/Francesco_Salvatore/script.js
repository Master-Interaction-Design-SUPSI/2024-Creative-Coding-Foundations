const leftPathTraps = [true, true, false, false, false, true];  // traps on the left path --> can be modified
const rightPathTraps = leftPathTraps.map(trap => !trap); // traps on the right path are mirrored thanks to the map

console.log("Left Path:", leftPathTraps);
console.log("Right Path:", rightPathTraps);

// Starting values
let currentPosition = -1;
let currentPath = 'left';
let stepsTaken = 0; 

// function to update the number of steps-count
function updateSteps() {
    document.getElementById('steps-count').innerText = `Steps: ${stepsTaken}`;
}

// Function to reset the game --> reset the steps count
function gameReset() {
    console.log("Game reset!");
    currentPosition = -1;
    currentPath = 'left';
    stepsTaken = 0;
    updateSteps();
    checkStep();
}

// Function to check the player's status
function checkStatus() {
    console.log("Current position:", currentPosition);
    console.log("Current path:", currentPath);

    if (currentPosition < 0) {
        console.log("You are at the starting position. No status check needed.");
        return; // necessary so that doesn't check if there are traps before starting (fix the error)
    }
    if (currentPosition > leftPathTraps.length - 1) {  // end of the path --> win condition --> reset
        console.log("WINNER! You are safe!");
        alert ("YOU ARE A WINNER, GOOD JOB");
        gameReset();

    } else {
        let currentTrapStatus;

        if (currentPath === 'left') {
            currentTrapStatus = leftPathTraps[currentPosition];
        } else {
            currentTrapStatus = rightPathTraps[currentPosition];
        }

        if (currentTrapStatus === false) { 
            console.log("No traps, you are safe!");
        } else { // lose condition --> restart
            console.log("Trap! Too bad, game over");
            alert ("YOU ARE A LOOSER, KEEP PLAY");
            gameReset(); 
        }
    }
}

//Logic for the movement
document.addEventListener('keydown', (keyEvent) => {
    switch(keyEvent.key) {
        case 'ArrowRight':
            console.log("Right-Arrow --> Switching to right path");
            currentPosition++;
            currentPath = 'right';
            stepsTaken++;
            checkStatus();
            break;
        case 'ArrowLeft':
            console.log("Left Arrow --> Switching to left path");
            currentPosition++;
            currentPath = 'left';
            stepsTaken++;
            checkStatus();
            break;
        default:
            console.log("Invalid key pressed");
    }
    updateSteps(); // Call the function to update the step display
    checkStep(); // Call the function to update the visual
});



// renderization on the screen --> Function to check the current step and apply styles
function checkStep() {
    for (let i = 0; i < leftPathTraps.length; i++) {
        document.getElementById(`left-step-${i}`)?.classList.remove('highlight', 'safe', 'trap');
        document.getElementById(`right-step-${i}`)?.classList.remove('highlight', 'safe', 'trap');
    }

    if (currentPosition >= 0 && currentPosition < leftPathTraps.length) {
        activateStepClass(currentPath, currentPosition);
    }
}

function activateStepClass(path, position) {
    const stepElement = document.getElementById(`${path}-step-${position}`);
    if (stepElement) {
        stepElement.classList.add('highlight');

        if ((path === 'left' && leftPathTraps[position]) || (path === 'right' && rightPathTraps[position])) {
            stepElement.classList.add('trap');
        } else {
            stepElement.classList.add('safe');
        }
    } else {
        console.error(`Element ${path}-step-${position} not found.`);
    }
}