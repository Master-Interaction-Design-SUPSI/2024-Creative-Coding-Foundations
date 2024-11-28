const canvas = document.getElementById("audioCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const lineWidth = document.getElementById("lineWidth");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

window.addEventListener("resize", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      analyser.getByteFrequencyData(dataArray);

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      ctx.lineWidth = lineWidth.value;
      ctx.strokeStyle = colorPicker.value;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height / 2);
        ctx.lineTo(x, canvas.height / 2 - barHeight);
        ctx.stroke();
        x += barWidth;
      }

      requestAnimationFrame(draw);
    }

    draw();
  })
  .catch((err) => {
    console.error("Error accessing microphone:", err);
  });
