
const API_URL = "https://trefle.io/api/v1/plants?token=Ktcb0Nkd4N7W9dNUuwPTg9H3E9o-2k4RDXMLsWhdXKg";
const CONTAINER = document.getElementById("container");
const HEIGHT_SLIDER = document.getElementById("heightSlider");
const SLIDER_VALUE = document.getElementById("sliderValue");

// Fetch data from API
fetch(API_URL)
  .then(response => response.json())
  .then(data => displayData(data.data))
  .catch(error => displayError(error));

function displayError(error) {
    console.error("Error:", error);
    CONTAINER.innerHTML = "I'm sorry. The data are not available.";
}

function displayData(plants) {
    console.log(plants);
    let output = "";

    plants.forEach(plant => {
        const height = plant.main_species.specifications.maximum_height_cm || "N/A";
        output += `
            <div class="card" data-height="${height}">
                <img src="${plant.image_url || 'https://via.placeholder.com/150'}" alt="${plant.common_name}">
                <h2>${plant.common_name || "Unknown Plant"}</h2>
                <p><em>${plant.scientific_name}</em></p>
                <p>Height: ${height} cm</p>
            </div>
        `;
    });

    CONTAINER.innerHTML = output;

    // Filter plants based on slider
    HEIGHT_SLIDER.addEventListener("input", () => filterPlants(plants));
}

function filterPlants(plants) {
    const maxHeight = HEIGHT_SLIDER.value;
    SLIDER_VALUE.textContent = `${maxHeight} cm`;

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const plantHeight = parseInt(card.dataset.height) || 0;
        if (plantHeight <= maxHeight) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}