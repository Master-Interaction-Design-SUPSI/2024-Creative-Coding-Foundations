const SHOWS = '/assets/showsGame.json';
let posters = [];
let currentCorrectAnswer = "";
const hintBox = document.getElementById('hint-box');
const difficultyDisplay = document.getElementById('difficulty-display');

// fetching show data
let data = {};

fetch(SHOWS)
  .then(response => response.json())
  .then(fetchedData => {
    data = fetchedData;  // store the fetched data globally
    //console.log('Fetched data:', data);
  })
  .catch(error => {
    console.error('Error fetching posters:', error);
  });




// canvas
const canvas = document.getElementById('canvas');
canvas.willReadFrequently = true; // added for optimization - it is used before getting the context - because the pixelation is hard and there are multiple requests
const ctx = canvas.getContext('2d');



// fetching posters from the json array - the image url has index 0
fetch(SHOWS)
  .then(response => response.json())
  .then(data => {
    for (const showName in data) {
      const show = data[showName];
      const posterUrl = show[0]; // the posters have index 0 in the arrays
      posters.push(posterUrl);
    }
    //console.log(posters);
    displayRandomPoster(data); // to be able to access the data of the poster
  })
  .catch(error => {
    console.error('Error fetching posters:', error);
  });


// displaying the pixelated posters in canvas
function displayRandomPoster(data) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  currentDifficulty = 'hard'; // getting back to default mode

  if (posters.length === 0) {
    console.error("No posters");
    return;
  }

  const randomIndex = Math.floor(Math.random() * posters.length);  // randomizer 
  const posterLink = posters[randomIndex];

  // saving the correct answer by finding the show name with the same random index used for the poster
  let correctAnswer = "";
  let index = 0;
  for (const showName in data) {
    if (index === randomIndex) {
      correctAnswer = showName;  // Store the show name when we reach the randomIndex
      break; // stop when the answer is found
    }
    index++;
  }

  currentCorrectAnswer = correctAnswer; // Update the global variable
  displayOptions(correctAnswer, data);

  //console.log(posterLink);
  //console.log(correctAnswer);

  let img = new Image();
  img.crossOrigin = 'Anonymous'; // to not have cors issues

  img.onload = function() {  // waits until we for sure have the image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    displayOptions(correctAnswer, data); // call function to display random options
    pixelImage();
  };

  img.onerror = function() {
    console.error(`Error loading image: ${posterUrl}`);  // Handle the error
  };

  difficultyDisplay.innerHTML = `Level ${currentDifficulty} - ${points} point(s)`;
  hintBox.style.display = "none";
  img.src = posterLink;
}

const percentage = 7; // percentage for the hard level - default mode
const pixelSize = Math.floor(canvas.width * (percentage / 100));
//console.log(pixelSize)



