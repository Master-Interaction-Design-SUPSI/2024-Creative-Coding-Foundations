// constants and variables
const buttonNotes = document.querySelectorAll(".button-notes button");
const buttonBop = document.getElementById("button-bop");
const mouthBop = document.getElementById("mouth-bop");
const correctCounter = document.getElementById("correct-counter");
const movingText = document.querySelector('.moving-text p');
const pupilBop = document.querySelectorAll('.pupil-bop');
const notes = ["c", "c1", "d", "d1", "e", "f", "f1", "g", "g1", "a", "a1", "b"];

let randomNote = "", bopClicked = false, correctFirstGuesses = 0, wrongGuess = false;

// play sound
const playNote = (key) => new Audio(`tunes/${key}.wav`).play();

// confetti explosions
const triggerConfetti = (x, y, particleCount = 75) => {
    confetti({
        particleCount: particleCount,
        spread: 70,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight }
    });
};

// bop interaction 
buttonBop.addEventListener("click", () => {
    mouthBop.classList.add('visible'); // mouth becomes visible
    randomNote = notes[Math.floor(Math.random() * notes.length)]; // choose a random note and remember it
    playNote(randomNote); // play the note
    bopClicked = true; 
    wrongGuess = false;

    setTimeout(() => mouthBop.classList.remove('visible'), 750); // mouth becomes invisible agaain
});

// button notes interaction
buttonNotes.forEach(button => {
    button.addEventListener("click", () => {
        const key = button.dataset.key;
        if (!bopClicked) {
            playNote(key);
            return; // verify is Bop was clicked
        } 

        playNote(key);
        const rect = button.getBoundingClientRect(); // play the note of the button

        if (key === randomNote) { 
            if (correctFirstGuesses === 2) {
                buttonNotes.forEach(btn => {
                    const btnRect = btn.getBoundingClientRect();
                    triggerConfetti(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2); // special prize if the counter goes to 3
                });
            } else {
                triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2); // confetti explosion
            }

            if (!wrongGuess) {
                correctFirstGuesses++;
                correctCounter.textContent = correctFirstGuesses; // updating the counter
            }
        } else {
            wrongGuess = true;
            correctFirstGuesses = 0;
            correctCounter.textContent = correctFirstGuesses; // wrong note = counter goes to 0
        }
    });
});

// auto-scrolling bottom text
let startPosition = window.innerWidth;

function scrollText() {
    startPosition -= 2;
    if (startPosition < -movingText.offsetWidth) startPosition = window.innerWidth;
    movingText.style.transform = `translateX(${startPosition}px)`;
    requestAnimationFrame(scrollText); // text from right to left with a speed of 2
}

scrollText();

// eyes follow cursor
document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    pupilBop.forEach(pupil => {
        const eye = pupil.parentElement;
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;

        const maxOffset = 15; // maxim movement of the pupil
        const distance = Math.min(maxOffset, Math.hypot(deltaX, deltaY));
        const angle = Math.atan2(deltaY, deltaX);

        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        pupil.style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`; // movement of the pupil
    });
});
