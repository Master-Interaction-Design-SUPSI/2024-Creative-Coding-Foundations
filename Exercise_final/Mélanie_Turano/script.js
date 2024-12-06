const apiKey = "361ece3925ea900e17e92857fc32cf6c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const backgroundCanvas = document.getElementById('background_canvas');
const ctx = backgroundCanvas.getContext('2d');

function resizeCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const circles = Array.from({ length: 50 }, () => ({
    x: Math.random() * backgroundCanvas.width,
    y: Math.random() * backgroundCanvas.height,
    radius: 15,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
    color: `rgba(0, 6, 29, 1)`,
}));

function animateBackground() {
    ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();

        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x - circle.radius < 0 || circle.x + circle.radius > backgroundCanvas.width) {
            circle.dx *= -1;
        }
        if (circle.y - circle.radius < 0 || circle.y + circle.radius > backgroundCanvas.height) {
            circle.dy *= -1;
        }
    });

    requestAnimationFrame(animateBackground);
}
animateBackground();


function removeBackground() {
    const dynamicBackground = document.getElementById('dynamic_background');
    if (dynamicBackground) {
        dynamicBackground.style.opacity = 0;
        setTimeout(() => dynamicBackground.remove(), 500); 
    }
}

document.getElementById('add_city_button').addEventListener('click', removeBackground);
document.getElementById('compare_button').addEventListener('click', removeBackground);

const inputContainer = document.getElementById('input_container');
const canvasContainer = document.getElementById('canvas_container');
const addCityButton = document.getElementById('add_city_button');
const compareButton = document.getElementById('compare_button');

addCityButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type a city';
    input.classList.add('city_input');
    inputContainer.appendChild(input);
});

compareButton.addEventListener('click', async () => {
    const cities = Array.from(document.querySelectorAll('.city_input')).map(input => input.value);
    if (cities.length === 0) {
        alert("Type at least one city!");
        return;
    }
    canvasContainer.innerHTML = ""; 
    for (const city of cities) {
        await createCityCard(city);
    }
});

const minTemp = -20; // Min temp.
const maxTemp = 40;  // Min temp.

function getTemperatureColor(temp) {
    if (temp < -20) {
        return `rgb(0, 0, 155)`;
    }
    if (temp > -20 && temp < -5) {
        return `rgb(0, 0, 207)`;
    }
    if (temp > -5 && temp < 5) {
        return `rgb(0, 116, 231)`;
    }
    if (temp > 5 && temp < 13) {
        return `rgb(138, 234, 255)`;
    }
    if (temp > 13 && temp < 20) {
        return `rgb(223, 248, 254)`;
    }

    if (temp > 13 && temp < 20) {
        return `rgb(223, 248, 254)`;
    }

    if (temp > 20 && temp < 25) {
        return `rgb(250, 239, 165)`;
    }

    if (temp > 25 && temp < 30) {
        return `rgb(250, 206, 165)`;
    }

    if (temp > 30 && temp < 40) {
        return `rgb(252, 131, 127)`;
    }

    if (temp > 40) {
        return `rgb(232, 60, 60)`;
    }

}

async function createCityCard(city) {
    const weatherData = await fetchWeather(city);
    if (!weatherData) return;
    
    const cityCard = document.createElement('div');
    cityCard.classList.add('city_card');

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    cityCard.appendChild(canvas);
    drawPattern(weatherData, canvas);

    createSummary(city, weatherData.main.temp, weatherData.main.humidity, weatherData.weather[0].main, cityCard);
    
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = "Download image";
    downloadBtn.addEventListener('click', () => downloadCanvas(canvas, city));
    cityCard.appendChild(downloadBtn);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = "Save to page";
    saveBtn.addEventListener('click', () => saveCanvasToPage(canvas, city));
    cityCard.appendChild(saveBtn);

    canvasContainer.appendChild(cityCard);
}

function createSummary(city, temperature, humidity, condition, container) {
    const summaryContainer = document.createElement("div");
    summaryContainer.className = "weather-summary";

    const cityItem = document.createElement("div");
    cityItem.className = "summary_item";
    cityItem.innerHTML = `<h3x>City</h3><p>${city}</p>`;

    const tempItem = document.createElement("div");
    tempItem.className = "summary_item";
    tempItem.innerHTML = `<h3>Temperature</h3><p>${temperature}°C</p>`;

    const humidityItem = document.createElement("div");
    humidityItem.className = "summary_item";
    humidityItem.innerHTML = `<h3>Umidity</h3><p>${humidity}%</p>`;

    const conditionItem = document.createElement("div");
    conditionItem.className = "summary_item";
    conditionItem.innerHTML = `<h3>Conditions</h3><p>${condition}</p>`;

    summaryContainer.appendChild(cityItem);
    summaryContainer.appendChild(tempItem);
    summaryContainer.appendChild(humidityItem);
    summaryContainer.appendChild(conditionItem);

    container.appendChild(summaryContainer);
}

async function fetchWeather(city) {
    const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`There seems to be an error with this city: ${city}`);
        return await response.json();
    } catch (error) {
        console.error(error.message);
        alert(`Unable to recover data for ${city}`);
        return null;
    }
}

function drawPattern(weatherData, canvas) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const humidity = weatherData.main.humidity;
    const temp = weatherData.main.temp;

    const maxSpeed = Math.min(5, Math.max(1, humidity / 20));

    const weatherIcons = {
        Clear: 'assets/sun.png',
        Rain: 'assets/rain.png',
        Snow: 'assets/snow.png',
        Clouds: 'assets/clouds.png',
        Thunderstorm: 'assets/thunderstorm.png',
        Drizzle: 'assets/drizzle.png',
        Mist: 'assets/mist.png',
        Haze: 'assets/mist.png',
        Wind: 'assets/wind.png',
    };

    const weatherCondition = weatherData.weather[0].main;
    const iconSrc = weatherIcons[weatherCondition] || 'assets/default.png';

    const icon = new Image();
    icon.src = iconSrc;

    icon.onload = () => {
        const circles = Array.from({ length: Math.floor(humidity) }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 15,
            dx: (Math.random()) * maxSpeed, // X Speed
            dy: (Math.random()) * maxSpeed, // Y Speed
        }));

        function animate() {
            ctx.clearRect(0, 0, width, height);

            const tempColor = getTemperatureColor(temp);
            ctx.fillStyle = tempColor;
            ctx.fillRect(0, 0, width, height);

            circles.forEach(circle => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(7, 0, 155, 1)`;
                ctx.fill();

                circle.x += circle.dx;
                circle.y += circle.dy;

                if (circle.x - circle.radius < 0 || circle.x + circle.radius > width) {
                    circle.dx *= -1;
                }
                if (circle.y - circle.radius < 0 || circle.y + circle.radius > height) {
                    circle.dy *= -1;
                }
            });

    
            const iconSize = 150;
            ctx.drawImage(icon, 30, 10, iconSize, iconSize);

            requestAnimationFrame(animate);
        }

        animate();
    };

    icon.onerror = () => {
        console.error(`Error loading icon for condition: ${weatherCondition}`);
    };
}


            
function downloadCanvas(canvas, city) {
    const link = document.createElement('a');
    link.download = `${city}_pattern.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function saveCanvasToPage(canvas, city) {
    const imageData = canvas.toDataURL("image/png");
    const savedImages = JSON.parse(localStorage.getItem("savedImages")) || [];
    const date = new Date().toLocaleDateString();
    savedImages.push({ city, date, imageData });
    localStorage.setItem("savedImages", JSON.stringify(savedImages));
    alert(`${city} pattern saved successfully!`);
}