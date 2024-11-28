// add event listener to the button to fetch rover image
document.getElementById('fetch-image').addEventListener('click', fetchRoverImage);

let imageToggle = true; 

// start the rover image animation
startImageToggle();

// function to fetch a random rover image
function fetchRoverImage() {
  const apiKey = 'mlITBNAw7HRShljtTccDpf5M8WxalfjLSscgF7Iu';
  const rover = 'curiosity';

  // show the loader while searching the image
  document.getElementById('loader').style.display = 'block';

  // clear all
  document.getElementById('message').style.display = 'none';
  document.getElementById('image-container').innerHTML = '';
  document.getElementById('details').style.display = 'none';

  // search a specific day
  const sols = Array.from({ length: 4001 }, (_, index) => index);
  const randomSol = sols[Math.floor(Math.random() * sols.length)];
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${randomSol}&api_key=${apiKey}`;

  // fetch data from api
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // hide the loader 
      document.getElementById('loader').style.display = 'none';

      // check if there are photos and display one
      if (data.photos && data.photos.length > 0) {
        displayRandomImage(data.photos);
      } else {
        // show a message if no photos 
        showMessage(`I didn't take any photo on Sol ${randomSol} :(`);
      }
    })
}

// function to display a random image and details
function displayRandomImage(photos) {
  const container = document.getElementById('image-container');
  const randomPhoto = photos[Math.floor(Math.random() * photos.length)];

  // create an image element
  const img = document.createElement('img');
  img.src = randomPhoto.img_src;
  img.alt = `Image taken by rover ${randomPhoto.rover.name}`;
  img.style.cursor = 'pointer';

  // details (sol, camera, earth date)
  const detailsContainer = document.getElementById('details');
  detailsContainer.innerHTML = '';

  const solInfo = document.createElement('p');
  solInfo.textContent = `I took this photo on Sol ${randomPhoto.sol} and`;

  const cameraInfo = document.createElement('p');
  cameraInfo.textContent = `thanks to the ${randomPhoto.camera.name} camera.`;

  const earthDateInfo = document.createElement('p');
  earthDateInfo.textContent = `In your human calendar, ${randomPhoto.earth_date}.`;

  // add the details to the container
  detailsContainer.appendChild(solInfo);
  detailsContainer.appendChild(cameraInfo);
  detailsContainer.appendChild(earthDateInfo);

  // details are visible only if the image is clicked
  img.addEventListener('click', () => {
    detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
  });

  container.innerHTML = '';
  container.appendChild(img);
}

// rover animation
function startImageToggle() {
  const roverImage = document.querySelector('.rover-image');

  setInterval(function () {
    roverImage.src = imageToggle
      ? 'https://i.postimg.cc/GmHMkZz2/New-Piskel-4.png'
      : 'https://i.postimg.cc/nhHRCX9v/New-Piskel.png';
    imageToggle = !imageToggle;
  }, 500);
}
