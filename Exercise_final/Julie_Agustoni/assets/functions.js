//THIS FILE IS TO STORE THE ALL MY FUNCTION FOR A CLEANER MAIN JS FILE

const MISSION_COUNT_SUCCESS = document.getElementById("mission-success-count");
const MISSION_COUNT_FAIL = document.getElementById("mission-fail-count");
const OUTPUT_QUOTE = document.getElementById("quote");
const CONTAINER_MISSION = document.getElementById("container-mission");
let countSuccess = 0;
let countFail = 0;
let quote = [];

export  function getRandomIndex(arrayLength) {
  return Math.floor(Math.random() * arrayLength);
}

export function countingFail() {
  countFail += 1;
  MISSION_COUNT_FAIL.innerText = countFail;
}

export function countingSuccess() {
  countSuccess += 1;
  MISSION_COUNT_SUCCESS.innerText = countSuccess;
}


export function display_error(error) {
  console.error("Error:", error);
  CONTAINER_CHARACTER.innerHTML = "data are not available";
}

export function display_quotes(data_quotes) {
  let randomIndex = getRandomIndex(data_quotes.length);
  quote = data_quotes[randomIndex];

  OUTPUT_QUOTE.innerHTML = `
      <div>
        "${quote.quote}"<br>
        - ${quote.by} -<br>
      </div>`;
}

export function addMissionHTML(data_mission, missionId) {
  let output = "<div>"; // begin the unordered list
  //Get the mission at the specified index missionId
  let mission = data_mission[missionId];
  console.log(mission.Requirement)
  output += `
          <h3>${mission.Title}</h3><br>
          ID =${mission.ID}<br>
          ${mission.Description}<br>
    `;

  output += "</div>"; //end the unordered list important not to forget

  CONTAINER_MISSION.innerHTML = output;
}

export function animation(animationImages) {
 
  let index = 0;

  let imgElement = OUTPUT_QUOTE.querySelector("img");
  if (!imgElement) {
    imgElement = document.createElement("img");
    OUTPUT_QUOTE.innerHTML = "";
    OUTPUT_QUOTE.appendChild(imgElement);
  }

  // display images with delays 
  function showNextAnimationImage() {
    if (index < animationImages.length) {
      imgElement.src = animationImages[index];
      index++;
      setTimeout(showNextAnimationImage, 1500); // Delay of 1000ms between index
    } else {
      setTimeout(function() {
        OUTPUT_QUOTE.innerHTML = ""; 
      }, 500); // Short pause before clearing
    }
  }
  showNextAnimationImage(); 
}
