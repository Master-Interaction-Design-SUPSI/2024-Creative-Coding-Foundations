const levels = [
    {
        fontName: "Garamond",
        gridSize: 5,
        history: "Garamond, a timeless serif typeface, was originally created by the French printer and type designer Claude Garamond in the 16th century. Known for its elegance and readability, the font embodies the humanist tradition of Renaissance typography, characterized by its organic shapes and moderate contrast between thick and thin strokes. Garamond’s legacy continued through revivals by designers like Jean Jannon in the 17th century and later adaptions in modern times. Its refined aesthetic makes it a popular choice for books, academic texts, and other long-form print works.",
        themeClass: "garamond-theme"
    },
    {
        fontName: "Bodoni",
        gridSize: 6,
        history: "Bodoni, a neoclassical typeface, was designed by Giambattista Bodoni, an Italian typographer and printer, in the late 18th century. This serif font represents the transition to modern type design, with its high contrast between thick and thin strokes, sharp serifs, and geometric shapes. Influenced by the works of John Baskerville and Pierre Simon Fournier, Bodoni achieved a level of typographic sophistication that symbolized the Enlightenment era. Today, Bodoni is widely used in fashion, branding, and editorial design due to its luxurious and dramatic appearance.",
        themeClass: "arial-theme"
    },
    {
        fontName: "Helvetica",
        gridSize: 7,
        history: "Helvetica, a sans-serif typeface, was designed in 1957 by Max Miedinger and Eduard Hoffmann in Switzerland. Originally named Neue Haas Grotesk, it was rebranded as Helvetica, derived from Helvetia, the Latin name for Switzerland. Helvetica epitomizes modernist ideals with its clean, neutral, and versatile design. Its balanced letterforms and lack of ornamentation make it suitable for a wide range of applications, from corporate logos to public signage. Helvetica’s impact on design and culture is unparalleled, earning it a reputation as one of the most influential typefaces of the 20th century.",
        themeClass: "times-new-roman-theme"
    }
];

let currentLevel = 0;
let fontName = levels[currentLevel].fontName;
let gridSize = levels[currentLevel].gridSize;
let collectedLetters = [];
let arrayLetters = [];
let currentPosition = 0;
let levelCompleted = false;

const bridge = document.getElementById('bridge');
const feedback = document.getElementById('feedback');
const safeSound = document.getElementById('safe-sound');
const trapSound = document.getElementById('trap-sound');
const winSound = document.getElementById('win-sound');
const modal = document.getElementById('modal');
const fontHistory = document.getElementById('fontHistory');
const closeModalBtn = document.getElementById('closeBtn');
const backgroundCanvas = document.getElementById('backgroundCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');

// Imposta il canvas
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

function drawBackground(color = 'rgba(0, 0, 0, 0)') {
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.fillStyle = color;
    backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

// Mostra temporaneamente un colore sul canvas
function showTemporaryBackground(color = 'rgba(255, 255, 0, 0.5)', duration = 500) {
    drawBackground(color);
    setTimeout(() => {
        drawBackground(); // Torna trasparente
    }, duration);
}

// Inizializza lo stato iniziale del canvas
drawBackground();

// Cambia tema in base al livello
function changeTheme() {
    document.body.classList.remove(...levels.map(level => level.themeClass));
    document.body.classList.add(levels[currentLevel].themeClass);
}

// Funzione per generare un percorso
function generateNewPath() {
    const letterPool = fontName.split('');
    arrayLetters = Array(gridSize * gridSize).fill(null);
    const blockedTiles = [];

    while (blockedTiles.length < Math.floor(gridSize * gridSize * 0.2)) {
        const randomIndex = Math.floor(Math.random() * arrayLetters.length);
        if (randomIndex !== 0 && randomIndex !== (gridSize * gridSize - 1) && !blockedTiles.includes(randomIndex)) {
            blockedTiles.push(randomIndex);
            arrayLetters[randomIndex] = 'BLOCKED';
        }
    }

    while (letterPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * arrayLetters.length);
        if (!arrayLetters[randomIndex] && randomIndex !== 0 && randomIndex !== (gridSize * gridSize - 1)) {
            arrayLetters[randomIndex] = letterPool.pop();
        }
    }
}

// Funzione per inizializzare la griglia
function initBridge() {
    bridge.innerHTML = '';
    bridge.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    arrayLetters.forEach((letter, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-index', index);

        if (index === 0) {
            tile.classList.add('start');
            tile.innerText = 'Start';
        } else if (index === (gridSize * gridSize - 1)) {
            tile.classList.add('finish');
            tile.innerText = 'Finish';
        } else if (letter) {
            tile.classList.add('safe');
            tile.innerText = letter;
        }

        bridge.appendChild(tile);
    });
}

