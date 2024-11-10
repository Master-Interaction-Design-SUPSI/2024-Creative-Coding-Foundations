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