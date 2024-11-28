const mic_btn = document.querySelector('#mic');
const playback = document.querySelector('.playback');

mic_btn.addEventListener('click', ToggleMic);

let can_record = false;
let is_recording = false;

let recorder = null; 

let chunks = [];

function SetupAudio() {
    console.log("Setup")
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then(SetupStream)
            .catch(err => {
                console.error(err)
            }); 
    }
}
SetupAudio();

function SetupStream(stream) {
    recorder = new MediaRecorder (stream);

    recorder.ondataavailable = e => {
        chunks.push(e.data);
    }

    recorder.onstop = e => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        playback.src = audioURL;
    }

    can_record = true;
}

function ToggleMic() {
    if (!can_record) return;

    is_recording = !is_recording;

    if (is_recording) {
        recorder.start();
        mic_btn.classList.add("is-recording");
    } else {
        recorder.stop();
        mic_btn.classList.remove("is-recording");
    }
}


const CANVAS = document.getElementById('canvas');
const CONTAINER = document.getElementById('container');
const ctx = CANVAS.getContext('2d');

const START = document.getElementById("start_listening");

//setup della larghezza del canvas (questo è solo per il canvas)
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const width = CANVAS.width;
const height = CANVAS.height;

let analyser;
let dataArray;
let circleRadius = 50;

function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Dimensione della frequenza dei dati (ricordarsi che serve per la risoluzione)
    let bufferLength = analyser.frequencyBinCount; // Numero di frequenza dei punti di dati
    dataArray = new Uint8Array(bufferLength); 

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream); // Crea una sorgente audio dal microfono
            source.connect(analyser); // Collega la sorgente

            draw(); // (qui inizia il loop di visualizzazione)
      })
        .catch(err => {
            console.error('Error accessing microphone:', err);
    });
}

function draw(){
    //ctx.clearRect(0,0,width,height);

    analyser.getByteTimeDomainData(dataArray)
    console.log(dataArray)

    ctx.beginPath();
    ctx.strokeStyle = "black";

    let gap = CANVAS.width / dataArray.length;

    for(let i = 0; i < dataArray.length; i++){
        console.log(dataArray[i]);
         let y= (dataArray[i] / 255) * CANVAS.height;

        if (i === 0) {
            ctx.moveTo(i * gap, y);
        }
        else {
            ctx.lineTo(i * gap, y);
        }

        ctx.stroke();

    }

    circleRadius = dataArray[2] + height/2 - 128;

    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(width/2, circleRadius, 50, 0, Math.PI * 2);
    ctx.fill();


    requestAnimationFrame(draw);

        //let x = i * gap;
        /*let y = (dataArray[i] / 255) * canvas.height;


        ctx.moveTo(x, y);
        ctx.lineTo(x, y);*/

    }
   



mic_btn.addEventListener("click", function(){
    console.log("ok")
    startAudio();
})