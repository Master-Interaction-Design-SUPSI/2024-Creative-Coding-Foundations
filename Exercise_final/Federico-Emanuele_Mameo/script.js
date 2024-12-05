const START_BUTTON = document.getElementById('start-button');
const FOG_IMAGE = document.querySelector(".overlay-image");
const BACKGROUND_GIF = document.getElementById("background-gif");
const FETCH_WEATHER_BUTTON = document.getElementById('fetch-weather');
const CITY_INPUT = document.getElementById('city-input');
const canvas = document.getElementById('rain-canvas');
const ctx = canvas.getContext('2d');
const HISTORY_CONTAINER = document.getElementById('history-container');

const CLOUD_OVERLAY = document.getElementById('cloud-overlay');

canvas.width = document.getElementById('left-div').offsetWidth;
canvas.height = document.getElementById('left-div').offsetHeight / 2;

let analyser;
let dataArray;
let initialOpacity = 1;
let rainDrops = [];
let isRaining = false; // manage rain animation

// Weather data
function fetchWeatherData(city) {
    const apiKey = 'a11ff28d306f17dddfed773c3a18e92f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    stopRain(); // Reset previous effects

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`City not found: ${city}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            // fog
            if (data.visibility !== undefined) {
                const maxVisibility = 10000;
                const normalizedVisibility = Math.min(data.visibility / maxVisibility, 1);
                initialOpacity = 1 - normalizedVisibility;
                if (FOG_IMAGE) {
                    FOG_IMAGE.style.display = initialOpacity > 0 ? 'block' : 'none'; // show/hide FOG_IMAGE
                    FOG_IMAGE.style.opacity = initialOpacity;
                }
            } else {
                // Se non c'è visibilità, nascondi l'immagine della nebbia
                if (FOG_IMAGE) {
                    FOG_IMAGE.style.display = 'none';
                }
            }

            // clouds
            if (data.clouds && data.clouds.all !== undefined) {
                const cloudiness = data.clouds.all;
                const brightness = Math.max(0.2, 1 - cloudiness / 100);
                BACKGROUND_GIF.style.filter = `brightness(${brightness})`;
                updateCloudOverlay(cloudiness);
            }

            // rain
            if (data.rain && data.rain['1h'] > 0) {
                const rainValue = data.rain['1h'];
                initRainDrop(rainValue); // pass the value to initialization
            } else {
                console.log("No rain detected.");
            }

            // Get local time
            if (data.coord) {
                const { lat, lon } = data.coord;
                fetchLocalTime(lat, lon);
            }

            // add city to right div
            addCityToHistory(data);
        })
        .catch(error => {
            console.error("Error in getting weather data:", error);
            alert("Unable to fetch weather data. Please check the city name.");
        });
}


// record and visualize actual time
function fetchLocalTime(latitude, longitude) {
    const timeApiUrl = `https://timeapi.io/api/time/current/coordinate?latitude=${latitude}&longitude=${longitude}`;

    fetch(timeApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Time API error: ${response.status}`);
            }
            return response.json();
        })
        .then(timeData => {
            console.log(timeData);

            // Aggiorna il riquadro con l'orario
            const timeBox = document.getElementById('time-box');
            timeBox.textContent = `${timeData.time}`;
        })
        .catch(error => {
            console.error("Errore in getting time data:", error);
            const timeBox = document.getElementById('time-box');
            timeBox.textContent = "Time data unavailable";
        });
}


// clean canvas and stop rain
function stopRain() {
    rainDrops = []; // empty drops array
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isRaining = false; // stop rain animation
}

// initialize the rain with a number if drops proportional to real rain (mm/h)
function initRainDrop(rainValue) {
    rainDrops = [];
    // calculate number of drops based on the value of rain['1h']
    const rainCount = Math.min(Math.floor(rainValue * 10), 500);

    for (let i = 0; i < rainCount; i++) {
        rainDrops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10, // random length of drops
            speed: Math.random() * 3 + 2 // random speed of drops
        });
    }

    isRaining = true; // start rain animation
    drawRain(); // start drawing rain
}

// draw the rain
function drawRain() {
    if (!isRaining) return; // Esc if rain is deactivated
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(173, 216, 230, 0.7)';
    ctx.lineWidth = 2; // drops width

    for (let i = 0; i < rainDrops.length; i++) {
        const drop = rainDrops[i];
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        // update drop position
        drop.y += drop.speed;

        // if drop go out of the canvas, reposition on top with a new length
        if (drop.y > canvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * canvas.width;
            drop.length = Math.random() * 20 + 10; // random length of drops (10 to 30)
            drop.speed = Math.random() * 3 + 2; // random speed ( 2 to 5)
        }
    }

    requestAnimationFrame(drawRain);
}


// update clouds image
function updateCloudOverlay(cloudiness) {
    if (cloudiness > 70) {
        // show image and manage brightness
        CLOUD_OVERLAY.src = "assets/clouds-new.png";
        CLOUD_OVERLAY.style.display = "block";
        const brightness = Math.max(0.2, 1 - cloudiness / 100); // same as BACKGROUND_GIF
        CLOUD_OVERLAY.style.filter = `brightness(${brightness})`;
    } else {
        // hide image
        CLOUD_OVERLAY.style.display = "none";
    }
}

// audio function
function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    let bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            draw();
        })
        .catch(err => {
            console.error('Errore nell\'accesso al microfono:', err);
        });
}

// fog and clouds based on audio
function draw() {
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const AVERAGE = sum / dataArray.length;

    const THRESHOLD = 100; // max audio 
    const SENSITIVITY_FACTOR = 0.8;
    const audioOpacity = Math.max(0, 1 - (AVERAGE / THRESHOLD) * SENSITIVITY_FACTOR); //opacity based on audio

    // apply opacity only if FOG_IMAGE is visible
    if (FOG_IMAGE && getComputedStyle(FOG_IMAGE).display !== 'none') {
        FOG_IMAGE.style.opacity = audioOpacity;
    }

    // apply opacity only if CLOUD_OVERLAY is visible
    if (CLOUD_OVERLAY && getComputedStyle(CLOUD_OVERLAY).display !== 'none') {
        CLOUD_OVERLAY.style.opacity = audioOpacity;
    }

    // rain slow with audio
    rainDrops.forEach(drop => {
        drop.speed = Math.max(1, drop.speed * audioOpacity); // speed reduction based on opacity
    });

    requestAnimationFrame(draw);
}

// add new box to logbook
function addCityToHistory(cityData) {
    // Creation of the box details of cities
    const cityBox = document.createElement('div');
    cityBox.style.margin = '10px';
    cityBox.style.padding = '15px';
    cityBox.style.borderRadius = '10px';
    cityBox.style.border = '1px solid #ddd';
    cityBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

    // Title (city, country and flag)
    const cityName = document.createElement('h2');
    cityName.style.margin = '0 0 8px 0';
    cityName.style.color = '#e1e1e1';
    cityName.style.display = 'flex';
    cityName.style.alignItems = 'center';

    const cityCountry = cityData.sys?.country || "Unknown Country";

    // City name
    const cityNameText = document.createElement('span');
    cityNameText.textContent = `${cityData.name || "Unknown City"}, `;

    // Country ID
    const countryCode = document.createElement('span');
    countryCode.textContent = cityCountry;

    // Flag + API
    const flagImage = document.createElement('img');
    flagImage.src = `https://flagsapi.com/${cityCountry}/flat/16.png`;
    flagImage.alt = `${cityCountry} Flag`;
    flagImage.style.marginLeft = '8px';
    flagImage.style.borderRadius = '3px';
    flagImage.style.boxShadow = '0 0 3px rgba(0,0,0,0.2)';

    // Add elements to title
    cityName.appendChild(cityNameText);
    cityName.appendChild(countryCode);
    cityName.appendChild(flagImage);

    // Temperature
    const temperature = document.createElement('p');
    const tempCelsius = (cityData.main.temp - 273.15).toFixed(2);
    temperature.textContent = `Temperature: ${tempCelsius}°C`;
    temperature.style.margin = '0 0 4px 0';

    // Weather and description
    const weather = document.createElement('p');
    const weatherMain = cityData.weather?.[0]?.main || "N/A";
    const weatherDesc = cityData.weather?.[0]?.description || "N/A";
    weather.textContent = `Weather: ${weatherMain} - ${weatherDesc}`;
    weather.style.margin = '0 0 4px 0';

    // Rain
    const rain = document.createElement('p');
    const rainValue = cityData.rain?.['1h'] ? `${cityData.rain['1h']} mm` : "No rain";
    rain.textContent = `Rain: ${rainValue}`;
    rain.style.margin = '0 0 4px 0';

    // Cloudiness
    const clouds = document.createElement('p');
    const cloudiness = cityData.clouds?.all !== undefined ? `${cityData.clouds.all}%` : "N/A";
    clouds.textContent = `Cloudiness: ${cloudiness}`;
    clouds.style.margin = '0 0 4px 0';

    // Visibility
    const visibility = document.createElement('p');
    const visibilityValue = cityData.visibility !== undefined ? `${(cityData.visibility / 1000).toFixed(1)} km` : "N/A";
    visibility.textContent = `Visibility: ${visibilityValue}`;
    visibility.style.margin = '0';

    // Add all elements to the box
    cityBox.appendChild(cityName);
    cityBox.appendChild(temperature);
    cityBox.appendChild(weather);
    cityBox.appendChild(rain);
    cityBox.appendChild(clouds);
    cityBox.appendChild(visibility);

    // Add box on top
    HISTORY_CONTAINER.insertBefore(cityBox, HISTORY_CONTAINER.firstChild);
}


// Initial default data loading of Mendrisio
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData('Mendrisio');
    fetchLocalTime(45.8674, 8.9821);
});

// Event listener for button "Go there"
FETCH_WEATHER_BUTTON.addEventListener('click', () => {
    const city = CITY_INPUT.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city name.");
    }
});

// Event listener for button "Audio"
START_BUTTON.addEventListener("click", () => {
    startAudio();
});

