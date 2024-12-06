const savedImagesContainer = document.getElementById("saved_images_container");
const filterCity = document.getElementById("filter_city");
const filterDate = document.getElementById("filter_date");
const applyFiltersBtn = document.getElementById("apply_filters");
const clearFiltersBtn = document.getElementById("clear_filters");

const savedImages = JSON.parse(localStorage.getItem("savedImages")) || [];

function displayImages(images) {
    savedImagesContainer.innerHTML = ""; 
    if (images.length === 0) {
        savedImagesContainer.innerHTML = "<p>No patterns match the criteria.</p>";
        return;
    }
    images.forEach(({ city, date, imageData }) => {
        const imageCard = document.createElement("div");
        imageCard.className = "image_card";

        const title = document.createElement("h3");
        title.textContent = `${city} (${date})`;
        imageCard.appendChild(title);

        const img = document.createElement("img");
        img.src = imageData;
        img.alt = `Pattern for ${city}`;
        imageCard.appendChild(img);

        savedImagesContainer.appendChild(imageCard);
    });
}


function filterImages() {
    const cityFilter = filterCity.value.toLowerCase().trim();
    const dateFilter = filterDate.value ? new Date(filterDate.value).toLocaleDateString() : null;

    const filteredImages = savedImages.filter(({ city, date }) => {
        const matchesCity = cityFilter ? city.toLowerCase().includes(cityFilter) : true;
        const matchesDate = dateFilter ? date === dateFilter : true;
        return matchesCity && matchesDate; 
    });

    displayImages(filteredImages);
}

applyFiltersBtn.addEventListener("click", filterImages);
clearFiltersBtn.addEventListener("click", () => {
    filterCity.value = "";
    filterDate.value = "";
    displayImages(savedImages); 
});

if (savedImages.length === 0) {
    savedImagesContainer.innerHTML = "<p>No patterns have been saved yet.</p>";
} else {
    savedImagesContainer.innerHTML = "<p>Use the filters above to display saved patterns.</p>";
}
