function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomObstacles(numberOfObstacles) {
    const obstacles = [];
    const rowCount = Array(gridSize).fill(0); 

    for (let i = 0; i < numberOfObstacles; i++) {
        let row, col;
        
        do {
            row = getRandomInt(0, gridSize - 2);  
        } while (rowCount[row] >= 2);  

        col = getRandomInt(0, gridSize - 1);

        const direction = getRandomInt(0, 1) === 0 ? 1 : -1;

        obstacles.push({ row, col, direction });

        rowCount[row]++;
    }

    return obstacles;
}

function changeObstacleRow(obstacle) {
    obstacle.row = getRandomInt(0, gridSize - 2); 
}

// Funzione per verificare se un ostacolo ha colpito il giocatore
function checkCollisionWithPlayer() {
    obstacles.forEach(obstacle => {
        if (obstacle.row === playerPosition.row && obstacle.col === playerPosition.col) {
            alert("Hai perso! Un ostacolo ti ha colpito.");
            resetGame(); // Reset del gioco
        }
    });
}

// Funzione per ripristinare il gioco
function resetGame() {
    playerPosition = { row: gridSize - 1, col: 4 }; // Posizione iniziale nella riga più bassa e colonna 4
    const currentCell = gameContainer.children[playerPosition.row * gridSize + playerPosition.col];
    currentCell.appendChild(player);

    obstacles = generateRandomObstacles(numberOfObstacles); // Riproponi ostacoli casuali
    placeObstacles(); // Posiziona gli ostacoli nella nuova configurazione

    // Rimuovi il quadrato blu e riposizionalo
    placeGoal();
}

// Impostiamo il numero di ostacoli iniziali
let numberOfObstacles = getRandomInt(4, 10); // Numero casuale di ostacoli tra 4 e 10
let obstacles = generateRandomObstacles(numberOfObstacles);

// Posizione dell'obiettivo
let goalCol = getRandomInt(0, gridSize - 1); // Colonna casuale per l'obiettivo

const gameContainer = document.getElementById("game-container");
const player = document.createElement("div");
player.classList.add("player");
const goal = document.createElement("div");
goal.classList.add("goal");

// Funzione per creare la griglia
function createGrid() {
    gameContainer.innerHTML = ''; // Pulisce il contenitore
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gameContainer.appendChild(cell);
    }

    // Posiziona il giocatore nella cella iniziale (riga più bassa, colonna 4)
    const initialCell = gameContainer.children[(gridSize - 1) * gridSize + 4];
    initialCell.appendChild(player);

    // Posiziona l'obiettivo nella prima riga in una colonna casuale
    placeGoal();
}

// Funzione per posizionare l'obiettivo
function placeGoal() {
    const goalCell = gameContainer.children[goalCol]; // La colonna dell'obiettivo nella prima riga
    goalCell.appendChild(goal);
}

// Funzione per muovere il giocatore
function movePlayer(rowDelta, colDelta) {
    let newRow = playerPosition.row + rowDelta;
    let newCol = playerPosition.col + colDelta;

    // Controlliamo i confini della griglia
    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        // Verifichiamo se la nuova posizione è un ostacolo
        const isObstacle = obstacles.some(obstacle => obstacle.row === newRow && obstacle.col === newCol);

        if (isObstacle) {
            alert("Sei finito su un ostacolo! Torna all'inizio!");
            // Riporta il personaggio alla posizione iniziale
            newRow = gridSize - 1;  // Ultima riga
            newCol = 4;  // Colonna 4
        }

        // Troviamo la cella attuale del giocatore
        const currentCell = gameContainer.children[playerPosition.row * gridSize + playerPosition.col];
        
        // Se il giocatore è ancora un figlio della cella, lo rimuoviamo
        if (currentCell.contains(player)) {
            currentCell.removeChild(player);
        }

        // Se non è un ostacolo, aggiorna la posizione
        playerPosition = { row: newRow, col: newCol };
        gameContainer.children[playerPosition.row * gridSize + playerPosition.col].appendChild(player);

        // Verifica se il giocatore ha raggiunto l'obiettivo
        if (playerPosition.row === 0 && playerPosition.col === goalCol) {
            alert("Hai vinto! Hai raggiunto l'obiettivo!");
            resetGame(); // Riavvia il gioco dopo la vittoria
        }
    }
}

