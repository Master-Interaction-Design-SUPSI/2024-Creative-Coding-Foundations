const OUTPUT_LEVEL = document.getElementById("output-level");
const OUTPUT_LIFE = document.getElementById("output-life");
const CHARACTER = document.getElementById("character");
let characterImg = document.getElementById("character-img");
let currentLevel = 0;
let currentLife = 5;
let characterImgId = 0;
let characterPosition = 0;
let currentPosition = -1; 
let arrayTraps = [true, false, true, false, false, true];

function newArray(length) {
  const arrayTraps = [];
  let previousValue = false; // Track the last value added

  for (let i = 0; i < length; i++) {
    // Determine the next value
    if (previousValue === true) {
      // If the last value was true, the next value must be false
      arrayTraps.push(false);
      previousValue = false;
    } else {
      // Randomly decide whether to add true or false
      const nextValue = Math.random() < 0.5;
      arrayTraps.push(nextValue);
      previousValue = nextValue;
    }
  }
  console.log("This is a random array: ", arrayTraps);
  return arrayTraps;
}

function updateCharacterImg() {
  characterImg.src = "assets/dino_run_0.png";
  characterImgId = characterImgId === 0 ? 1 : 0; // Toggle characterImgId between 0 and 1
  characterImg.src = `assets/dino_run_${characterImgId}.png`;
}

function gameReset() {
  console.log("Game reset");
  currentPosition = -1;
  characterPosition = 0;
  CHARACTER.style.left = characterPosition + "%";
  characterImg.src = "assets/dino_stationary.png";
}

function checkStatus() {
  console.log(currentPosition);
  if (currentPosition > arrayTraps.length - 1) {
    console.log("you win!");
    alert("You win");
    characterImg.src = `assets/dino_win.png`;
    currentLevel++;
    OUTPUT_LEVEL.textContent = currentLevel;
    OUTPUT_LIFE.innerText = 5;
    setTimeout(() => { //Delay a big the code so that the image appear for a short time
      gameReset();
    }, 1000);
    newArray(arrayTraps.length);
  } else {
    if (arrayTraps[currentPosition] == false) {
      console.log("no traps");
    } else {
      console.log("you die");
      alert("You die");

      characterImg.src = `assets/dino_lose.png`;
      currentLife--;
      OUTPUT_LIFE.innerText = currentLife;
      if (OUTPUT_LIFE.innerText < 0) {
        newArray(arrayTraps.length);
        OUTPUT_LIFE.innerText = 5;
      }
      setTimeout(() => {
        gameReset();
      }, 1000);
    }
  }
}

document.addEventListener("keydown", (keyEvent) => {
  switch (keyEvent.key) {
    case "ArrowUp":
      console.log("JUmp");
      currentPosition += 2;
      characterPosition += 25;
      CHARACTER.style.left = characterPosition + "%";
      updateCharacterImg();
      checkStatus();

      break;
    case "ArrowRight":
      console.log("Step");
      currentPosition++;
      characterPosition += 12.5;
      CHARACTER.style.left = characterPosition + "%";
      updateCharacterImg();
      checkStatus();
      break;
  }
});
