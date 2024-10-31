const tripList = document.getElementById('tripList');

function addTrip() {
  
  const country = document.getElementById('country').value;
  const date = document.getElementById('date').value;
  const positives = document.getElementById('positives').value;
  const negatives = document.getElementById('negatives').value;
  const food = document.getElementById('food').value;
  const place = document.getElementById('place').value;
  const color = document.getElementById('color').value;
  const imageInput = document.getElementById('image').files[0];
  const flagInput = document.getElementById('flag').files[0];

  
  if (!country || !date || !positives || !imageInput) {
    alert("Per favore, inserisci luogo, data, aspetti positivi e immagine.");
    return;
  }

  const formattedDate = new Date(date).toLocaleDateString('it-IT', { month: '2-digit', year: 'numeric' });

 
  const tripItem = document.createElement('div');
  tripItem.classList.add('trip-item');
  tripItem.style.backgroundColor = color; 

    
    const flagImage = document.createElement('img');
    const flagReader = new FileReader();
    flagReader.onload = function(event) {
      flagImage.src = event.target.result;
    };
    flagReader.readAsDataURL(flagInput);
    flagImage.classList.add('flag-image'); 
    tripItem.appendChild(flagImage);

  
  const tripImage = document.createElement('img');
  const reader = new FileReader();
  reader.onload = function(event) {
    tripImage.src = event.target.result;
  };
  reader.readAsDataURL(imageInput);
  tripImage.alt = country;
  tripItem.appendChild(tripImage);

  
  const tripDetails = document.createElement('div');
  tripDetails.classList.add('trip-details');

  
  const title = document.createElement('h3');
  title.innerHTML = `${country} - ${formattedDate}`;
  tripDetails.appendChild(title);

  
  const tripNotes = document.createElement('div');
  tripNotes.classList.add('trip-notes');

  const placePara = document.createElement('p');
  placePara.innerHTML = `<strong>Best place or attraction seen:</strong> ${place || "Not specified"}`;
  tripNotes.appendChild(placePara);

  const foodPara = document.createElement('p');
  foodPara.innerHTML = `<strong>Best Food Eaten:</strong> ${food || "Not specified"}`;
  tripNotes.appendChild(foodPara);
  
  const positivesPara = document.createElement('p');
  positivesPara.innerHTML = `<strong>Positive memories:</strong> ${positives}`;
  tripNotes.appendChild(positivesPara);

  const negativesPara = document.createElement('p');
  negativesPara.innerHTML = `<strong>Negative Memories:</strong> ${negatives || "None"}`;
  tripNotes.appendChild(negativesPara);

  
  tripDetails.appendChild(tripNotes);

  
  tripItem.appendChild(tripDetails);

  
  tripList.appendChild(tripItem);

  
  document.getElementById('country').value = '';
  document.getElementById('date').value = '';
  document.getElementById('positives').value = '';
  document.getElementById('negatives').value = '';
  document.getElementById('food').value = '';
  document.getElementById('place').value = '';
  document.getElementById('color').value = '#ffffff';
  document.getElementById('flag').value = '';
  document.getElementById('image').value = '';
}
