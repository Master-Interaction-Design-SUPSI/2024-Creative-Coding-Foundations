const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("container");
const BUTTON = document.getElementById("start_listening");
const COLOR_PICKER = document.getElementById("line_color");
const LINE_WIDTH = document.getElementById("line_width");
const LINE_STYLE = document.getElementById("line_style");
const BG_MODE = document.getElementById("bg_mode");
const BG_COLOR = document.getElementById("bg_color");
const ctx = CANVAS.getContext("2d");

let analyser;
let dataArray;
let gradientOffset = 0;

// Funzione per ridimensionare il canvas in modo responsivo
function resizeCanvas() {
    CANVAS.width = CONTAINER.clientWidth;
    CANVAS.height = CONTAINER.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            draw();
        })
        .catch(err => {
            console.error("Error accessing microphone:", err);
        });
}

function setLineDashStyle(style) {
    if (style === "dashed") {
        ctx.setLineDash([10, 5]);
    } else if (style === "dotted") {
        ctx.setLineDash([2, 5]);
    } else {
        ctx.setLineDash([]);
    }
}

function drawBackground() {
    if (BG_MODE.value === "gradient") {
        const gradient = ctx.createLinearGradient(0, 0, CANVAS.width, CANVAS.height);
        gradientOffset += 0.01;
        gradient.addColorStop(0, `hsl(${Math.abs(Math.sin(gradientOffset) * 360)}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${Math.abs(Math.cos(gradientOffset) * 360)}, 100%, 50%)`);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = BG_COLOR.value;
    }
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
}

function draw() {
    drawBackground();

    analyser.getByteTimeDomainData(dataArray);

    const lineColor = COLOR_PICKER.value;
    const lineWidth = LINE_WIDTH.value;
    const lineStyle = LINE_STYLE.value;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;

    setLineDashStyle(lineStyle);

    const gap = CANVAS.width / dataArray.length;

    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
        const y = (dataArray[i] / 255) * CANVAS.height;
        if (i === 0) {
            ctx.moveTo(0, y);
        } else {
            ctx.lineTo(i * gap, y);
        }
    }
    ctx.stroke();

    requestAnimationFrame(draw);
}

BUTTON.addEventListener("click", startAudio);


// const CANVAS = document.getElementById("canvas");
// const CONTAINER = document.getElementById("container");
// const BUTTON = document.getElementById("start_listening");
// const ctx = CANVAS.getContext("2d");
// // CANVAS.width = CONTAINER.offsetWidth;
// CANVAS.height = window.innerHeight;


// const width = CANVAS.width;
// const height = CANVAS.height

// let analyser;
// let dataArray;

// function startAudio() {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     analyser = audioContext.createAnalyser();
//     analyser.fftSize = 256; // Size of the frequency data (this will affect resolution)
//     let bufferLength = analyser.frequencyBinCount; // Number of frequency data points
//     dataArray = new Uint8Array(bufferLength); 

//     navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(stream => {
//             const source = audioContext.createMediaStreamSource(stream); // Create audio source from microphone
//             source.connect(analyser); // Connect the source to the analyser
//             draw(); // Start the visualization loop
//       })
//         .catch(err => {
//             console.error('Error accessing microphone:', err);
//     });
// }



// function draw() {
//     ctx.clearRect(0,0,CANVAS.width,height);
//     console.log(CANVAS.width);
//     analyser.getByteTimeDomainData(dataArray);
//     //console.log(dataArray);

//     ctx.beginPath();
//     ctx.strokeStyle = "green";
// //console.log(CANVAS.width);
//     let gap = CANVAS.width / dataArray.length;

//     console.log(gap)


//     for (let i = 0; i < dataArray.length; i++) {
//         const element = dataArray[i];
//         //console.log(element);

//         let y = (dataArray[i] / 255) * CANVAS.height;

//         if(i===0){
//             ctx.moveTo(i*gap, y);
//         }
//         else {
//             ctx.lineTo(i*gap, y);

//         }

//         ctx.stroke();
//     }

//     requestAnimationFrame(draw);
// }

// BUTTON.addEventListener("click", function() {
//     console.log("OK");
//     startAudio();
// })