const START_BUTTON = document.getElementById('start-button');
const FOG_IMAGE = document.querySelector(".fog-image");
let analyser;
let dataArray;

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


function draw() {
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const AVERAGE = sum / dataArray.length;

    const THRESHOLD = 100;
    const OPACITY = Math.max(0, 1 - (AVERAGE / THRESHOLD));

    FOG_IMAGE.style.opacity = OPACITY;

    requestAnimationFrame(draw);
}

START_BUTTON.addEventListener("click", () => {
    startAudio();
});