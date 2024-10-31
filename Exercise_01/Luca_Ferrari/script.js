//Random int function generator
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Variable definitions
let winner = getRandomInt(1, 9);
let tries = 1;
const buttons = document.getElementsByClassName("btn-hidden");
const result = document.getElementById("result");
const newGame = document.getElementById("new-game");

newGame.addEventListener("click", function () {
    location.reload();
});
/*Check the behaviour of the game. Numbers of tries and style update on btn click.
At each click the if clause check if the value of the btn is equal to the random int generated during the load of the page. 
After the check it changes the class of the btn, it disable the btn in order to prevend multiple clicks 
(and so a wrong number of tries) and changes the image to be displayed (maybe it could be also done via CSS).
If the try is wrong it increments the tries counter. If it is the right choice it shows an alert with the total number of tries.
*/
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        if (this.value != winner) {
            this.setAttribute("disabled", "true");
            this.classList.remove('btn-hidden');
            this.classList.toggle('btn-clicked');
            this.innerHTML = "<img src=\"assets/img/cat.png\" alt=\"buttonpng\" class=\"disabled\"/>";
            tries++;
        }
        else {
            this.setAttribute("disabled", "true");
            this.classList.remove('btn-hidden');
            this.classList.toggle('btn-winner');
            this.innerHTML = "<img src=\"assets/img/dog.png\" alt=\"buttonpng\" class=\"disabled\"/>";
            result.innerHTML = "Nice Job! It takes you " + tries + " steps!";
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].setAttribute("disabled", "true");
            }
        }
    });
}

//By clicking this btn you start a new game. This operation could be done in tons of other ways. This is the fastest (but maybe not the most correct).
newGame.addEventListener("click", function () {
    location.reload();
});


