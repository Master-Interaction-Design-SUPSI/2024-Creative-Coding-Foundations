//variable declaration
const RED = document.getElementById("red");
const GREEN = document.getElementById("green");
const BLUE = document.getElementById("blue");

//canvas declaration + parameters
const CANVAS = document.getElementById("grid");
const ctx = CANVAS.getContext("2d");
const width = CANVAS.width;
const height = CANVAS.height;


//sound variables
let analyser;
let dataArray;


//function to start acquiring sound from the microphone
function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Size of the frequency data (this will affect resolution)
    let bufferLength = analyser.frequencyBinCount; // Number of frequency data points
    dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream); // Create audio source from microphone
            source.connect(analyser); // Connect the source to the analyser
            draw(); // Start the visualization loop
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
        });
}

//function to generate random numbers
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//function that draw the rectangle on the canvas based on the sound that comes from the microphone
function draw() {
    ctx.clearRect(0, 0, CANVAS.width, height);
    analyser.getByteTimeDomainData(dataArray);
    for (let index = 0; index < dataArray.length; index++) {
        let val = getRandomInt(128);
        ctx.beginPath();
        //the color of the rectangle changes based on the value of the sliders
        ctx.fillStyle = "rgba(" + RED.value + "," + GREEN.value + "," + BLUE.value + "," + val + ")";
        ctx.fillRect(0, 0, CANVAS.width, dataArray[index]);
        ctx.closePath();

    }
    requestAnimationFrame(draw);
}

startAudio(); 