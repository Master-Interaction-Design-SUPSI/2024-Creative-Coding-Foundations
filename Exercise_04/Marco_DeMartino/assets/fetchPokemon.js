const https = require("https");
const fs = require("fs");

const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const numPokemons = 151;

const pokemons = [];

const fetchPokemon = (id) => {
  return new Promise((resolve, reject) => {
    https
      .get(`${apiUrl}${id}/`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", (err) => reject(err));
  });
};

(async () => {
  for (let i = 1; i <= numPokemons; i++) {
    try {
      console.log(`Fetching Pokémon ID: ${i}`);
      const pokemonData = await fetchPokemon(i);
      pokemons.push(pokemonData);
    } catch (err) {
      console.error(`Failed to fetch Pokémon ID: ${i}`, err);
    }
  }

  fs.writeFileSync("pokemons.json", JSON.stringify(pokemons, null, 2));
  console.log("Dati salvati in pokemons.json!");
})();
