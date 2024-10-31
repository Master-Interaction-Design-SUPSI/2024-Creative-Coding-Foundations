const buttonOne = document.getElementById('button-one');
const buttonTwo = document.getElementById('button-two');
const buttonThree = document.getElementById('button-three');
const buttonFour = document.getElementById('button-four');
const buttonFive = document.getElementById('button-five');
const buttonSix = document.getElementById('button-six');
const buttonSeven = document.getElementById('button-seven');
const buttonEight = document.getElementById('button-eight');
const buttonNine = document.getElementById('button-nine');
const buttonZero = document.getElementById('button-zero');

const buttonQ = document.getElementById('button-q');
const buttonW = document.getElementById('button-w');
const buttonE = document.getElementById('button-e');
const buttonR = document.getElementById('button-r');
const buttonT = document.getElementById('button-t');
const buttonY = document.getElementById('button-y');
const buttonU = document.getElementById('button-u');
const buttonI = document.getElementById('button-i');
const buttonO = document.getElementById('button-o');
const buttonP = document.getElementById('button-p');
const buttonA = document.getElementById('button-a');
const buttonS = document.getElementById('button-s');
const buttonD = document.getElementById('button-d');
const buttonF = document.getElementById('button-f');
const buttonG = document.getElementById('button-g');
const buttonH = document.getElementById('button-h');
const buttonJ = document.getElementById('button-j');
const buttonK = document.getElementById('button-k');
const buttonL = document.getElementById('button-l');
const buttonZ = document.getElementById('button-z');
const buttonX = document.getElementById('button-x');
const buttonC = document.getElementById('button-c');
const buttonV = document.getElementById('button-v');
const buttonB = document.getElementById('button-b');
const buttonN = document.getElementById('button-n');
const buttonM = document.getElementById('button-m');

const buttonClear = document.getElementById('button-clear');

const outputParagraph = document.getElementById('output');

let sequence = [];

// at the beginning is encrypted
outputParagraph.innerText = "GOT IT? NOW USE IT TO SEND ENCRYPTED MESSAGES\r\n";
outputParagraph.classList.add('cryptic');

// function to check for '007' combo and change fonts
const checkForSecretCode = () => {
    const sequenceString = sequence.join('');  // convert array to a string
    if (sequenceString === '007') {
        // Toggle cryptic font by checking for a specific class
        if (outputParagraph.classList.contains('cryptic')) {
            outputParagraph.classList.remove('cryptic');
        } else {
            outputParagraph.classList.add('cryptic');
        }
        sequence = [];  // reset sequence after checking
    }
};

// numbers
buttonOne.addEventListener('click', () => {
    outputParagraph.innerText += "1";
    sequence.push(1); // adds the number to the list of numbers pressed > to detect the sequence
    if (sequence.length > 3) sequence.shift();  // keep only the last 3 numbers
    checkForSecretCode(); 
});

buttonTwo.addEventListener('click', () => {
    outputParagraph.innerText += "2";
    sequence.push(2);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

buttonThree.addEventListener('click', () => {
    outputParagraph.innerText += "3";
    sequence.push(3);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

buttonFour.addEventListener('click', () => {
    outputParagraph.innerText += "4";
    sequence.push(4);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

buttonFive.addEventListener('click', () => {
    outputParagraph.innerText += "5";
    sequence.push(5);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

buttonSix.addEventListener('click', () => {
    outputParagraph.innerText += "6";
    sequence.push(6);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

buttonSeven.addEventListener('click', () => {
    outputParagraph.innerText += "7";
    sequence.push(7);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

buttonEight.addEventListener('click', () => {
    outputParagraph.innerText += "8";
    sequence.push(8);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

buttonNine.addEventListener('click', () => {
    outputParagraph.innerText += "9";
    sequence.push(9);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

buttonZero.addEventListener('click', () => {
    outputParagraph.innerText += "0";
    sequence.push(0);
    if (sequence.length > 3) sequence.shift();
    checkForSecretCode();
});

// letters (no need to have sequence check)
buttonQ.addEventListener('click', () => {
    outputParagraph.innerText += "Q";
});

buttonW.addEventListener('click', () => {
    outputParagraph.innerText += "W";
});

buttonE.addEventListener('click', () => {
    outputParagraph.innerText += "E";
});

buttonR.addEventListener('click', () => {
    outputParagraph.innerText += "R";
});

buttonT.addEventListener('click', () => {
    outputParagraph.innerText += "T";
});

buttonY.addEventListener('click', () => {
    outputParagraph.innerText += "Y";
});

buttonU.addEventListener('click', () => {
    outputParagraph.innerText += "U";
});

buttonI.addEventListener('click', () => {
    outputParagraph.innerText += "I";
});

buttonO.addEventListener('click', () => {
    outputParagraph.innerText += "O";
});

buttonP.addEventListener('click', () => {
    outputParagraph.innerText += "P";
});

buttonA.addEventListener('click', () => {
    outputParagraph.innerText += "A";
});

buttonS.addEventListener('click', () => {
    outputParagraph.innerText += "S";
});

buttonD.addEventListener('click', () => {
    outputParagraph.innerText += "D";
});

buttonF.addEventListener('click', () => {
    outputParagraph.innerText += "F";
});

buttonG.addEventListener('click', () => {
    outputParagraph.innerText += "G";
});

buttonH.addEventListener('click', () => {
    outputParagraph.innerText += "H";
});

buttonJ.addEventListener('click', () => {
    outputParagraph.innerText += "J";
});


buttonK.addEventListener('click', () => {
    outputParagraph.innerText += "K";
});


buttonL.addEventListener('click', () => {
    outputParagraph.innerText += "L";
});

buttonZ.addEventListener('click', () => {
    outputParagraph.innerText += "Z";
});

buttonX.addEventListener('click', () => {
    outputParagraph.innerText += "X";
});

buttonC.addEventListener('click', () => {
    outputParagraph.innerText += "C";
});

buttonV.addEventListener('click', () => {
    outputParagraph.innerText += "V";
});

buttonB.addEventListener('click', () => {
    outputParagraph.innerText += "B";
});

buttonN.addEventListener('click', () => {
    outputParagraph.innerText += "N";
});

buttonM.addEventListener('click', () => {
    outputParagraph.innerText += "M";
});

// button clear
buttonClear.addEventListener('click', () => {
    outputParagraph.innerText = "GOT IT? NOW USE IT TO SEND ENCRYPTED MESSAGES\r\n";
    sequence = [];  // reset sequence when cleared
});
