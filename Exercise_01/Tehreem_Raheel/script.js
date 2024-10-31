
const outputArea = document.getElementById('output-area');
const clearButton = document.getElementById('clear-button');

// Emojies

const happyButton = document.getElementById('happy-button');
happyButton.addEventListener('click', () => { 
    outputArea.innerText += "😀"; 
});

const sadButton = document.getElementById('sad-button');
sadButton.addEventListener('click', () => { 
    outputArea.innerText += "😢"; 
});

const angryButton = document.getElementById('angry-button');
angryButton.addEventListener('click', () => { 
    outputArea.innerText += "😡"; 
});

const coolButton = document.getElementById('cool-button');
coolButton.addEventListener('click', () => { 
    outputArea.innerText += "😎"; 
});

const loveButton = document.getElementById('love-button');
loveButton.addEventListener('click', () => { 
    outputArea.innerText += "😍"; 
});

const sleepyButton = document.getElementById('sleepy-button');
sleepyButton.addEventListener('click', () => { 
    outputArea.innerText += "😴"; 
});

const rudeButton = document.getElementById('rude-button');
rudeButton.addEventListener('click', () => { 
    outputArea.innerText += "😤"; 
});

const laughButton = document.getElementById('laugh-button');
laughButton.addEventListener('click', () => { 
    outputArea.innerText += "😂"; 
});

const cryButton = document.getElementById('cry-button');
cryButton.addEventListener('click', () => { 
    outputArea.innerText += "😭"; 
});

const excitedButton = document.getElementById('excited-button');
excitedButton.addEventListener('click', () => { 
    outputArea.innerText += "🤩"; 
});

const celebrateButton = document.getElementById('celebrate-button');
celebrateButton.addEventListener('click', () => { 
    outputArea.innerText += "🎉"; 
});

const heartButton = document.getElementById('heart-button');
heartButton.addEventListener('click', () => { 
    outputArea.innerText += "❤️"; 
});

// Clear functionality
clearButton.addEventListener('click', () => { 
    outputArea.innerText = ''; 
});
clearButton.addEventListener('click', () => { 
    alert("Your mood emojis will be cleared. A fresh start is always a good idea!")
});

//Audio
const music = document.getElementById('background-music');
document.addEventListener('click', function() {
    if (music.paused) {
        music.play();
    }
});