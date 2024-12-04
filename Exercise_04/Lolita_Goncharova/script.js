const gallery = document.getElementById("gallery");
const yearSort = document.getElementById("year-sort");
const cards = document.querySelectorAll(".art-card");
const closeButton = document.getElementById("close-button");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");

const API_URL = "data.json";
let artworks = [];
// Fetch data from API or fallback
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API data not available");
    const json = await response.json();
    const data = json.data;
    artworks = data.map(art => ({
      title: art.title,
      artist: art.artist_display,
      year: art.fiscal_year ?? art.date_start,
      style: art.style_title || "Unknown",
      image: art.image_id ? `https://www.artic.edu/iiif/2/${art.image_id}/full/329,200/0/default.jpg` : "https://placehold.co/329x200",
      shortDescription: art.thumbnail ? art.thumbnail.alt_text : "No description available.",
      description: art.description ?? "No description available."
    }));
    onChangeSort()
  } catch (error) {
    console.error("Error fetching API data:", error);
  }
}

// Display artworks
function displayArtworks(artworks) {
  gallery.innerHTML = "";
  artworks.forEach(art => {
    const card = document.createElement("div");
    card.className = "art-card";
    card.innerHTML = `
      <img src="${art.image}" alt="${art.title}">
      <div class="art-card-content">
        <h2>${art.title}</h2>
        <p><strong>Artist:</strong> ${art.artist}</p>
        <p><strong>Year:</strong> ${art.year}</p>
        <p>${art.shortDescription}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      showModal(art)
    })
    gallery.appendChild(card);
  });
}

function showModal(artwork) {
  overlay.classList.remove("hidden")
  modal.classList.remove("hidden");
  const artworkDetails = document.createElement("div");
  artworkDetails.className = "artwork-details";
  artworkDetails.innerHTML = `
      <img src="${artwork.image}" alt="${artwork.title}">
      <div class="art-card-content">
        <h2>${artwork.title}</h2>
        <p><strong>Artist:</strong> ${artwork.artist}</p>
        <p><strong>Year:</strong> ${artwork.year}</p>
        <p>${artwork.description}</p>
      </div>
    `;
  modal.appendChild(artworkDetails)
}

// filter 
function onChangeSort() {
  const selectedOrder = yearSort.value.toLowerCase();
  artworks = artworks.sort((a, b) => {
    if (selectedOrder === "ascending") {
      return a.year - b.year
    }
    else {
      return b.year - a.year
    }
  })
  displayArtworks(artworks)

}

const hideModal = () => {
  overlay.classList.add("hidden")
  modal.classList.add("hidden");
  modal.innerHTML = `<button id="close-button" onclick="hideModal()">x</button>`
}

fetchData();
