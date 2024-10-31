
const buttonOnePoint = document.getElementById("button-1point");
const buttonTwoPoints = document.getElementById("button-2points");
const buttonThreePoints = document.getElementById("button-3points");
const buttonResetGame = document.getElementById("button-reset");

const outputParagraph = document.getElementById("output");

function addNewVideo(videoHTML) {
    //disabilita l'autoplay per tutti i video esistenti nell'output
    const allVideos = outputParagraph.querySelectorAll('video');
    allVideos.forEach((video) => {
        video.removeAttribute('autoplay');
        video.pause(); //assicura che i vecchi video siano in pausa
    });
    
    //aggiunge il nuovo video all'output con autoplay
    outputParagraph.innerHTML += videoHTML;
}

buttonOnePoint.addEventListener('click', () => {
    if (Math.random() <= 0.8) {
        addNewVideo("<p class='p-result'><video class='video-output' src='assets/Michael Jordan Swishes Free Throw With Eyes Closed Shut@Denver - Trim.mp4' autoplay='1' controls></video> 1 POINT SCORED! </p>");
    } else {
        addNewVideo("<p class='p-result'><video class='video-output' src='assets/shot_missed.mp4' autoplay='1' controls></video> MISSED </p>");
    }
});

buttonTwoPoints.addEventListener('click', () => {
    if (Math.random() <= 0.6) {
        addNewVideo("<p class='p-result'><video class='video-output' src='assets/LeBron James - Midrange Scorer (Miami Days) - Trim - Trim.mp4' autoplay='1' controls></video> 2 POINTS SCORED! </p>");
    } else {
        addNewVideo("<p class='p-result'><video class='video-output' src='assets/shot_missed.mp4' autoplay='1' controls></video> MISSED </p>");
    }
});

buttonThreePoints.addEventListener('click', () => {
    if (Math.random() <= 0.4) {
        addNewVideo("<p class='p-result'><video class='video-output' src='assets/all-of-mike-breen-bang-calls-on-stephen-curry-1080-ytshorts.savetube.me - Trim.mp4' autoplay='1' controls></video> 3 POINTS SCORED! </p>");
    } else {
        addNewVideo("<p class='p-result'><video class='video-output' src='assets/shot_missed.mp4' autoplay='1' controls></video> MISSED </p>");
    }
});
buttonResetGame.addEventListener('click', () => {
    outputParagraph.innerText = " ";
})