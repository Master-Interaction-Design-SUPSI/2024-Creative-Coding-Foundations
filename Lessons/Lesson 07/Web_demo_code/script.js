// main function to read the values coming from the Arduino
function updateWebPage(data) {

    const dacVal = 1023;    // Arduino is 1023, ESP32 is 4095

    // values are from 0.0 to 1.0
    const pot1 = data[0]/dacVal;    
    const pot2 = data[1]/dacVal;
    const pot3 = data[2]/dacVal;

    console.log("pot1: " + pot1 + ", pot2: " + pot2 + ", pot3: " + pot3);

    const pot1_bar = document.getElementById('pot1');
    const pot2_bar = document.getElementById('pot2');
    const pot3_bar = document.getElementById('pot3');
    
    pot1_bar.style.width = pot1 * 100 + '%';
    pot2_bar.style.width = pot2 * 100 + '%';
    pot3_bar.style.width = pot3 * 100 + '%';

    pot1_bar.innerHTML = "pot1: " + (pot1 * 100).toFixed(0) + "%";
    pot2_bar.innerHTML = "pot2: " + (pot2 * 100).toFixed(0) + "%";
    pot3_bar.innerHTML = "pot3: " + (pot3 * 100).toFixed(0) + "%";

}