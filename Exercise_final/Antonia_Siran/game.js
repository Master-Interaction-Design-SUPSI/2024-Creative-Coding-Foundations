document.addEventListener("DOMContentLoaded", function() {
  const startButton = document.getElementById("start-button");
  const welcomePopup = document.getElementById("welcome-popup");
  const selectionPopup = document.getElementById("selection-popup");
  const backgroundOptions = document.querySelectorAll(".background-option");
  const characterOptions = document.querySelectorAll(".character-option");
  const gameCanvas = document.getElementById("game-canvas");
  const ctx = gameCanvas.getContext("2d");
  const score = document.getElementById("score");
  const losePopup = document.getElementById('lose-popup');
  const retryButton = document.getElementById("retry-button");
  let animationFrameId = null; 
  let gameActive = true; 
  const backgroundMusic = document.getElementById("background-music");


  window.addEventListener("click", () => {
    backgroundMusic.muted = false;
  });
  

  function showLosePopup() {
    cancelAnimationFrame(animationFrameId)
    selectedCharacter = null
    selectedBackground = null
    gameActive = false; // Stop the game loop 
    losePopup.style.display = "flex"; 
    gameCanvas.style.display = "none"; 
}


    // Function to Reset Game State
    function resetGameState() { 
        // Reset character position and velocity
        character.x = gameCanvas.width / 2 - 30;
        character.y = gameCanvas.height - 110;
        character.vy = 0;
        character.vx = 0;

        // Reset background position
        bgY = 0;

        // Reset platforms
        generateInitialPlatforms();
        generatePlatforms();

        // Reset score
        score.innerHTML = `<img src="assets/Score/Score-star.png" id="star"/> Score: 0`;

        
        gameActive = true;
    }


  let selectedBackground = null;
  let selectedCharacter = null;
  let platforms = [];
  let character = {
      x: gameCanvas.width / 2 - 30,
      y: gameCanvas.height - 110,
      width: 60,
      height: 100,
      vy: 0,
      imageStay: null,
      imageJump: null,
      vx: 0
  };

  let bgY = 0; // Y position for background scrolling


  startButton.addEventListener("click", () => {
      welcomePopup.style.display = "none";
      selectionPopup.style.display = "flex";
  });


  retryButton.addEventListener("click",()=>{
    losePopup.style.display = "none";
    selectionPopup.style.display = "flex";
    gameCanvas.style.display = "none";
    backgroundOptions.forEach(opt => opt.classList.remove("selected"));
    characterOptions.forEach(opt => opt.classList.remove("selected"));
  })


  backgroundOptions.forEach(option => {
      option.addEventListener("click", () => {
          backgroundOptions.forEach(opt => opt.classList.remove("selected"));
          option.classList.add("selected");
          selectedBackground = {
              start: option.dataset.startBg,
              continue: option.dataset.continueBg
          };
          checkSelections();
      });
  });


  characterOptions.forEach(option => {
      option.addEventListener("click", () => {
          characterOptions.forEach(opt => opt.classList.remove("selected"));
          option.classList.add("selected");
          selectedCharacter = {
              stay: option.dataset.stayImg,
              jump: option.dataset.jumpImg
          };
          checkSelections();
      });
  });


  function checkSelections() {
      if (selectedBackground && selectedCharacter) {
           startGame();
      }
  }


  class Platform {
      constructor(x, y, width, height, type) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.type = type;
          this.image = new Image();
          const bgType = getBackgroundType(selectedBackground.start);
          this.image.src = `assets/Platforms/${bgType}-${this.type}.png`;
      }

      draw() {
          if (this.image.complete) {
              ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
          }
      }
  }


  function getBackgroundType(startBgPath) {
      if (startBgPath.includes("Beach")) return "beach";
      if (startBgPath.includes("Desert")) return "desert";
      if (startBgPath.includes("Farm")) return "farm";
      if (startBgPath.includes("Forest")) return "forest";
      return "forest"; // default
  }

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  function generateInitialPlatforms() {
    platforms = [];
    const platformWidth = 80;
    const platformHeight = 20;
    const platformGap = 5; // Gap between platforms
    const startY = gameCanvas.height - platformHeight; // Start at the very bottom


    for (let x = 0; x < gameCanvas.width; x += platformWidth + platformGap) {
        // Ensure the last platform fits within canvas bounds
        let width = (x + platformWidth > gameCanvas.width) ? gameCanvas.width - x : platformWidth;
        
        platforms.push(new Platform(
            x,
            startY,
            width,
            platformHeight,
            'normal'  // All initial platforms are normal
        ));
    }
    return platforms
}


  function generatePlatforms() {
      platforms = generateInitialPlatforms();
      const platformWidth = 80;
      const platformHeight = 20;
      const maxY = gameCanvas.height;

      while (platforms.length < 20) {
          let x = getRandomInt(0, gameCanvas.width - platformWidth);
          let y = getRandomInt(0, maxY);

          if (platforms.length === 0) {
              y = maxY - platformHeight;
          }

          let type = Math.random() < 1 ? 'normal' : 'trap';
          platforms.push(new Platform(x, y, platformWidth, platformHeight, type));
      }
  }


  function drawPlatforms() {
      platforms.forEach(platform => platform.draw());
  }


  function drawCharacter() {
      let img = character.vy < 0 ? character.imageJump : character.imageStay;
      if (img.complete) ctx.drawImage(img, character.x, character.y, character.width, character.height);
  }


  const keys = {
      left: false,
      right: false,
      up: false
  };


  document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
      
  });

  document.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
      
  });


  function startGame() {
    resetGameState()
    selectionPopup.style.display = "none";
    gameCanvas.style.display = "block";

    const bgStart = new Image();
    const bgContinue = new Image();
    bgStart.src = selectedBackground.start;
    bgContinue.src = selectedBackground.continue;

    character.imageStay = new Image();
    character.imageStay.src = selectedCharacter.stay;

    character.imageJump = new Image();
    character.imageJump.src = selectedCharacter.jump;

    let imagesLoaded = 0;
    const totalImages = 4; // bgStart, bgContinue, characterStay, characterJump

    bgStart.onload = bgContinue.onload = character.imageStay.onload = character.imageJump.onload = () => {
        if (++imagesLoaded === totalImages) {
            generatePlatforms();
            gameLoop();
        }
    };



    function gameLoop() {
        if (!gameActive) return; // Stop the loop if the game is not active

        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw background
        for (let i = 0; i < bgY + gameCanvas.height; i += bgContinue.height) {
            ctx.drawImage(bgContinue, 0, -i - bgY + gameCanvas.height / 2, gameCanvas.width, bgContinue.height);
        }
        ctx.drawImage(bgStart, 0, gameCanvas.height - bgStart.height, gameCanvas.width, bgStart.height);

        // Update game state
        moveCharacter();
        handleCollisions();
        drawPlatforms();
        drawCharacter();

        animationFrameId = requestAnimationFrame(gameLoop);
    }
}



