/* Exercise 03 */
/* Variables */
const ARRAYTRAPS = [false, false, false, false, true, false, true, false, false, true, false, false]; // sequence of the traps on the path
const NEWGAME = document.getElementById("new-game");
const DIALOGTEXT = document.getElementById("dialog-text");
const DIALOGIMG = document.getElementById("dialog-img");
const ARROWS = document.getElementsByClassName("foot-btn");

// player postion on the path
let currentPosition = 0;   

//reset the game after winning or trapped
function gameReset() {
    console.log("Game reset!");
    currentPosition = 0;  // move the player back at the beginning of the path
    location.reload();
}

//function that checks if the player is on a safe cell, a trap, an "edge" or in the winning cell. As parameter there is the id of the cell
function checkStatus(cp) {
    //console.log(currentPosition);

    if (cp == 11) {  // end of the path, win!
        return "winner";

    }
    else {  // still on the path

        if (ARRAYTRAPS[cp] == false) {   // we are safe, no traps!
            return "safe";
        }
        else if (ARRAYTRAPS[cp] == true) {  // trap!
            return "trap";
        }
        else { // edge
            return "stop";
        }
    }
}

//This function check the possible movements on the matrix grid. (e.g. If i'm on the cell #4 I cannot move to the left - desktop version).
//It is for the Desktop and Mobile version 
function checkPath(idCell, key) {
    if (key == " ") {
        switch (idCell) {
            case 0:
                return 2;
            case 1:
                return 3;
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 6;
            case 5:
                return 7;
            case 6:
                return 6;
            case 7:
                return 7;
            case 8:
                return 10;
            case 9:
                return 11;
            case 10:
                return 10;
            case 11:
                return 11;
            default:
                return "Enter a valid number";
        }
    }
    if (key == "ArrowRight") {
        switch (idCell) {
            case 0:
                return 1;
            case 1:
                return 2;
            case 2:
                return 3;
            case 3:
                return 3;
            case 4:
                return 5;
            case 5:
                return 6;
            case 6:
                return 7;
            case 7:
                return 7;
            case 8:
                return 9;
            case 9:
                return 10;
            case 10:
                return 11;
            case 11:
                return 11;
            default:
                return "Enter a valid number";
        }
    }
    if (key == "ArrowLeft") {
        switch (idCell) {
            case 0:
                return 0;
            case 1:
                return 0;
            case 2:
                return 1;
            case 3:
                return 2;
            case 4:
                return 4;
            case 5:
                return 4;
            case 6:
                return 5;
            case 7:
                return 6;
            case 8:
                return 8;
            case 9:
                return 8;
            case 10:
                return 9;
            case 11:
                return 11;
            default:
                return "Enter a valid number";
        }
    }
    if (key == "ArrowUp") {
        switch (idCell) {
            case 0:
                return 0;
            case 1:
                return 1;
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 0;
            case 5:
                return 1;
            case 6:
                return 2;
            case 7:
                return 3;
            case 8:
                return 4;
            case 9:
                return 5;
            case 10:
                return 6;
            case 11:
                return 7;
            default:
                return "Enter a valid number";
        }
    }
    if (key == "ArrowDown") {
        switch (idCell) {
            case 0:
                return 4;
            case 1:
                return 5;
            case 2:
                return 6;
            case 3:
                return 7;
            case 4:
                return 8;
            case 5:
                return 9;
            case 6:
                return 10;
            case 7:
                return 11;
            case 8:
                return 8;
            case 9:
                return 9;
            case 10:
                return 10;
            case 11:
                return 11;
            default:
                return "Enter a valid number";
        }
    }
    if (key == "img-r") {
        switch (idCell) {
            case 0:
                return 1;
            case 1:
                return 1;
            case 2:
                return 3;
            case 3:
                return 3;
            case 4:
                return 5;
            case 5:
                return 5;
            case 6:
                return 7;
            case 7:
                return 7;
            case 8:
                return 9;
            case 9:
                return 9;
            case 10:
                return 11;
            case 11:
                return 11;
            default:
                return "Enter a valid number";
        }
    }
    if (key == "img-l") {
        switch (idCell) {
            case 0:
                return 0;
            case 1:
                return 0;
            case 2:
                return 2;
            case 3:
                return 2;
            case 4:
                return 4;
            case 5:
                return 4;
            case 6:
                return 6;
            case 7:
                return 6;
            case 8:
                return 8;
            case 9:
                return 8;
            case 10:
                return 10;
            case 11:
                return 11;
            default:
                return "Enter a valid number";
        }
    }
    if (key == "img-up") {
        switch (idCell) {
            case 0:
                return 0;
            case 1:
                return 1;
            case 2:
                return 0;
            case 3:
                return 1;
            case 4:
                return 2;
            case 5:
                return 3;
            case 6:
                return 4;
            case 7:
                return 5;
            case 8:
                return 6;
            case 9:
                return 7;
            case 10:
                return 8;
            case 11:
                return 11;
            default:
                return "Enter a valid number";
        }
    }
    if (key == "img-d") {
        switch (idCell) {
            case 0:
                return 2;
            case 1:
                return 3;
            case 2:
                return 4;
            case 3:
                return 5;
            case 4:
                return 6;
            case 5:
                return 7;
            case 6:
                return 8;
            case 7:
                return 9;
            case 8:
                return 10;
            case 9:
                return 11;
            case 10:
                return 10;
            case 11:
                return 11;
            default:
                return "Enter a valid number";
        }
    }
    else {
        return "WrongKey";
    }

}

