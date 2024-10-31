const buttons = document.getElementsByClassName('letterButtons');
const spaceButton = document.querySelector('.letterButtonsSpace');
const outputParagraph = document.getElementById('Output');
let isCapsLockOn = false;

// Add click event listener for all letter buttons
Array.from(buttons).forEach(b => b.addEventListener('click', (e) => {
    handleButtonClick(e.target.innerText.toLowerCase());
}));

// Add click event listener for the space button
spaceButton.addEventListener('click', () => {
    handleButtonClick("space");
    spaceButton.classList.add('active'); // Highlight space button on click
    setTimeout(() => spaceButton.classList.remove('active'), 200); // Remove highlight after short delay
});

// Add keydown event listener for keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    let button;

    if (key === " ") {
        // Special handling for space key
        spaceButton.classList.add('active'); // Highlight space button
        handleButtonClick("space");
    } else {
        // General handling for all other keys
        button = Array.from(buttons).find(b => b.innerText.trim().toLowerCase() === key);
        if (button) {
            button.classList.add('active'); // Highlight the pressed key
            handleButtonClick(key); // Process the input
        }
    }
});

// Add keyup event listener to remove highlight
document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();

    if (key === " ") {
        // Special handling for space key
        spaceButton.classList.remove('active'); // Remove highlight from space button
    } else {
        // General handling for all other keys
        let button = Array.from(buttons).find(b => b.innerText.trim().toLowerCase() === key);
        if (button) {
            button.classList.remove('active'); // Remove highlight when key is released
        }
    }
});

function handleButtonClick(buttonText) {
    const paragraphText = outputParagraph.innerText;

    switch (buttonText) {
        case "t":
            outputParagraph.innerText += "\n Trust the process ✨";
            break;

        case "n":
            outputParagraph.innerText += "\n Never gonna give you up, never gonna let you down 💃 🪩 🕺🏻";
            break;

        case "space":
            outputParagraph.innerHTML += "&nbsp;";
            break;

        case "caps":
            isCapsLockOn = !isCapsLockOn;
            toggleCapsLockState();
            break;

        case "clear":
            outputParagraph.innerText = "";
            break;

        case "del":
            outputParagraph.innerText = paragraphText.slice(0, paragraphText.length - 1);
            break;

        case "tab":
            outputParagraph.innerHTML += "&emsp;";
            break;

        default:
            let outputText = buttonText;

            if (isCapsLockOn) {
                outputText = buttonText.toUpperCase();
            }

            outputParagraph.innerText += outputText;
            break;
    }
}

function toggleCapsLockState() {
    const capsButton = Array.from(buttons).find(b => b.innerText.trim().toLowerCase() === "caps");
    if (capsButton) {
        capsButton.classList.toggle('active', isCapsLockOn); // Toggle active state
    }
}
