/* Exercise 03 demo */

const arrayTraps = [false, false, true, false, true, false]; // sequence of the traps on the path

console.log(arrayTraps);

let currentPosition = -1;   // player postion on the path

function gameReset() {
    console.log("Game reset!");
    currentPosition = -1;  // move the player back at the beginning of the path
}

function checkStatus() {
    console.log(currentPosition);
    
    if(currentPosition > arrayTraps.length - 1) {  // end of the path, win!
        console.log("WINNER! You are safe!");

        // restart the game
        gameReset();
    }
    else {  // still on the path

        if (arrayTraps[currentPosition] == false) {   // we are safe, no traps!
            console.log("No traps, you are safe!");
        }
        else {  // trap!
            console.log("Trap! Too bad, game over");

            // restart the game
            gameReset();
        }
    }
}


document.addEventListener('keydown', (keyEvent) => {

    switch(keyEvent.key) {
        case ' ':   // space bar
            console.log("Jump!");
            currentPosition += 2;
            checkStatus();
            break;
        case 'ArrowRight':  // arrow key right
            console.log("Step");
            currentPosition++;
            checkStatus();
            break;
    }
});