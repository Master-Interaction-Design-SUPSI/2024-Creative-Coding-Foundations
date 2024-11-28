const DATABASE_PATH = "assets/data.json";
const RESULT_CONTAINER = document.getElementById("result");

function fetchData() {
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase().trim(); //convert in lowercase and trim spaces for better matching
    console.log("User input:", pokemonName);

    fetch(DATABASE_PATH)
        .then(response => {
            console.log("Fetch response status:", response.status); // Log the status of the fetch response --> should be 200
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const pokemon = data.results.find(p => p.name === pokemonName); // Find Pokémon in the dataset
            console.log("Found Pokémon:", pokemon); // Log the Pokémon object if found
            if (pokemon) {
                displayData(pokemon);
            } else {
                console.log("Pokémon not found in the dataset."); // Log if the Pokémon is not found
                displayError("Pokémon not found. Are you sure is a gen-1?");
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            displayError(`An error occurred: ${error.message}`);
        });
}


// display the data
function displayData(pokemon) {
    console.log("Displaying data for:", pokemon.name);
    RESULT_CONTAINER.innerHTML = `
        <h2>${pokemon.id} ${pokemon.name} ${pokemon.japaneseName}</h2>
        <img src="${pokemon.url}" alt="${pokemon.name}" style="width: 150px;">
    `;
}

// display an error
function displayError(message) {
    console.log("Displaying error:", message);
    RESULT_CONTAINER.innerHTML = `<p style="color: red;">${message}</p>`;
}
