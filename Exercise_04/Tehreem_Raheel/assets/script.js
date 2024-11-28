const API_URL = 'assets/data.json';
const plantDropdown = document.getElementById('plantDropdown');
const plantImage = document.getElementById('plantImage');
const saveButton = document.getElementById('saveButton');
const plantCommonName = document.getElementById('plantCommonName');
const plantScientificName = document.getElementById('plantScientificName');
const plantYear = document.getElementById('plantYear');
const plantBibliography = document.getElementById('plantBibliography');
const plantAuthor = document.getElementById('plantAuthor');
const plantStatus = document.getElementById('plantStatus');
const plantRank = document.getElementById('plantRank');
const plantGenusId = document.getElementById('plantGenusId');
const favoritesList = document.getElementById('favoritesList');

let selectedPlant = null;


let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

fetch(API_URL)
  .then(response => response.json())
  .then(data => initializeApp(data.data))
  .catch(error => displayError(error));

function displayError(error) {
    console.error("Error:", error);
    plantCommonName.textContent = "I'm sorry. The data are not available.";
}

function initializeApp(plants) {
    populateDropdown(plants);
    addEventListeners(plants);
    renderFavorites();
}

function populateDropdown(plants) {
    plants.forEach(plant => {
        const option = document.createElement('option');
        option.value = plant.id;
        option.textContent = plant.common_name || "Unknown Plant";
        option.dataset.details = JSON.stringify(plant);
        plantDropdown.appendChild(option);
    });
}

function addEventListeners(plants) {
    plantDropdown.addEventListener('change', () => {
        const selectedOption = plantDropdown.selectedOptions[0];
        selectedPlant = selectedOption.dataset.details ? JSON.parse(selectedOption.dataset.details) : null;
        if (selectedPlant) {
            displayPlantDetails(selectedPlant);
        } else {
            resetPlantDetails();
        }
    });

    saveButton.addEventListener('click', () => {
        if (selectedPlant && !isFavorite(selectedPlant.id)) {
            favorites.push(selectedPlant);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        }
    });
}

function displayPlantDetails(plant) {
    plantImage.src = plant.image_url || 'https://via.placeholder.com/500';
    plantCommonName.textContent = `Common Name: ${plant.common_name || "Unknown"}`;
    plantScientificName.textContent = `Scientific Name: ${plant.scientific_name || "Unknown"}`;
    plantYear.textContent = `Year: ${plant.year || "Unknown"}`;
    plantBibliography.textContent = `Bibliography: ${plant.bibliography || "Unknown"}`;
    plantAuthor.textContent = `Author: ${plant.author || "Unknown"}`;
    plantStatus.textContent = `Status: ${plant.status || "Unknown"}`;
    plantRank.textContent = `Rank: ${plant.rank || "Unknown"}`;
    plantGenusId.textContent = `Genus ID: ${plant.genus_id || "Unknown"}`;
}

function resetPlantDetails() {
    plantImage.src = 'https://via.placeholder.com/500';
    plantCommonName.textContent = "Common Name: ";
    plantScientificName.textContent = "Scientific Name: ";
    plantYear.textContent = "Year: ";
    plantBibliography.textContent = "Bibliography: ";
    plantAuthor.textContent = "Author: ";
    plantStatus.textContent = "Status: ";
    plantRank.textContent = "Rank: ";
    plantGenusId.textContent = "Genus ID: ";
}

function renderFavorites() {
    favoritesList.innerHTML = '';
    favorites.forEach(favorite => {
        const listItem = document.createElement('li');
        listItem.textContent = favorite.common_name || "Unknown Plant";

        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => {
            favorites = favorites.filter(fav => fav.id !== favorite.id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        });

        listItem.appendChild(removeButton);
        favoritesList.appendChild(listItem);
    });
}

function isFavorite(plantId) {
    return favorites.some(fav => fav.id === plantId);
}