// Function to pixelate the poster
function pixelImage() {

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // console.log(imageData)
  const iData = imageData.data;

  for (let y = 0; y < canvas.height; y += pixelSize) {
    for (let x = 0; x < canvas.width; x += pixelSize) {
      const index = (y * canvas.width + x) * 4;
      const r = iData[index];
      const g = iData[index + 1];
      const b = iData[index + 2];
      const a = iData[index + 3];

      // apply pixelation
      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          const pixelIndex = ((y + dy) * canvas.width + (x + dx)) * 4;
          if (y + dy < canvas.height && x + dx < canvas.width) {
            iData[pixelIndex] = r;
            iData[pixelIndex + 1] = g;
            iData[pixelIndex + 2] = b;
            iData[pixelIndex + 3] = a;
          }
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0); // Update the canvas with pixelated image
}


// function to display random options for guessing
function displayOptions(correctAnswer, data) {


  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = ''; // to clear it every time
  
  //console.log(optionsContainer);
  
  // Create an array of possible options
  let options = [correctAnswer];
  
  // 3 incorrect answers
  const incorrectAnswers = Object.keys(data);

  // remove the correct answer from the incorrect answers list so it doesn't appear two times
  const index = incorrectAnswers.indexOf(correctAnswer);
  if (index !== -1) {
    incorrectAnswers.splice(index, 1);
  }

  // adding the incorrect answers to the options array
  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    const randomShow = incorrectAnswers[randomIndex];
    if (!options.includes(randomShow)) {
      options.push(randomShow);
    }
  }

  options = shuffleArray(options);


   // Create a button for each option
   options.forEach(option => {
    const optionButton = document.createElement('button');
    optionButton.textContent = option; // set the button text to the show name
    optionButton.onclick = function() {
      checkAnswer(option, correctAnswer);  // call checkAnswer when clicked
    };
    optionsContainer.appendChild(optionButton);  // Add button to the container
  });

  //console.log("Options added");
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


// checking if the answer is right
let score = 0;
let currentDifficulty = 'hard'; // starting difficulty
let difficultyChanged = false; // is the difficulty changed (because of the wrong answer)
let points = 3;


function checkAnswer(userChoice, correctAnswer) {
  const messageBox = document.getElementById('message-box');
  //console.log(messageBox);
  const scoreBox = document.getElementById('score-display'); // Display the score


  if (userChoice === correctAnswer) { // is the answer correct
  
  
    // add points
    score += points;

    // success message
    messageBox.innerHTML = `Correct! You earned ${points} point(s).`;
    messageBox.style.color = 'green';
    messageBox.style.display = "block";

    // show the current score
    scoreBox.innerHTML = `Score: ${score}`;

    // Reset difficulty back to "hard" for the next round
    difficultyChanged = false;
    currentDifficulty = 'hard';
    points = 3;

    // load a new random poster
    displayRandomPoster(data);

    
  } else {  // incorrect answers

    messageBox.innerHTML = "Oops! Wrong guess. Try again!";
    messageBox.style.color = 'red';
    messageBox.style.display = "block";

    lowerDifficulty();
  }
}


// function to lower difficulty
function lowerDifficulty() {
  if (currentDifficulty === 'hard') {
      currentDifficulty = 'medium';
      points = 2;
  } else if (currentDifficulty === 'medium') {
      currentDifficulty = 'easy';
      points = 1;
      displayHint();
  }

  
  difficultyDisplay.innerHTML = `Level ${currentDifficulty} - ${points} point(s)`;
  //console.log(difficultyDisplay);

  const messageBox = document.getElementById('message-box');
  messageBox.innerHTML += ` Level changed to ${currentDifficulty}.`;
  
}


// hints
function displayHint() {
  
  const hint = data[currentCorrectAnswer][1]

  hintBox.innerHTML = `Hint: ${hint}`; 
  hintBox.style.display = "block";  
}

// changing screens
document.addEventListener("DOMContentLoaded", function () {
  const firstScreen = document.getElementById("first-screen");
  const gameSection = document.getElementById("game-section");

  // press space - game screen
  document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        firstScreen.style.display = "none"; // welcome screen hidden
        gameSection.style.display = "block"; // game screen displayed
        startGame();
    }
});



let timeLeft = 119;
let timerInterval;
const timerDisplay = document.getElementById("timer");
const popup = document.getElementById("popup");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");

function startGame() {
  const scoreBox = document.getElementById('score-display'); 

  score = 0;
  scoreBox.innerHTML = `Score: ${score}`;
  timeLeft = 119; 
  displayRandomPoster(data);
  clearInterval(timerInterval); 
  updateScore(0);
  popup.style.display = "none"; 
  startTimer(); 
  //console.log("Game Started!");
}

function startTimer() {
  timerInterval = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showPopup();
    } else {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
      timeLeft--;
    }
  }, 1000); // update timer every second
}
//console.log(timeLeft)
// format times when it's single digit
function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function updateScore(newScore) {
  score = newScore;
  scoreDisplay.textContent = score;
}

function showPopup() {
  popup.style.display = "flex";
  scoreDisplay.textContent = score;
}

// closing the popup
function closePopup() {
  popup.style.display = "none";
}

function gameReset() {
  closePopup();
  startGame();
}

//restart button
restartButton.addEventListener("click", function () {
  gameReset();
});

})
