const DATABASE_PATH = "assets/data.json";
const KEY_WORD = document.getElementById("filter");
let data = [];

fetch(DATABASE_PATH) // get the data from an external source
  .then((response) => response.json()) // parse/convert the data in JavaScript format
  .then((fetchedData) => {
    //declare the data so i can use it outside of the display function
    data = fetchedData; // Assign fetched data to `data`
    display_data(data); // Display the data
  })
  //.then((data) => display_data(data)) // display the data in the console
  .catch((error) => display_error(error)); // display an error if the data cannot be loaded

const CONTAINER = document.getElementById("container");

let key_word = "Comet";
KEY_WORD.addEventListener("input", function () {
  key_word = KEY_WORD.value;
  console.log(key_word);

  if (key_word == "all") {
    display_data(data);
  } else {
    let filteredArray = [...data].filter((item) =>
      item.title.toLowerCase().includes(key_word)
    );
    console.log(filteredArray);

    display_data(filteredArray);
  }
});

function display_data(data) {
  let output = "";
  output += "<div>";

  for (let image of data) {
    output += `
        <div class="image">
          <img src="${image.url}">
          <h2>${image.title}</h2>
          <p class="explanation">${image.explanation}</p>
          <p class="date">${image.date}</p>
          
        </div>
      `;
  }
  output += "</div>";

  CONTAINER.innerHTML = output;
}

function display_error(error) {
  console.error("Error:", error);
  CONTAINER.innerHTML = "data are not available";
}
