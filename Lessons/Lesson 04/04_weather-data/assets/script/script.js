const MY_API_KEY = "abc" // add your API kjey here
const API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=45.8708064&lon=8.97917556&units=metric&appid=" + MY_API_KEY
const MAX_TEMP = 40;
const MIN_TEMP = 10;
// console.log(API_URL)

const CONTAINER = document.getElementById("container")

fetch(API_URL)
  .then(response => response.json()) 
  .then(data => display_data(data))
  .catch(error => display_error(error));

function display_error(error){
    console.error('Error:', error)
    CONTAINER.innerHTML = "I'm sorry. The data are not available."
}

function display_data(data){
    console.log(data)

    let output = ""
    let wetherData = data.list
    console.log(wetherData)

    for (let wetherObj of wetherData){
        console.log(wetherObj.main.temp)

        let temp = wetherObj.main.temp * 100 / MAX_TEMP;
        let barColor = "orange";
        
        if (wetherObj.main.temp < MIN_TEMP){
            barColor = "blue"
        }

        output += `
            <div style="background-color: ${barColor}; height: 30px; width: ${temp}%;" class="wether_bar">
                ${wetherObj.dt_txt} -  ${wetherObj.main.temp} °C
            </div>
        `
    }

    CONTAINER.innerHTML = output
}
