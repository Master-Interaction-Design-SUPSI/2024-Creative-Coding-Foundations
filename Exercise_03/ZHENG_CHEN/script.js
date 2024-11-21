/* UI events */
//when user pressed a key, the car move to the next div
//set initial hp is 100, 50% deduction for obstacles encountered
//if textbox is empty, ask user to fill something


console.log("/* keyboard press */");

document.addEventListener('keydown', (keyEvent) => {
    switch(keyEvent.key) {
        case 'w':
           console.log("up");
           break;
        case 's':
           console.log("down);
           break;
        case 'a':
           console.log("left-move")
           break;
        case 'd':
            console.log("right-move")
            break;
        default:
           console.log("No!!!")

    }
});


