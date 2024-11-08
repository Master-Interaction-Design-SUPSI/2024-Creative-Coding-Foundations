const DATABASE_PATH = '/assets/data/students.json'
const CONTAINER = document.getElementById("container")

fetch(DATABASE_PATH)
  .then(response => response.json()) 
  .then(data => displayData(data))
  .catch(error => displayError(error)); 

function displayError(error){
    console.error('Error:', error)
    CONTAINER.innerHTML = "I'm sorry. The data are not available."
}

function displayData(data){

    // first, I filter the array
    let filteredArray = [...data].filter((a) => a.age >= 30)

    // then, I sort the array
    let sortedArray = [...filteredArray].sort((a, b) => a.age - b.age) 
    // let sortedArray = [...filteredArray].sort((a, b) => a.last_name.localeCompare(b.last_name)) 

    console.log("items: " + sortedArray.length)

    let output = ""
    output += "<ul>"

    for (let person of sortedArray){

        output += `
            <li>
                ${person.last_name} ${person.first_name}, ${person.age}
            </li>
        `
    }

    output += "</ul>"

    CONTAINER.innerHTML = output;
}

