import {
  getRandomIndex,
  countingFail,
  countingSuccess,
  display_error,
  display_quotes,
  addMissionHTML,
  animation,
} from "./functions.js";

const CONTAINER_CHARACTER = document.getElementById("container-character");
const CREW_NAMES = document.getElementById("crew-names");
const CREW_ABILITIES = document.getElementById("crew-abilities");
const BUTTON_NEXT_MISSION = document.getElementById("button-next-mission");
const BUTTON_CONFIRM = document.getElementById("button-confirm");
const BUTTON_QUOTE = document.getElementById("button-quotes");
const MISSION_STATUS = document.getElementById("mission-status");
const MISSING_ABILITIES = document.getElementById("missing-abilities");

const DATABASE_MISSION = "assets/data_mission.json";
const DATABASE_CHARACTER = "https://finalspaceapi.com/api/v0/character";
const DATABASE_QUOTES = "https://finalspaceapi.com/api/v0/quote/";

let missionId = 0;
let mission_requirements = [];
let data_mission = [];
let data_quotes = [];
let data_characters = [];
let quote = [];
let quoteIndex = 0;
let selectedAbilities = []; // Array to store the abilities of selected characters
let selectedCharacters = []; //keep track of selected character

const animations = [
  {
    type: "fail",
    images: [
      "assets/FinalSpace_animationFail_0.png",
      "assets/FinalSpace_animationFail_1.png",
      "assets/FinalSpace_animationFail_2.png",
      "assets/FinalSpace_animationFail_3.png",
    ],
  },
  {
    type: "win",
    images: [
      "assets/FinalSpace_animationWin_0.png",
      "assets/FinalSpace_animationWin_1.png",
      "assets/FinalSpace_animationWin_2.png",
      "assets/FinalSpace_animationWin_3.png",
      "assets/FinalSpace_animationWin_4.png",
      "assets/FinalSpace_animationWin_5.png",
      "assets/FinalSpace_animationWin_6.png",
      "assets/FinalSpace_animationWin_7.png",
    ],
  },
];

//MISSION
fetch(DATABASE_MISSION)
  .then((response) => response.json())
  .then((data) => {
    data_mission = data;
    mission_requirements = data[missionId].Requirement;
    display_mission(data_mission, missionId);
  })
  .catch((error) => display_error(error));

//CHARACTER
fetch(DATABASE_CHARACTER)
  .then((response) => response.json())
  .then((data) => {
    data_characters = data;
    display_characters(data_characters);
  })
  .catch((error) => display_error(error));

//QUOTES
fetch(DATABASE_QUOTES)
  .then((response) => response.json())
  .then((data) => {
    data_quotes = data;
    quote = data[quoteIndex].quote;
  })
  .catch((error) => display_error(error));

BUTTON_QUOTE.addEventListener("click", () => {
  display_quotes(data_quotes);
});

BUTTON_CONFIRM.addEventListener("click", () => {
  //the selectedAbilities array i need to compare with mission_requirements
  let commonAbilities = selectedAbilities.filter((c) =>
    mission_requirements.includes(c)
  );
  let missingAbilities = mission_requirements.filter(
    (c) => !selectedAbilities.includes(c)
  );
  //here i check if the mission is a success
  let missionStatus = missingAbilities.length === 0;
  MISSING_ABILITIES.innerHTML = "";

  if (missionStatus) {
    MISSION_STATUS.style.color = "green";
    MISSION_STATUS.innerText = "you won";
    countingSuccess();
    animation(animations[1].images);
  } else {
    MISSION_STATUS.style.color = "red";
    MISSION_STATUS.innerText = "you lose";
    MISSING_ABILITIES.innerHTML =
      "The crew is missing those abilities for the mission to be a success : " +
      missingAbilities;
    countingFail();
    animation(animations[0].images);
  }
});

