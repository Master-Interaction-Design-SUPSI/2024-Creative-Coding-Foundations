const CANVAS = document.getElementById("canvas");
const CONTAINER= document.getElementById("container");
const ctx = CANVAS.getContext("2d"); // Adding a context

const BUTTON = document.getElementById("start_listening")
const BUTTONSTOP = document.getElementById("stop_listening")

// set-upo the canvas dimension
CANVAS.width = CONTAINER.offsetWidth;
CANVAS.height = window.innerHeight;
const width = CANVAS.width;
const height = CANVAS.height;

let analyser;
let dataArray;
let acceso = false;

function startAudio(is_acceso) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Size of the frequency data (this will affect resolution)
    let bufferLength = analyser.frequencyBinCount; // Number of frequency data points
    dataArray = new Uint8Array(bufferLength); 


    if (is_acceso == true){
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

    else{

    }
    
}
 

function draw (){
    //ctx.clearRect(0,0, width, height);

    analyser.getByteTimeDomainData (dataArray);
    console.log(dataArray);

    ctx.beginPath();
    ctx.strokeStyle = "black";

    let gap = width / dataArray.length;

    for(let i = 0; i < dataArray.length; i++){
        console.log(dataArray[i]);

        let y = (dataArray[i] / 255) * canvas.height;

        if (i === 0){
            ctx.moveTo(i * gap, y);
        }
        else{
            ctx.lineTo(i * gap, y);
        }

        ctx.stroke();
    }

    requestAnimationFrame(draw);
}


BUTTON.addEventListener("click", () => {
    console.log("OK");


    if (acceso == false)
    acceso = true;
    startAudio(acceso);



})

function stopAudio() {
    console.log("Audio stopped");
}

BUTTONSTOP.addEventListener("click", () => {
    console.log("STOP");
    stopAudio();
})