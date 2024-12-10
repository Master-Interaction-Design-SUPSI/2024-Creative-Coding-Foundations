const mic_btn = document.getElementById('mic'); 
const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
const playback = document.getElementById('playback');

let audioContext = null;
let analyser = null;
let dataArray = null;
let animationId = null;
let recorder = null;
let isRecording = false;
let chunks = [];
let port = null; // Porta seriale // Serial Port
let amplificationFactor = 2;
let reader = null;
let numLines = 8;

// Array per memorizzare le linee precedenti per ogni livello // Array to store previous lines for each level
let previousLinesMulti = Array(numLines).fill().map(() => []);
const MAX_STORED_LINES = 30;

// Gestione dei colori // Colour management
const colors = [
    '#4CAF50',  // Verde
    '#2196F3',  // Blu
    '#F44336',  // Rosso
    '#9C27B0',  // Viola
    '#FF9800',  // Arancione
    '#FFEB3B',  // Giallo
    '#FFFFFF',  // Bianco
    '#964b00'   // Nero
];
let currentColorIndex = 0;

// Memorizza i dati della linea per la persistenza // Stores line data for persistence
function storeLine(lineData, yPosition, lineIndex) {
    if (!previousLinesMulti[lineIndex]) {
        previousLinesMulti[lineIndex] = [];
    }

    previousLinesMulti[lineIndex].push({
        data: [...lineData],
        y: yPosition,
        color: colors[(currentColorIndex + lineIndex) % colors.length]
    });

    // Mantiene solo le ultime MAX_STORED_LINES linee // Keep only the last MAX_STORED_LINES lines
    if (previousLinesMulti[lineIndex].length > MAX_STORED_LINES) {
        previousLinesMulti[lineIndex].shift();
    }
}

async function connectArduino() {
    try {
        port = await navigator.serial.requestPort(); // Richiede all'utente di selezionare una porta seriale // Prompts the user to select a serial port
        await port.open({ baudRate: 9600 }); // Imposta il baud rate (deve corrispondere al codice Arduino) // Set the baud rate (must match Arduino code)

        reader = port.readable.getReader(); // Ottiene un reader per leggere i dati dalla porta // Gets a reader to read data from the port

        while (true) {
            const { value, done } = await reader.read();
            if (done) break; // Interrompe il loop se la porta è chiusa // Breaks the loop if the door is closed

            const potValue = new TextDecoder().decode(value).trim(); // Decodifica il valore e rimuove spazi bianchi // Decode the value and remove whitespace
            
            // Verifica che il valore del potenziometro sia un numero valido // Verify that the potentiometer value is a valid number
            const potValueNumber = parseInt(potValue);
            if (!isNaN(potValueNumber)) {
                console.log(`Valore del potenziometro: ${potValueNumber}`); // Stampa il valore letto in console // Print the value read in the console
                
                // Calcola il numero di linee in base al valore del potenziometro // Calculate the number of lines based on the potentiometer value
                // Limita il numero di linee tra 1 e 30 // Limit the number of lines between 1 and 30
                numLines = Math.max(1, Math.min(30, Math.floor(potValueNumber / 34)));
                previousLinesMulti = Array(numLines).fill().map(() => []); // Reimposta l'array delle linee // Reset the array of lines
            } else {
                console.error('Valore del potenziometro non valido:', potValue);
            }
        }
    } catch (error) {
        console.error('Error connecting to Arduino:', error);
    }
}


function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function setupAudio() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                recorder = new MediaRecorder(stream);
                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.onstop = handleRecordingStop;

                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                
                analyser.fftSize = 1024; 
                analyser.smoothingTimeConstant = 0.5; 
                
                source.connect(analyser);
                dataArray = new Uint8Array(analyser.frequencyBinCount);
            })
            .catch(error => console.error('Error accessing microphone:', error));
    }
}

function drawLine(lineData, yOffset, color, alpha = 1) {
    ctx.beginPath();
    ctx.strokeStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    ctx.lineWidth = 2;
    
    const sliceWidth = canvas.width / lineData.length;
    let x = 0;
    
    for (let i = 0; i < lineData.length; i++) {
        const v = lineData[i] / 128.0;
        const y = yOffset + (v - 1) * (canvas.height / (numLines * 4)) * amplificationFactor;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    ctx.lineTo(canvas.width, yOffset);
    ctx.stroke();

    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
}

function draw() {
    ctx.fillStyle = 'rgba(17, 17, 17, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
        
        for (let lineIndex = 0; lineIndex < numLines; lineIndex++) {
            const lineOffset = (canvas.height / (numLines + 1)) * (lineIndex + 1);
            const lineColor = colors[(currentColorIndex + lineIndex) % colors.length];
            
            drawLine(dataArray, lineOffset, lineColor);
            storeLine(dataArray, lineOffset, lineIndex);
            
            previousLinesMulti[lineIndex].forEach((line, index) => {
                const alpha = 0.3 + (index / previousLinesMulti[lineIndex].length) * 0.7;
                drawLine(line.data, line.y, line.color, alpha);
            });
        }
    }
    
    animationId = requestAnimationFrame(draw);
}

