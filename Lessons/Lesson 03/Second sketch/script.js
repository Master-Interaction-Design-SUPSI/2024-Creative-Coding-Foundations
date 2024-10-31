/* UI events */

console.log("/* mousedown button */");

document.addEventListener('mousedown', (mouseEvent) => {

    if (mouseEvent.button == 0) {
        console.log("Left click!");
    }
    else if(mouseEvent.button == 2) {
        console.log("Right click!");
    }

});

console.log("/* mouse position */");

document.addEventListener('mousemove', (mouseEvent) => {
    // console.log("X: " + mouseEvent.pageX + ", Y: " + mouseEvent.pageY);

    if(mouseEvent.pageX > 200) {
        document.getElementsByTagName("body")[0].classList.add("on-background");
    }
    else {
        document.getElementsByTagName("body")[0].classList.remove("on-background");
    }

});

console.log("/* keyboard press */");

document.addEventListener('keydown', (keyEvent) => {
    // console.log(keyEvent.key);

    /*
    switch(keyEvent.key) {
        case 'r':
            console.log("Reset");
            break;
        case ' ':
            console.log("Play");
            break;
        case 'k':
            console.log("K has been pressed!");
            break;
        default:
            console.log("Other keys pressed");
            break;
    }
    */

});


/* Exercise 03 demo */

const arrayTraps = [false, false, true, false, true, false]; // to change at gameOver? Success?

console.log(arrayTraps);

let currentPosition = -1;   // player postion on the path

function gameReset() {
    console.log("Game reset!");
    currentPosition = -1;
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