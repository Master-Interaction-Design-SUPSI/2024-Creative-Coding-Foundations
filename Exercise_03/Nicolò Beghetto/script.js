const gameContainer = document.getElementById("game-container"); // Assicurati che l'elemento con id="game-container" esista nell'HTML

const gridSize = 5;
let playerPosition = { row: 4, col: 2 };

// Definiamo gli ostacoli con posizione iniziale
let obstacles = [];

// Funzione per creare la griglia
function createGrid() {
    gameContainer.innerHTML = ''; // Pulisce il contenitore
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gameContainer.appendChild(cell);
    for (let i = 1; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gameContainer.appendChild(cell);
    }

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
            newRow = 4;
            newCol = 2;
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

// Funzione per muovere gli ostacoli orizzontalmente
let obstacleSpeed = 500; // Tempo di aggiornamento degli ostacoli in millisecondi (500ms = 0.5 secondi)
function moveObstacles() {
    obstacles.forEach(obstacle => {
        // Muoviamo l'ostacolo verso destra o verso sinistra
        obstacle.col += obstacle.direction;

        // Se l'ostacolo raggiunge il lato opposto della griglia, lo riportiamo all'altro lato
        if (obstacle.col >= gridSize) {
            // Se l'ostacolo è uscito dalla griglia (a destra)
            obstacle.col = 0; // Ricomincia da sinistra
            updateObstaclePosition(obstacle); // Cambia posizione e direzione quando si riposiziona
        } else if (obstacle.col < 0) {
            // Se l'ostacolo è uscito dalla griglia (a sinistra)
            obstacle.col = gridSize - 1; // Ricomincia da destra
            updateObstaclePosition(obstacle); // Cambia posizione e direzione quando si riposiziona
        }
    });

    // Rimuoviamo la vecchia posizione degli ostacoli e li riposizioniamo nella nuova posizione
    placeObstacles();
}

// Funzione per aggiornare la posizione, la direzione e la riga degli ostacoli
function updateObstaclePosition(obstacle) {
    // Cambia la riga dell'ostacolo in modo casuale (fra 0 e gridSize-1)
    let newRow = Math.floor(Math.random() * gridSize);
    // Assicuriamoci che non ci sia un altro ostacolo nella stessa riga e colonna
    while (obstacles.some(o => o.row === newRow && o.col === obstacle.col)) {
        newRow = Math.floor(Math.random() * gridSize); // Riprova se la posizione è già occupata
    }
    obstacle.row = newRow;

    // Cambia la direzione dell'ostacolo in modo casuale
    obstacle.direction = Math.random() > 0.5 ? 1 : -1; // Seleziona casualmente tra destra (1) o sinistra (-1)
}

// Funzione per generare un numero casuale di ostacoli all'inizio
function generateObstacles() {
    // Creiamo un numero casuale di ostacoli (da 2 a 5)
    const numberOfObstacles = Math.floor(Math.random() * 4) + 2;
    obstacles = [];

    for (let i = 0; i < numberOfObstacles; i++) {
        // Posizioniamo ogni ostacolo
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);
        let direction = Math.random() > 0.5 ? 1 : -1; // Direzione casuale (1 = destra, -1 = sinistra)

        // Assicuriamoci che l'ostacolo non si sovrapponga a un altro
        while (obstacles.some(o => o.row === row && o.col === col)) {
            row = Math.floor(Math.random() * gridSize);
            col = Math.floor(Math.random() * gridSize);
        }

        obstacles.push({ row, col, direction });
    }
}

// Impostiamo il ciclo di aggiornamento per gli ostacoli
setInterval(moveObstacles, obstacleSpeed);

// Creiamo la griglia e posizioniamo gli ostacoli iniziali
createGrid();
generateObstacles(); // Iniziamo con un numero casuale di ostacoli
placeObstacles();

// Aggiungiamo l'evento per muovere il giocatore
document.addEventListener("keydown", (event) => {
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
});
