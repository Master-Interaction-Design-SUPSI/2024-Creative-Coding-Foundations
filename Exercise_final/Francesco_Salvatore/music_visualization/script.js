const CANVAS = document.getElementById("visualizer");
const ctx = CANVAS.getContext("2d");
const BUTTON = document.getElementById("start_listening");
const audioFile1 = document.getElementById("audiofile1");
const audioFile2 = document.getElementById("audiofile2");
const volumeControl1 = document.getElementById("volume1");
const volumeControl2 = document.getElementById("volume2");
const timeControl = document.getElementById("time");

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;
const width = CANVAS.width;
const height = CANVAS.height;

let analyser1, analyser2;
let dataArray1, dataArray2;
let audio1, audio2;
let gainNode1, gainNode2;
let isPlaying = false;

// Arduino Inputs
let pot1, pot2, button;
const pots = document.getElementById("pots");

// Function to update values from Arduino
function updateWebPage(data) {
  pot1 = data[0];
  pot2 = data[1];
  button = parseInt(data[2]);

  console.log("pot1: " + pot1 + ", pot2: " + pot2 + ", button: " + button);
  pots.innerText = `Volume 1: ${parseInt(pot1)}, Volume 2: ${parseInt(pot2)}, Button: ${button}`;

  // Link Arduino values to volume sliders
  updateVolumeFromPot1();
  updateVolumeFromPot2();
}

// Function to update volume of audio 1 based on pot1 value
function updateVolumeFromPot1() {
  const volumeValue = pot1 / 1024;
  volumeControl1.value = volumeValue;
  if (gainNode1) {
    gainNode1.gain.value = volumeValue;
  }
}

// Function to update volume of audio 2 based on pot2 value
function updateVolumeFromPot2() {
  const volumeValue = pot2 / 1024;
  volumeControl2.value = volumeValue;
  if (gainNode2) {
    gainNode2.gain.value = volumeValue;
  }
}

BUTTON.addEventListener("click", () => {
  if (!isPlaying) {
    startAudio();
  } else {
    pauseAudio();
  }
  isPlaying = !isPlaying;
});

timeControl.addEventListener("input", () => {
  if (audio1 && audio2) {
    let newTime = (timeControl.value / 100) * audio1.duration;
    audio1.currentTime = newTime;
    audio2.currentTime = newTime;
  }
});

function startAudio() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  if (audioFile1.files[0]) {
    if (!audio1) {
      audio1 = new Audio(URL.createObjectURL(audioFile1.files[0]));
      audio1.loop = true;
      analyser1 = audioContext.createAnalyser();
      analyser1.fftSize = 256;
      let bufferLength1 = analyser1.frequencyBinCount;
      dataArray1 = new Uint8Array(bufferLength1);

      const source1 = audioContext.createMediaElementSource(audio1);
      gainNode1 = audioContext.createGain();
      gainNode1.gain.value = volumeControl1.value;

      source1.connect(gainNode1);
      gainNode1.connect(analyser1);
      analyser1.connect(audioContext.destination);

      audio1.addEventListener('timeupdate', () => {
        timeControl.value = (audio1.currentTime / audio1.duration) * 100;
      });
    }
    audio1.play();
  }

  if (audioFile2.files[0]) {
    if (!audio2) {
      audio2 = new Audio(URL.createObjectURL(audioFile2.files[0]));
      audio2.loop = true;
      analyser2 = audioContext.createAnalyser();
      analyser2.fftSize = 256;
      let bufferLength2 = analyser2.frequencyBinCount;
      dataArray2 = new Uint8Array(bufferLength2);

      const source2 = audioContext.createMediaElementSource(audio2);
      gainNode2 = audioContext.createGain();
      gainNode2.gain.value = volumeControl2.value;

      source2.connect(gainNode2);
      gainNode2.connect(analyser2);
      analyser2.connect(audioContext.destination);

      audio2.addEventListener('timeupdate', () => {
        timeControl.value = (audio2.currentTime / audio2.duration) * 100;
      });
    }
    audio2.play();
  }

  draw();
}

function pauseAudio() {
  if (audio1) {
    audio1.pause();
  }
  if (audio2) {
    audio2.pause();
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  if (analyser1) {
    analyser1.getByteTimeDomainData(dataArray1);
    ctx.beginPath();
    ctx.strokeStyle = "white";

    let gap = width / dataArray1.length;

    for (let i = 0; i < dataArray1.length; i++) {
      let y = (dataArray1[i] / 255) * height;

      if (i === 0) {
        ctx.moveTo(i * gap, y);
      } else {
        ctx.lineTo(i * gap, y);
      }
    }

    ctx.stroke();
  }

  if (analyser2) {
    analyser2.getByteTimeDomainData(dataArray2);
    let circleRadius = dataArray2[2] + height / 2 - 128;

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(width / 2, circleRadius, 50, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
});