// Funzione per posizionare gli ostacoli sulla griglia
function placeObstacles() {
    // Rimuoviamo le classi "obstacle" da tutte le celle
    Array.from(gameContainer.children).forEach(cell => {
        cell.classList.remove("obstacle");
    });

    // Aggiungiamo la classe "obstacle" nelle nuove posizioni
    obstacles.forEach((obstacle) => {
        const obstacleCell = gameContainer.children[obstacle.row * gridSize + obstacle.col];
        if (obstacleCell) { // Verifica che la cella esista
            obstacleCell.classList.add("obstacle");
        }
    });
}

// Funzione per muovere gli ostacoli orizzontalmente e cambiare riga
let obstacleSpeed = 750; // Tempo di aggiornamento degli ostacoli in millisecondi
function moveObstacles() {
    obstacles.forEach(obstacle => {
        // Muoviamo l'ostacolo verso destra o verso sinistra
        obstacle.col += obstacle.direction;

        // Se l'ostacolo raggiunge il lato opposto della griglia, lo riportiamo all'altro lato
        if (obstacle.col >= gridSize) {
            obstacle.col = 0; // Ricomincia da sinistra
            changeObstacleRow(obstacle); // Cambia riga
            obstacle.direction = getRandomInt(0, 1) === 0 ? 1 : -1; // Cambia direzione
        } else if (obstacle.col < 0) {
            obstacle.col = gridSize - 1; // Ricomincia da destra
            changeObstacleRow(obstacle); // Cambia riga
            obstacle.direction = getRandomInt(0, 1) === 0 ? 1 : -1; // Cambia direzione
        }
    });

    // Rimuoviamo la vecchia posizione degli ostacoli e li riposizioniamo nella nuova posizione
    placeObstacles();

    // Controlliamo se uno degli ostacoli ha colpito il giocatore
    checkCollisionWithPlayer();
}

// Funzione per variare il numero di ostacoli
function updateObstacleCount() {
    const newObstacleCount = getRandomInt(4, 8); // Nuovo numero di ostacoli tra 4 e 10
    if (newObstacleCount !== numberOfObstacles) {
        numberOfObstacles = newObstacleCount;
        obstacles = generateRandomObstacles(numberOfObstacles); // Rigenera ostacoli con il nuovo numero
        placeObstacles(); // Posiziona i nuovi ostacoli
    }
}

// Impostiamo il ciclo di aggiornamento per gli ostacoli
setInterval(moveObstacles, obstacleSpeed);

// Impostiamo il ciclo per variare il numero di ostacoli ogni 3 secondi
setInterval(updateObstacleCount, 100000);

// Creiamo la griglia e posizioniamo gli ostacoli iniziali
createGrid();

// Posiziona il quadrato blu nella prima riga
placeGoal();

let isMoving = false;

document.addEventListener("keydown", (event) => {
    if (isMoving) return; // Ignora se è già in movimento
    isMoving = true;

    switch (event.key) {
        case "ArrowUp":
            movePlayer(-1, 0);
            break;
        case "ArrowDown":
            movePlayer(1, 0);
            break;
        case "ArrowLeft":
            movePlayer(0, -1);
            break;
        case "ArrowRight":
            movePlayer(0, 1);
            break;
    }

    setTimeout(() => {
        isMoving = false; // Permette un nuovo movimento dopo un breve ritardo
    }, 150); // 150 ms di ritardo tra i movimenti
});
