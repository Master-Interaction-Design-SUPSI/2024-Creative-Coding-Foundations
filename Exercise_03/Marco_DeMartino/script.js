const board = document.getElementById("board");
const arrayTraps = Array.from({ length: 144 }, () => Math.random() < 0.3);
arrayTraps[0] = false;
arrayTraps[143] = false;
console.log(arrayTraps);
const victory = document.getElementById("victory");
victory.style.left = "330px";
victory.style.top = "330px";
const restartButton = document.getElementById("restart");
const restartButton2 = document.getElementById("restart2");
const gameOverOverlay = document.getElementById("game-over");
const gameOverOverlayLost = document.getElementById("game-over-lost");

restartButton.addEventListener("click", () => {
  location.reload();
});

restartButton2.addEventListener("click", () => {
  location.reload();
});

const trapMap = {};

arrayTraps.forEach((value, index) => {
  if (value === true) {
    const trapDiv = document.createElement("div");
    trapDiv.classList.add("trap", "inactive");

    board.appendChild(trapDiv);

    const leftPosition = Math.floor(index % 12) * 30;

    const topPosition = Math.floor(index / 12) * 30;

    trapDiv.style.left = `${leftPosition}px`;
    trapDiv.style.top = `${topPosition}px`;

    trapMap[index] = trapDiv;
  }
});

const player = document.getElementById("player");
let currentPosition = 0;

let playerX = 0;
let playerY = 0;

let width = window.getComputedStyle(player).getPropertyValue("width");
let direction = "right";

console.log(width);
console.log(playerX);

console.log(arrayTraps);

function gameWin() {
  console.log("Reset");
  currentPosition = 0;
  playerX = 0;
  playerY = 0;
  gameOverOverlay.style.display = "flex";
}

function gameLose() {
  console.log("Reset");
  currentPosition = 0;
  playerX = 0;
  playerY = 0;
  gameOverOverlayLost.style.display = "flex";
}

function checkStatus() {
  console.log(currentPosition);

  if (currentPosition >= arrayTraps.length - 1) {
    console.log("You win!");
    gameWin();
  } else {
    if (arrayTraps[currentPosition] == false) {
      console.log("Safe!");
    } else {
      console.log("Dead!");
      gameLose();
    }
  }
}

function attack() {
  let targetPosition;

  switch (direction) {
    case "right":
      targetPosition = currentPosition + 1;
      break;
    case "left":
      targetPosition = currentPosition - 1;
      break;
    case "up":
      targetPosition = currentPosition - 12;
      break;
    case "down":
      targetPosition = currentPosition + 12;
      break;
  }
  if (arrayTraps[targetPosition] === true) {
    arrayTraps[targetPosition] = false;

    if (trapMap[targetPosition]) {
      trapMap[targetPosition].remove();
      delete trapMap[targetPosition];
    }
    console.log("Trap neutralized at position:", targetPosition);
  }
}

document.addEventListener("keydown", (keyEvent) => {
  const step = parseInt(width, 10);

  const boardWidth = board.offsetWidth;
  const boardHeight = board.offsetHeight;

  switch (keyEvent.key) {
    case " ":
      console.log("attack");
      /*const nextPosition = currentPosition + 1;
      if (arrayTraps[nextPosition] === true) {
        arrayTraps[nextPosition] = false;

        if (trapMap[nextPosition]) {
          trapMap[nextPosition].remove();
          delete trapMap[nextPosition];
        }
      }*/
      attack();
      checkStatus();
      break;
    case "ArrowRight":
      if (playerX + step < boardWidth) {
        console.log("step by " + step);
        currentPosition++;
        playerX += step;
        player.style.backgroundImage = "url(./imgs/player@300x.png";
        player.style.transform = "scaleX(1)";
        direction = "right";
      }
      checkStatus();
      break;
    case "ArrowLeft":
      if (playerX - step >= 0) {
        currentPosition--;
        playerX -= step;
        player.style.backgroundImage = "url(./imgs/player@300x.png";
        player.style.transform = "scaleX(-1)";
        direction = "left";
      }
      checkStatus();
      break;
    case "ArrowUp":
      if (playerY - step >= 0) {
        currentPosition -= 12;
        playerY -= step;
        player.style.backgroundImage = "url(./imgs/playerBack@300x.png";
      }
      direction = "up";
      checkStatus();
      break;
    case "ArrowDown":
      if (playerY + step < boardHeight) {
        currentPosition += 12;
        playerY += step;
        player.style.backgroundImage = "url(./imgs/playerFront@300x.png";
      }
      direction = "down";
      checkStatus();
      break;
  }

  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
});