// Funzione per aggiornare la posizione del giocatore
function updatePlayerPosition() {
    document.querySelectorAll('.tile').forEach(tile => tile.classList.remove('player'));
    if (currentPosition >= 0 && currentPosition < arrayLetters.length) {
        bridge.children[currentPosition].classList.add('player');
    }
}

// Funzione per gestire il raccolto di lettere
function onLetterCollected() {
    const currentTile = bridge.children[currentPosition];
    const letterOnTile = arrayLetters[currentPosition];

    if (letterOnTile) {
        showTemporaryBackground(); // Mostra il colore di sfondo temporaneo
        collectedLetters.push(letterOnTile);
        feedback.innerText = `You collected: ${collectedLetters.join('')}`;
        feedback.className = '';
        safeSound.play();

        // Aggiorna la griglia per rimuovere la lettera raccolta
        arrayLetters[currentPosition] = null;
        currentTile.innerText = '';
        currentTile.classList.remove('safe');
        currentTile.classList.add('tile');
    }
}

// Funzione per controllare lo stato del gioco
function checkStatus() {
    const currentTile = bridge.children[currentPosition];
    const letterOnTile = arrayLetters[currentPosition];

    if (letterOnTile === 'BLOCKED') {
        feedback.innerText = "You cannot pass through here!";
        feedback.className = 'failure';
        trapSound.play();
        return;
    }

    if (currentPosition === (gridSize * gridSize - 1)) {
        if (collectedLetters.length === fontName.length) {
            feedback.innerText = `You win! The font is: ${collectedLetters.join('')}`;
            feedback.className = 'success';
            winSound.play();
            setTimeout(() => {
                fontHistory.innerText = levels[currentLevel].history;
                modal.style.display = 'block';
                levelCompleted = true;
            }, 2000);
        } else {
            feedback.innerText = "Collect all the letters before finish!";
            feedback.className = 'failure';
        }
    } else if (letterOnTile && collectedLetters.filter(letter => letter === letterOnTile).length < fontName.split('').filter(letter => letter === letterOnTile).length) {
        onLetterCollected();
    } else {
        feedback.innerText = "Safe! Go on.";
        feedback.className = '';
        safeSound.play();
    }

    updatePlayerPosition();
}

// Funzione per chiudere il pop-up
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    if (levelCompleted) {
        levelCompleted = false;
        currentLevel++;
        if (currentLevel < levels.length) {
            fontName = levels[currentLevel].fontName;
            gridSize = levels[currentLevel].gridSize;
            collectedLetters = [];
            currentPosition = 0;
            arrayLetters = [];
            generateNewPath();
            initBridge();
            updatePlayerPosition();
            feedback.innerText = `Livello ${currentLevel + 1}: ${fontName}`;
            changeTheme();
        } else {
            feedback.innerText = "Hai completato tutti i livelli!";
            feedback.className = 'success';
        }
    }
});

// Funzione per resettare il gioco
function gameReset(resetAll = false) {
    collectedLetters = [];
    currentPosition = 0;
    arrayLetters = [];
    if (resetAll) {
        currentLevel = 0;
        fontName = levels[currentLevel].fontName;
        gridSize = levels[currentLevel].gridSize;
    }
    generateNewPath();
    initBridge();
    updatePlayerPosition();
    changeTheme();
}

// Inizializza il gioco
generateNewPath();
initBridge();
updatePlayerPosition();
changeTheme();

// Funzione per spostare il giocatore
function movePlayer(direction) {
    const maxPosition = gridSize * gridSize - 1;
    let newPosition = currentPosition;
    if (direction === 'left') {
        newPosition -= 1;
        if (newPosition % gridSize === gridSize - 1 || newPosition < 0) return;
    } else if (direction === 'right') {
        newPosition += 1;
        if (newPosition % gridSize === 0 || newPosition > maxPosition) return;
    } else if (direction === 'up') {
        newPosition -= gridSize;
        if (newPosition < 0) return;
    } else if (direction === 'down') {
        newPosition += gridSize;
        if (newPosition > maxPosition) return;
    }

    currentPosition = newPosition;
    checkStatus();
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') movePlayer('up');
    if (event.key === 'ArrowDown') movePlayer('down');
    if (event.key === 'ArrowLeft') movePlayer('left');
    if (event.key === 'ArrowRight') movePlayer('right');
});