//The function that change the graphic of the grid based on the movement (keys or btns)
function movementKeys(keys) {
    oldPosition = currentPosition;
    currentPosition = checkPath(currentPosition, keys);
    if (checkStatus(currentPosition) == "stop") {

    }
    else if (checkStatus(currentPosition) == "trap") {
        //move player to the next cell
        document.getElementById("img-" + (currentPosition)).setAttribute("src", "assets/img/alien.png");
        DIALOGTEXT.innerText = "Trap! Too bad, game over";
        DIALOGIMG.setAttribute("src", "assets/img/alien.png");
        favDialog.showModal();

    }
    else if (checkStatus(currentPosition) == "winner") {
        DIALOGTEXT.innerText = "WINNER! You get to the crown!";
        DIALOGIMG.setAttribute("src", "assets/img/crown.png");
        favDialog.showModal();

    }
    else {
        checkStatus(currentPosition);
        //change value to player cell
        document.getElementById("img-" + oldPosition).setAttribute("src", "assets/img/heart.png");
        //move player to the next cell
        document.getElementById("img-" + (currentPosition)).setAttribute("src", "assets/img/player.png");
    }
}


// run the movementKeys function when there are some clicks on the keyboard
document.addEventListener('keydown', (keyEvent) => {
    switch (keyEvent.key) {
        case ' ':   // space bar
            movementKeys(' ');
            break;
        case 'ArrowRight':  // arrow key right
            movementKeys('ArrowRight');
            break;
        case 'ArrowLeft':  // arrow key left
            movementKeys('ArrowLeft');
            break;
        case 'ArrowDown':  // arrow key down
            movementKeys('ArrowDown');
            break;
        case 'ArrowUp':  // arrow key up
            movementKeys('ArrowUp');
            break;
    }
});

// run the movementKeys function when there are some clicks on the buttons (mobile version)
for (var i = 0; i < ARROWS.length; i++) {
    ARROWS[i].addEventListener("click", function () {
        switch (this.id) {
            case 'img-r':  // arrow key right
                movementKeys('img-r');
                break;
            case 'img-l':  // arrow key left
                movementKeys('img-l');
                break;
            case 'img-u':  // arrow key down
                movementKeys('img-u');
                break;
            case 'img-d':  // arrow key up
                movementKeys('img-d');
                break;
        }
    });
}

//Start a new game. CLick on the modal btn
NEWGAME.addEventListener("click", function () {
    // restart the game
    gameReset();
})