BUTTON_NEXT_MISSION.addEventListener("click", () => {
  if (MISSION_STATUS.style.color === "green") {
    console.log("i click the next button mission");
    missionId++;

    if (missionId >= data_mission.length) {
      alert("No more missions available! You've completed all missions.");
      BUTTON_NEXT_MISSION.disabled = true;

      return; // Stop further execution
    }

    // Update mission requirements and display the next mission
    mission_requirements = data_mission[missionId].Requirement;
    console.log("Mission ID:", missionId);
    display_mission(data_mission, missionId);
    console.log("Mission Requirements:", mission_requirements);
    CONTAINER_CHARACTER.innerHTML = "";
    display_characters(data_characters);
    MISSION_STATUS.innerText = "";
    MISSION_STATUS.style.color = "blueviolet";
    CREW_NAMES.innerHTML = "";
    CREW_ABILITIES.innerHTML = "";
  } else {
    alert("we need to complete the mission");
  }
});

function display_mission(data_mission, missionId) {
  if (missionId < 0 || missionId >= data_mission.length) {
    // Check if the index missionId is valid
    console.log("invalid mission ID");
    return;
  }
  addMissionHTML(data_mission, missionId);
}

function display_characters(data_characters) {
  //Filter out the ones that do not have a abilities
  let charactersWithAbilities = data_characters.filter(
    (c) => c.abilities.length > 0
  );

  let charsToBeDisplayed = []; //initialize an array of the characters we want to display

  //characters needed to win the game
  for (let ability of mission_requirements) {
    //filter the array of characters with abilities
    let charsWithThisAbility = charactersWithAbilities.filter((c) =>
      c.abilities.includes(ability)
    );

    let charNumber = 0; //select one or two character with this abilities
    if (charsWithThisAbility.length > 1) {
      charNumber = Math.random() > 0.5 ? 1 : 2;
    } else {
      charNumber = 1;
    }
    //store these indexes
    let selectionIndexes = getSelectionIndexes(
      charNumber,
      charsWithThisAbility
    );
    //select the characters and add them to the selection of characters we will be displaying
    for (let index of selectionIndexes) {
      charsToBeDisplayed.push(charsWithThisAbility[index]);
    }
  }

  //build an array with their ids (object property and not their index within the array)
  let charsWith = [];
  for (let character of charsToBeDisplayed) {
    //we need to prevent adding element that are already in the list
    if (!charsWith.includes(character.id)) {
      charsWith.push(character.id);
    }
  }
  console.log("This is the id of the character needed to win : " + charsWith);

  let charactersWithAbilitiesID = [];
  for (let character of charactersWithAbilities) {
    charactersWithAbilitiesID.push(character.id);
  }

  //what if i filter out the charactersWithAbilitiesID out of the charactersWithAbilities
  charactersWithAbilities = charactersWithAbilities.filter(
    (character) => !charsWith.includes(character.id)
  );
  console.log(charsWith);

  const charactersWithAbilitiesId = charactersWithAbilities.map((d) => d.id);
  console.log(charactersWithAbilitiesId);

  // Generate a list of 16 random characters
  let randomCharacterID = [];
  while (randomCharacterID.length + charsWith.length < 16) {
    // Get a random index from charactersWithAbilitiesID
    let randomIndex = getRandomIndex(charactersWithAbilitiesID.length);
    let randomCharacterId = charactersWithAbilitiesID[randomIndex];

    // Prevent duplicates in randomCharacterID
    if (
      !randomCharacterID.includes(randomCharacterId) &&
      !charsWith.includes(randomCharacterId)
    ) {
      randomCharacterID.push(randomCharacterId);
    }
  }
  console.log(randomCharacterID);

  let charsToChooseFrom = charsWith.concat(randomCharacterID); //Put the two array together

  //mix up the order of the element
  charsToChooseFrom.sort(() => Math.random() - 0.5);
  console.log(
    "this is the id of the character that will be display in a random way : " +
      charsToChooseFrom
  );
  //adjustment: ID start from 1 and the index in array start from 0
  for (let i = 0; i < charsToChooseFrom.length; i++) {
    charsToChooseFrom[i] -= 1;
  }
  console.log(
    "this is the index of the character that will be display in a random way : " +
      charsToChooseFrom
  );

  // Now we display the character
  for (let i = 0; i < charsToChooseFrom.length; i++) {
    let index = charsToChooseFrom[i];
    let character = data_characters[index];

    // Create the main container div for the character
    let characterDiv = document.createElement("div");
    characterDiv.className = "character";
    characterDiv.id = character.ID;

    // Add inner content dynamically
    characterDiv.innerHTML = `
    <img class="character-img" src="${character.img_url}"><br>
    Id: ${character.id}; <br>
    Name: ${character.name},<br>
    Species: ${character.species},<br>
    Origin: ${character.origin},<br>
    Abilities: <strong>${
      Array.isArray(character.abilities) && character.abilities.length > 0
        ? character.abilities.join(", ")
        : "None"
    } </strong><br>    
  `;
   
    // Add event listener to the created div
    characterDiv.addEventListener("click", function () {
      //console.log(`You clicked on this character: ${character.id}`);

      if (selectedCharacters.length < 4) {
        //make sure that the selected array is under 4 characters
        //check if the background is already blue so already checked
        if (characterDiv.style.background === "blue") {
          // Change color to black and remove from selectedCharacters array
          RemoveCharacter(characterDiv, selectedCharacters, character);
        } else {
          //Change background to blue when it selected and add it to the selectedAbilities
          
          AddCharacter(characterDiv, selectedCharacters, character);
          return selectedAbilities;
        }
      } else {
        alert("we can only select 4");
          characterDiv.classList.remove("selected");

        RemoveCharacter(characterDiv, selectedCharacters, character);
      }
    });

    CONTAINER_CHARACTER.appendChild(characterDiv);
  }

  function getSelectionIndexes(charNumber, charsWithThisAbility) {
    let selectionIndexes = [];
    //now i generate as many random indexes as the amount of characters i need to pick
    for (let i = 0; i < charNumber; i++) {
      let randomIndex = Math.floor(Math.random() * charsWithThisAbility.length);
      selectionIndexes.push(randomIndex);
    }
    return selectionIndexes;
  }
}

