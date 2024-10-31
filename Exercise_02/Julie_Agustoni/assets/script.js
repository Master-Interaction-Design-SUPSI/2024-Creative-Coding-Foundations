const BUTTON_ADD = document.getElementById("button-add");
const BUTTON_CLEAR = document.getElementById("button-clear");
const CONTAINER = document.getElementById("container");
const BUTTON_REWARD = document.getElementById("button-reward");
const BUTTON_RESTORE_STAMINA = document.getElementById(
  "button-restore-stamina"
);
const TEXT_INPUT = document.getElementById("text-input");
const XP_OUTPUT = document.getElementById("output-xp");
const STAMINA_OUTPUT = document.getElementById("output-stamina");
const NUMBER_TASK_DONE = document.getElementById("output-number-task-done");
const XP_INPUT = document.getElementById("XP-input");
const STAMINA_INPUT = document.getElementById("stamina-input");
const LEVEL_OUTPUT = document.getElementById("output-level");
let xp = 0;
let stamina = 100;
let level = 0;

let taskList = [];
let checkboxes = [];
//here we keep track of checkboxes to which we already addedd event listeners so that we avoid adding too many
let checkboxesWithEventListeners = [];

//add the input of the user relativ to a task in a list so i can access it later
function addTaskToList(user_input, user_XP_input, user_stamina_input) {
  taskList.push([
    user_input,
    parseInt(user_XP_input),
    parseInt(user_stamina_input),
  ]);
  console.log(taskList);
}

function addXP(TASK_INDEX) {
  let taskXp = taskList[TASK_INDEX][1]; // Access element in the list
  return (xp += taskXp);
}

function levelUp() {
  return (level += 1);
}

function substractStamina(TASK_INDEX) {
  let taskStamina = taskList[TASK_INDEX][2];
  return (stamina -= taskStamina);
}

//function that count how many time the add-button has been press
let click_count = 0;
function handleButtonClick() {
  click_count++; // Increment the counter on each click
}

//function that count how many time a checkbox has been has been press
let click_count_checkbox = 0;
function handleCheckbox() {
  click_count_checkbox++;
}

//add a task
BUTTON_ADD.addEventListener("click", () => {
  let user_input = TEXT_INPUT.value;
  let user_XP_input = XP_INPUT.value;
  let user_stamina_input = STAMINA_INPUT.value;

  if (user_input === "" || user_XP_input === "" || user_stamina_input === "") {
    alert("Please fill in all the fields");
    return;
  }

  addTaskToList(user_input, user_XP_input, user_stamina_input); //call the function that add those parameter to the list so i can access them later

  handleButtonClick(); //call the function that add to the clickcount

  const BLOCK = document.createElement("li");
  BLOCK.textContent =
    user_input + "\r\n" + user_XP_input + " / " + user_stamina_input + " ";
  BLOCK.innerHTML += `<input type="checkbox" id="task-${click_count}">`;
  BLOCK.classList.add("task");
  CONTAINER.appendChild(BLOCK);

  checkboxes = document.querySelectorAll('input[type="checkbox"]');

  //action when click on a checkbox
  for (let checkbox of checkboxes) {
    //here we check if the checkbox we are looking at in this iteration is in our list of checkboxes to which we already added event listners
    if (checkboxesWithEventListeners.includes(checkbox.id)) {
      console.log(checkboxesWithEventListeners);
      console.log(checkbox.id);
      // if it is in the list we skip to the next item in the list
      continue;
    } else {
      //we attach the event listener to the current checkbox
      checkbox.addEventListener("click", () => {
        // Disable the checkbox once checked
        if (checkbox.checked) {
          checkbox.disabled = true;
        }

        //Call the function that adds the number of times a checkbox has been clicked
        handleCheckbox();

        //Update the display of the number of tasks done
        NUMBER_TASK_DONE.textContent = click_count_checkbox;

        //Access the task number using the checkbox's ID
        let CHECKBOX_ID = checkbox.id;
        let TASK_INDEX = parseInt(CHECKBOX_ID.split("-")[1]) - 1; // split to get the number and convert to decimal number and subtract 1

        //Update the XP
        XP_OUTPUT.textContent = addXP(TASK_INDEX);
        if (XP_OUTPUT.textContent > 100) {
          alert("you level up");
          levelUp();
          LEVEL_OUTPUT.textContent = level;
          xp = 0;
          BUTTON_REWARD.style.background = "darkblue";
        }

        //Update the STAMINA
        STAMINA_OUTPUT.textContent = substractStamina(TASK_INDEX);
        if (STAMINA_OUTPUT.textContent < 0) {
          alert("go take a nap !!!!");
          STAMINA_OUTPUT.style.color = "red";
        }

        //Update the XP progress bar
        const XP_PROGRESS_BAR = document.getElementById("XP-progress-fill");
        let XP_PROGRESS_BAR_PERSENTAGE = XP_OUTPUT.textContent;
        if (XP_OUTPUT.textContent > 100) {
          XP_PROGRESS_BAR_PERSENTAGE = 100;
          XP_OUTPUT.textContent = 0;
        }
        XP_PROGRESS_BAR.style.width = XP_PROGRESS_BAR_PERSENTAGE + "%";
      });

      //once we have added the event listener, we add the checkbox id to the list of checkboxes with event listeners so we can skip it next time
      checkboxesWithEventListeners.push(checkbox.id);
    }
  }
});

BUTTON_REWARD.addEventListener("click", () => {
  if (BUTTON_REWARD.style.background == "darkblue") {
    let rewardList = [
      "Get a cookie",
      "Play Stardew",
      "Go for a walk",
      "Go watch an episode",
    ];
    let randomReward = Math.floor(Math.random() * rewardList.length);
    alert("Your reward is : " + rewardList[randomReward]);
    BUTTON_REWARD.style.background = "#25003d";
  } else {
    alert("You need to complete more task");
  }
});

BUTTON_CLEAR.addEventListener("click", () => {
  console.log("button-clear");
  const ELEMENTS = document.getElementById("container");
  ELEMENTS.innerHTML = " ";
});

BUTTON_RESTORE_STAMINA.addEventListener("click", () => {
  stamina = 100;
  STAMINA_OUTPUT.textContent = stamina;
  STAMINA_OUTPUT.style.color = "blueviolet";
});
