const buttons = document.querySelectorAll('.buttons'); // Select all buttons with the class 'buttons'
const buttonClear = document.getElementById('clear'); // Select clear button
const dynamicText = document.getElementById('dynamic-text'); // Select output of card


function addTextToWeddingCard(buttonText) {
    dynamicText.innerHTML += buttonText + '<br/>'; // Add text to output of card between greeting and closing phrase
}

buttons.forEach(button => {
    button.addEventListener('click', function () {
        const message = this.getAttribute('data-message'); // Get the message from the button's data-message attribute
        addTextToWeddingCard(message);
    });
});

buttonClear.addEventListener('click', function () {
    dynamicText.textContent = ''; // Replace output with empty string
});