function AddCharacter(characterDiv, selectedCharacters, character) {
  characterDiv.style.background = "blue";

  // Add character's ID to the selectedCharacters array
  selectedCharacters.push(character.id);

  // Add abilities to the selectedAbilities array (if they aren't already added)
  if (Array.isArray(character.abilities) && character.abilities.length > 0) {
    selectedAbilities.push(...character.abilities); // Spread operator to add multiple abilities
  } else {
    selectedAbilities.push("None"); // Add "None" if no abilities
  }

  // Display the character's name and abilities
  CREW_NAMES.innerHTML += `${character.name}<br>`;
  CREW_ABILITIES.innerHTML += `${
    character.abilities.length > 0 ? character.abilities.join(", ") : "None"
  } <br>`;
}

function RemoveCharacter(characterDiv, selectedCharacters, character) {
  characterDiv.style.background = "black";
  

  // Find the index of the character in the selectedCharacters array
  let index = selectedCharacters.indexOf(character.id);

  // If the character is in the array, remove it
  if (index !== -1) {
    selectedCharacters.splice(index, 1);

    // Remove the character's name from the CREW_NAMES element
    CREW_NAMES.innerHTML = CREW_NAMES.innerHTML.replace(
      `${character.name}<br>`,
      ""
    );

    // Remove the character's abilities from the CREW_ABILITIES element
    CREW_ABILITIES.innerHTML = CREW_ABILITIES.innerHTML.replace(
      `${
        character.abilities.length > 0 ? character.abilities.join(", ") : "None"
      } <br>`,
      ""
    );

    // Remove abilities from the selectedAbilities array
    if (Array.isArray(character.abilities) && character.abilities.length > 0) {
      character.abilities.forEach((ability) => {
        const abilityIndex = selectedAbilities.indexOf(ability);
        if (abilityIndex !== -1) {
          selectedAbilities.splice(abilityIndex, 1);
        }
      });
    } else {
      // If the character had "None" for abilities, remove it from the array
      const noneIndex = selectedAbilities.indexOf("None");
      if (noneIndex !== -1) {
        selectedAbilities.splice(noneIndex, 1);
      }
    }
  }
  console.log("Updated Selected Abilities: ", selectedAbilities); // See updated abilities array
}