function moveCharacter() {
   
    if (keys.left) {
        character.vx = -10; 
    } else if (keys.right) {
        character.vx = 10; 
    } else {
        character.vx = 0; 
    }
    
    // Move the character horizontally
    character.x += character.vx;

    // Ensure the character stays within the game area
    if (character.x < 0) {
        character.x = 0;  // If character goes beyond left edge, set to 0
    } else if (character.x > gameCanvas.width - character.width) {
        character.x = gameCanvas.width - character.width;  // If character goes beyond right edge, set to maximum position
    }
    character.vy += 0.75; // Gravity
    character.y += character.vy;

    scrollWorld();

    if (character.y > gameCanvas.height) {
        showLosePopup() 
        return;
    }
}


// Adjust the position of the bg, platforms, character + score increase
function scrollWorld() {
  if (character.y < gameCanvas.height / 2) {
      let dy = gameCanvas.height / 2 - character.y;
      bgY += dy;  // Move background down
      score.innerHTML = `<img src="assets/Score/Score-star.png" id="star"/> Score: ${Math.floor(bgY / 100)}`
      platforms.forEach(platform => platform.y += dy);
      // Keep character at the midpoint
      character.y = gameCanvas.height / 2;
  }
}



//Collision Detection and Game Mechanics
function handleCollisions() {
  platforms.forEach(platform => {
      if (character.vy >= 0 && // // Check if character is moving downwards and within platform's horizontal boundaries
          character.x < platform.x + platform.width && 
          character.x + character.width > platform.x &&
          character.y + character.height >= platform.y &&
          character.y + character.height <= platform.y + platform.height) {
          if (platform.type === 'trap') {
            showLosePopup() 
          } else {

              character.y = platform.y - character.height; // Position character on top of the platform
              
              character.vy = -20; // Bounce height
             
          }
      }

      // Remove platforms that have moved off-screen and add new ones
      if (platform.y > gameCanvas.height) {
          platforms.splice(platforms.indexOf(platform), 1);
          let newPlatform = new Platform(getRandomInt(0, gameCanvas.width - 80), 20, 80, 20, Math.random() < 0. ? 'normal' : 'trap');
          platforms.push(newPlatform);
      }
  });
}
});

