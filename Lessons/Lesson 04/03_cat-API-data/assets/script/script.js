const API_URL = "https://api.thecatapi.com/v1/images/search"
const CONTAINER = document.getElementById("container")

fetch(API_URL)
  .then(response => response.json()) 
  .then(data => displayData(data))
  .catch(error => displayError(error));

function displayError(error){
    console.error('Error:', error)
    CONTAINER.innerHTML = "I'm sorry. The cat is not available."
}

function displayData(data){
    console.log(data)

    let output = ""
    let cat_obj = data[0]

    output +=  `
        <img src="${cat_obj.url}" width="${cat_obj.width}" height="${cat_obj.height}" class="cat_image" />
    `

    CONTAINER.innerHTML = output;
}
