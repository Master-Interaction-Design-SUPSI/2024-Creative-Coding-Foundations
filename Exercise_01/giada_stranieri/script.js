const words = [
    "ECOSYSTEM", "JAVASCRIPT", "PHILOSOPHY", "YELLOW", "HAPPINESS", 
    "EXPLORATION", "NETWORKING", "LANDSCAPE", "SCULPTURE", 
    "THEATER", "ATMOSPHERE", "GUITAR", "FAIRYTALE", 
    "WELLNESS", "MUSHROOM", "SUSTAINABILITY", 
    "SUMMER", "WINTER", "VOLLEYBALL", "CROCODILE", 
    "CHEMISTRY", "JOURNEY", "CURIOUSITY", "ISLAND", 
    "CATHEDRAL", "EUPHORIA", "KEYBOARD"
];


function startGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    attempts = 6;
    document.getElementById("attempts").textContent = attempts;
    document.getElementById("letterInput").value = "";
    document.getElementById("message").textContent = "";
    updateWordDisplay();
}


function updateWordDisplay() {
    const display = selectedWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    document.getElementById("wordDisplay").textContent = display;
}


function checkGuess(letter) {
    if (!guessedLetters.includes(letter) && attempts > 0) {
        guessedLetters.push(letter);
        if (!selectedWord.includes(letter)) {
            attempts--;
            document.getElementById("attempts").textContent = attempts;
        }
        updateWordDisplay();
        checkGameStatus();
    }
}


function checkGameStatus() {
    if (attempts === 0) {
        document.getElementById("message").textContent = `You lost! :( The right word was: "${selectedWord}".`;
    } else if (selectedWord.split('').every(letter => guessedLetters.includes(letter))) {
        document.getElementById("message").textContent = `You won!! The word was:"${selectedWord}".`;
    }
}


document.getElementById("guessButton").addEventListener("click", function() {
    const letterInput = document.getElementById("letterInput").value.toUpperCase();
    if (letterInput && letterInput.length === 1) {
        checkGuess(letterInput);
        document.getElementById("letterInput").value = "";
    }
});


window.onload = startGame();


