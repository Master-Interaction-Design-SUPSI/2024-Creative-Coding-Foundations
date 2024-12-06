// Arduino

let pot1, pot2;

const pots = document.getElementById("pots");



const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');



// main function to read the values coming from the Arduino
function updateWebPage(data) {
    
    // values are from 0.0 to 1.0
    pot1 = data[0];    
    pot2 = data[1];
    let button = data[2] // per implementare un bottone
    console.log(data);
    pots.innerText = pot1 + " " + pot2 + " " + button;
    
    //  draw point
    ctx.beginPath();
    ctx.strokeStyle = "whitesmoke";
    ctx.lineWidth = "1";
    ctx.arc(pot1, pot2/2, 1, 1, Math.PI*2); // create a small circle --> dot
    ctx.stroke();
    ctx.closePath();

}