function toggleRecording() {
    if (!recorder) return;
    
    isRecording = !isRecording;
    if (isRecording) {
        chunks = [];
        previousLinesMulti = Array(numLines).fill().map(() => []);
        recorder.start();
        mic_btn.classList.add('is-recording');
        draw();
    } else {
        recorder.stop();
        mic_btn.classList.remove('is-recording');
        cancelAnimationFrame(animationId);
    }
}

function handleRecordingStop() {
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    const audioURL = window.URL.createObjectURL(blob);
    playback.src = audioURL;
    playback.classList.remove('is-hidden');
}

// Event Listeners
window.addEventListener('resize', setupCanvas);
mic_btn.addEventListener('click', toggleRecording);

// Pulsante per connettere Arduino
const connectButton = document.createElement('button');
connectButton.textContent = 'Connect Arduino';
connectButton.style.position = 'fixed';
connectButton.style.top = '20px';
connectButton.style.left = '20px';
connectButton.style.padding = '10px';
connectButton.style.backgroundColor = '#4CAF50';
connectButton.style.color = 'white';
connectButton.style.border = 'none';
connectButton.style.borderRadius = '5px';
connectButton.style.cursor = 'pointer';
connectButton.addEventListener('click', connectArduino);
document.body.appendChild(connectButton);

// Pulsante Clear per resettare il canvas
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Lines';
clearButton.style.position = 'fixed';
clearButton.style.top = '20px';
clearButton.style.left = '150px';
clearButton.style.padding = '10px';
clearButton.style.backgroundColor = '#f44336';
clearButton.style.color = 'white';
clearButton.style.border = 'none';
clearButton.style.borderRadius = '5px';
clearButton.style.cursor = 'pointer';
clearButton.addEventListener('click', () => {
    previousLinesMulti = Array(numLines).fill().map(() => []);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
document.body.appendChild(clearButton);

// Pulsante per salvare la registrazione
const saveRecButton = document.createElement('button');
saveRecButton.textContent = 'Save Rec';
saveRecButton.style.position = 'fixed';
saveRecButton.style.bottom = '20px';
saveRecButton.style.right = '120px';
saveRecButton.style.padding = '8px';
saveRecButton.style.backgroundColor = '#2196F3';
saveRecButton.style.color = 'white';
saveRecButton.style.border = 'none';
saveRecButton.style.borderRadius = '5px';
saveRecButton.style.cursor = 'pointer';
saveRecButton.style.fontSize = '12px';
saveRecButton.addEventListener('click', () => {
    if (chunks.length > 0) {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'audio_recording_' + new Date().toISOString() + '.ogg';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } else {
        alert('No recording available to save');
    }
});
document.body.appendChild(saveRecButton);

// Pulsante per salvare il canvas
const saveCanvasButton = document.createElement('button');
saveCanvasButton.textContent = 'Save Canvas';
saveCanvasButton.style.position = 'fixed';
saveCanvasButton.style.bottom = '20px';
saveCanvasButton.style.right = '20px';
saveCanvasButton.style.padding = '8px';
saveCanvasButton.style.backgroundColor = '#2196F3';
saveCanvasButton.style.color = 'white';
saveCanvasButton.style.border = 'none';
saveCanvasButton.style.borderRadius = '5px';
saveCanvasButton.style.cursor = 'pointer';
saveCanvasButton.style.fontSize = '12px';
saveCanvasButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'visualization_' + new Date().toISOString() + '.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
document.body.appendChild(saveCanvasButton);

// Aggiungi effetti hover per i pulsanti
const addHoverEffect = (button) => {
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#1976D2';
        button.style.transform = 'scale(1.05)';
        button.style.transition = 'all 0.2s ease';
    });
    
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#2196F3';
        button.style.transform = 'scale(1)';
    });
};

addHoverEffect(saveRecButton);
addHoverEffect(saveCanvasButton);

// Inizializza
setupCanvas();
setupAudio();
