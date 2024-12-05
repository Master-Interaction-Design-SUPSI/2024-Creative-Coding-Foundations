const MY_API_KEY = "47fc88d3297ab798b73d88469283ee96";

function fetchWeatherData(cityId, lat, lon) {
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${MY_API_KEY}`;
    console.log(`Fetching weather data for ${cityId}`);
    console.log(`API URL: ${API_URL}`);

    fetch(API_URL)
        .then(response => {
            console.log(`Response received for ${cityId}`);
            return response.json();
        })
        .then(data => {
            if (data && data.list && data.list.length > 0) {
                console.log(`Data for ${cityId}:`, data);
                displayWeather(cityId, data);
            } else {
                throw new Error("No forecast data available");
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${cityId}:`, error);
        });
}

function displayWeather(cityId, data) {
    console.log(`Displaying weather for ${cityId}`);
    const cityElement = document.getElementById(cityId);
    const forecastContainer = cityElement.querySelector('.forecast-container');
    forecastContainer.innerHTML = ""; 

    for (let i = 0; i < 32; i += 8) { 
        const forecast = data.list[i];
        if (!forecast) {
            console.warn(`No forecast data available for index ${i}`);
            continue; 
        }
        console.log(`Forecast data for ${cityId} on day ${i / 8 + 1}:`, forecast);

        const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;
        const weatherIcon = forecast.weather[0].main.toLowerCase();
        const iconPath = getWeatherIcon(weatherIcon);

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <p class="date">${forecastDate}</p>
            <img src="${iconPath}" alt="${description}" class="weather-icon">
            <p class="temperature">${temperature}°C</p>
            <p class="description">${description}</p>
        `;

        forecastContainer.appendChild(forecastItem);
    }
}

function getWeatherIcon(weather) {
    console.log(`Determining icon for weather: ${weather}`);
    if (weather.includes("rain")) {
        console.log("Weather is rain, setting rain icon.");
        return "assets/rainy-day.png";
    }
    if (weather.includes("cloud")) {
        console.log("Weather is cloudy, setting cloud icon.");
        return "assets/clouds.png";
    }
    if (weather.includes("snow")) {
        console.log("Weather is snow, setting snow icon.");
        return "assets/snow.png";
    }
    console.log("Weather is clear, setting sun icon.");
    return "assets/sun.png"; 
}

console.log("Starting to fetch weather data for all cities...");
fetchWeatherData("milan", 45.46, 9.18);
fetchWeatherData("rome", 41.89, 12.43);
fetchWeatherData("florence", 43.77, 11.24);
fetchWeatherData("naples", 40.85, 14.26);
console.log("All fetch requests have been initiated.");


