// for the animation
const text = "Look through the blindness!";
const typewriterText = document.getElementById("typewriter-text");
const cursor = document.getElementById("cursor");
let index = 0;

function typeEffect() {
    if (index < text.length) {
        typewriterText.textContent += text.charAt(index); // Adds one letter at a time
        index++;
        setTimeout(typeEffect, 100); // Wait 100ms before adding the next letter
    } else {
        cursor.style.display = "none"; // Hide cursor after typing is done
    }
}

// Start the typing effect
typeEffect();


// script for the typewriter button
// define constant for the button
const buttonEyes = document.getElementById('button-eyes')
const buttonEarth = document.getElementById('button-earth')
const buttonWoman = document.getElementById('button-woman')
const buttonVanish = document.getElementById('button-vanish')
const buttonCelestial = document.getElementById('button-celestial')
const buttonWind = document.getElementById('button-wind')
const buttonRainbow = document.getElementById('button-rainbow')
const buttonReckless = document.getElementById('button-reckless')
const buttonTears = document.getElementById('button-tears')

// define constant for the output
const outputParagraph = document.getElementById('output-buttons')


// add event listener + output
buttonEyes.addEventListener('click', () => {
    outputParagraph.innerText = "*The eyes bore a child, brilliance of Southern fires shining.\r\n";
})

buttonEarth.addEventListener('click', () => {
    outputParagraph.innerText = "*The earth trembles, the column planted by men lies buried.\r\n";
})

buttonWoman.addEventListener('click', () => {
    outputParagraph.innerText = "*A woman saw the mist's eyes shining in the void.\r\n";
})

buttonVanish.addEventListener('click', () => {
    outputParagraph.innerText = "*The eyes vanished within flesh, hungering for the death they seek.\r\n";
})

buttonCelestial.addEventListener('click', () => {
    outputParagraph.innerText = "*Celestial objects, like the sky, enveloped the burning sun.\r\n";
})

buttonWind.addEventListener('click', () => {
    outputParagraph.innerText = "*I rode the wind, crowned with ideas on a journey.\r\n";
})

buttonRainbow.addEventListener('click', () => {
    outputParagraph.innerText = "*The rainbow foretells the future: storms, sun, a cosmic journey.\r\n";
})


buttonReckless.addEventListener('click', () => {
    outputParagraph.innerText = "*The reckless man commanded the earth: celestial hurricanes and desperate stars.\r\n";
})

buttonTears.addEventListener('click', () => {
    outputParagraph.innerText = "*Those who cry in torment will one day surely shine.\r\n";
})



// for choosing random words from the text 

// declare array of words
const words = [
    "Spirit", "Horizon", "Fortune", "Tides", "Reflection", 
    "Seeker", "Discovery", "Whispered", "Journey", "Courage", 
    "Voyage", "Embrace", "Sails", "Depths", "Calling", 
    "Mesmerized", "Restlessness", "Uncharted", "Anticipation", 
    "Serenity", "Legacy", "Captivated", "Possibilities", 
    "Adventure", "Wanderer", "Obsession", "Mysterious", 
    "Vastness", "Infinite", "Propelling"
];

// Select the button and output paragraph
const wordGeneratorButton = document.getElementById('word-generator');
const outputGenerator = document.getElementById('output-generator');

// Add event listener to the button
wordGeneratorButton.addEventListener('click', () => {
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * words.length);
    // Get the word at the random index
    const randomWord = words[randomIndex];
    // Update the output paragraph with the random word
    outputGenerator.innerText = randomWord;
});