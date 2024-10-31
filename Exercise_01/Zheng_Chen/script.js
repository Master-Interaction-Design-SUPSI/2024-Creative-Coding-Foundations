// generate a random number to show when it's loading
let randomNumber = 0;

window.onload = function() {
    generateRandomNumber();
    shuffleButtons();
};

// generate a random number from 0-10
function generateRandomNumber() {
    randomNumber = Math.floor(Math.random() * 11); 
    document.getElementById('random-number').textContent = `${randomNumber}`;
}

// shuffle the number buttons on the page, excluding 'send' and 'clear'
function shuffleButtons() {
    const keyboard = document.getElementById("keyboard");
    
    // Get all buttons excluding 'send' and 'clear'
    const buttonsArray = Array.from(keyboard.querySelectorAll("button:not(#button-send):not(#button-clear)"));
    
    // Shuffle the buttons array
    const shuffledButtons = buttonsArray.sort(() => Math.random() - 0.5);
    
    // Clear the keyboard, but preserve the 'send' and 'clear' buttons
    const sendButton = document.getElementById("button-send");
    const clearButton = document.getElementById("button-clear");
    
    // Remove all buttons from the keyboard temporarily
    keyboard.innerHTML = "";
    
    // Append the shuffled buttons back to the keyboard
    shuffledButtons.forEach(button => keyboard.appendChild(button));
    
    // Re-append the 'send' and 'clear' buttons at the end
    keyboard.appendChild(sendButton);
    keyboard.appendChild(clearButton);
}

// set user input
let userInput = "";

// get all button actions
const buttons = document.querySelectorAll("#keyboard button");

// add press action for all buttons
buttons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = button.textContent;
        if (button.id === "button-send") {
            checkAnswer();
        } else if (button.id === "button-clear") {
            clearInput();
        } else if (userInput === "") {
            // Limit to one character at a time
            userInput = buttonText;
            document.getElementById('output').textContent = userInput;
        }
    });
});

// clear up all user input
function clearInput() {
    userInput = "";
    document.getElementById('output').textContent = "Press and send your answer...";
}

// check the corresponding results
function checkAnswer() {
    const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    const correctAnswer = chineseNumbers[randomNumber];

    if (userInput === correctAnswer) {
        // show the text and gif if correct
        document.getElementById('output').innerHTML = `
            🎉Correct! 答对了！！！<br>
            <img src="assets/1.gif" alt="Correct!" style="max-width: 30%; height: auto; margin-bottom: 10%; ">
        `;
    } else {
        // show the text and gif if incorrect
        document.getElementById('output').innerHTML = `
        Incorrect! 继续学习吧！<br>
        <img src="assets/2.gif" alt="Incorrect!" style="max-width: 50%; height: auto; margin-bottom: 10%; ">
        `;
    }

    // Clear user input and regenerate a new random number
    userInput = "";
    generateRandomNumber();
}
