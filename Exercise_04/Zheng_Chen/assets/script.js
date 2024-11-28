const MY_API_KEY = "";  // Add my API key
const API_URL = "https://api.openchargemap.io/v3/poi";      // OpenChargeMap API URL
const GEO_API_URL = "https://nominatim.openstreetmap.org/search";  // Nominatim Geocoding API URL
const CONTAINER = document.getElementById("container");
const SEARCH_BUTTON = document.getElementById("searchButton");
const CLEAR_BUTTON = document.getElementById("clearButton");
const CITY_INPUT = document.getElementById("cityInput");
// scroll button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Geocoding API to get latitude and longitude of a city by its name
async function getCoordinates(cityName) {
    try {
        const response = await fetch(`${GEO_API_URL}?q=${cityName}&format=json&addressdetails=1`);
        const data = await response.json();
        if (data.length === 0) {
            throw new Error("City not found.");
        }
        return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
        };
    } catch (error) {
        console.error("Geocoding error:", error);
        throw new Error("Error while fetching city coordinates.");
    }
}

// Get charging station data based on latitude and longitude
async function getChargingStations(latitude, longitude) {
    CONTAINER.innerHTML = "Loading..."; // Show loading message
    const params = {
        latitude,
        longitude,
        distance: 10,  // Search radius in kilometers
        distanceunit: "KM",  // Distance unit
        output: "json",  // Output format
        key: MY_API_KEY,  // API key
    };
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}?${query}`);
    const data = await response.json();
    console.log(data);  // Print all fetched charging station information to the console
    return data;
}

// Handle search button click event
SEARCH_BUTTON.addEventListener("click", async function () {
    const cityName = CITY_INPUT.value.trim();
    if (!cityName) {
        CONTAINER.innerHTML = "Please enter a city name.";
        return;
    }

    try {
        const { latitude, longitude } = await getCoordinates(cityName);
        const chargingStations = await getChargingStations(latitude, longitude);

        if (chargingStations.length === 0) {
            CONTAINER.innerHTML = "No charging stations found in this city.";
            return;
        }

        CONTAINER.innerHTML = "";
        const list = document.createElement("ul");
        chargingStations.forEach((station) => {
            const listItem = document.createElement("li");
            const title = station.AddressInfo.Title || "Unknown Station";
            const address = station.AddressInfo.AddressLine1 || "Unknown Address";
            const town = station.AddressInfo.Town || "Unknown Town";
            const country = station.AddressInfo.Country.Title || "Unknown Country";
            listItem.textContent = `${title} --- Address: ${address}, ${town}, ${country}`;
            list.appendChild(listItem);
        });
        CONTAINER.appendChild(list);

    } catch (error) {
        console.error("Error:", error);
        CONTAINER.innerHTML = `An error occurred: ${error.message}. Please try again later.`;
    }
});

// Handle clear button click event
CLEAR_BUTTON.addEventListener("click", function () {
    CONTAINER.innerHTML = ""; // Clear the container content
    CITY_INPUT.value = ""; // Clear the input field
});

// scroll to top button logic
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) { 
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
});

// click action of scroll to top
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
