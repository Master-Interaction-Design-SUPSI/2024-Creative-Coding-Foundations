


let playerPosition = 0;
const plankWidth = 3.9;
const playerStartX = 0; 


let planks = generateRandomPlanks(10); 


  function generateRandomPlanks(length) {
    const planks = [true]; // First plank safe

    for (let i = 1; i < length - 1; i++) {
      planks.push(Math.random() < 0.7); // 70/30% safe broken
    }

    planks.push(true); // Last plank safe
    return planks;
  }



function setupPlanks() {
  const plankContainer = document.getElementById('plank-container');
  
  plankContainer.innerHTML = ''; // Clear existing planks
  
  planks.forEach((isSafe, index) => {
    const plank = document.createElement('div');

    plank.classList.add('plank'); 
    plank.style.left = `${index * plankWidth}rem`;
    plankContainer.appendChild(plank);
  });
}



function moveForward() {
  if (playerPosition < planks.length - 1) {
    playerPosition++;
    checkPlank();
  }
}


function jump() {
  if (playerPosition < planks.length - 2) {
    playerPosition += 2;
    checkPlank();
  } else {
    alert("You can't jump that far!");
  }
}


function resetPlayer() {
  playerPosition = 0;
  
  document.getElementById('player').style.transform = `translateX(${playerStartX}rem)`;
  document.getElementById('move-forward').disabled = false;
  document.getElementById('jump').disabled = false;
  
  // setTimeout(() => alert("You fell! Try again."), 200);
}



function checkPlank() {
  const player = document.getElementById('player');
  
    player.style.transform = `translateX(${playerStartX + playerPosition * plankWidth}rem)`; // (Adjusting player position)


    if (playerPosition === planks.length - 1) {
      alert("🎉 Congratulations!!!! You've reached the Biscuit!🎉🎉🎉");
      document.getElementById('move-forward').disabled = true;
      document.getElementById('jump').disabled = true;
      return;
    }

    
    // if (!planks[playerPosition]) {
    //   resetPlayer();
    
    // Check if plaer is on the broken plank

    
  if (!planks[playerPosition]) {
    const plankContainer = document.getElementById('plank-container');
    const brokenPlank = plankContainer.children[playerPosition]; 
    
      brokenPlank.classList.add('falling');

    
    setTimeout(() => {
      resetPlayer();
      // Remove and reset position
      brokenPlank.classList.remove('falling');
      brokenPlank.style.transform = 'translateY(0)'; 
    }, 
    
    450); // (delays the animation)
  }
}



function restartGame() {
  planks = generateRandomPlanks(10); 
    setupPlanks();                     
    resetPlayer();                     
}



setupPlanks();



// buttonsss
    document.getElementById('move-forward').addEventListener('click', moveForward);

    document.getElementById('jump').addEventListener('click', jump);

    document.getElementById('restart-game').addEventListener('click', restartGame);



console.log("/* keybord press*/")

document.addEventListener('keydown', (keyEvent) => {
    console.log(keyEvent.key);

    switch(keyEvent.key) {
            case 'r':
            console.log("Reset")
            playerPosition = 0;
            checkPlank()
            break;

            case 'j':
            console.log("Jump!")
            playerPosition += 2;
            checkPlank()
            break;

            case 'f':
            console.log("Forward")
            playerPosition ++;
            checkPlank()
            break;

            case 'ArrowUp':
            console.log("Jump!")
            playerPosition += 2;
            checkPlank()
            break;

            case 'ArrowRight':
            console.log("Forward")
            playerPosition ++;
            checkPlank()
            break;

            case ' ':
            console.log("Jump!")
            playerPosition += 2;
            checkPlank()
            break;
    }


})