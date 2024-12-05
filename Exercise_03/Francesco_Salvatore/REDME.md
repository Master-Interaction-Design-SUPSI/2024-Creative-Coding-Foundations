# Project Title: Right Path Game

## Author: Francesco Salvatore


## Concept Description
The assignment is inspired to the Squid Games "Glass bridge game" where the player can jump forward-left or forward-right 

The mini-game is inspired by the "Glass Bridge" game from Squid Game, where players must choose whether to jump to the next tile on the right or left path. If the user lands on the correct tile, they are in a safe space and can continue progressing. However, if they land on the wrong tile, they will fall and lose the game. I designed this path using two mirrored arrays. The movement mechanics are as follows: pressing the right arrow key advances to the next tile in the right array, while pressing the left arrow key moves to the next step in the left array. This allows players to move horizontally along their current path or make diagonal jumps. The trap/safe area check has been adapted from the demo exercise develop in class and includes an implemented step counter that increments with each button press, along with rendering updates. Specifically, the CSS classes are called by the checkStep function, which monitors progress and determines victory or defeat. Whenever the player either completes the path or triggers a trap, the mini-game displays a pop-up before restarting.