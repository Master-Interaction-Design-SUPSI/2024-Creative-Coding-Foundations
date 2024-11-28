const LUGANO_URL = "lugano_data.json"
const MENDRISIO_URL = "mendrisio_data.json"
const ZURICH_URL = "zurich_data.json"

const zurich = document.getElementById("zurich")
const lugano = document.getElementById("lugano")
const mendrisio = document.getElementById("mendrisio")
const slider = document.getElementById("date-range")
const selectedDateHeader = document.getElementById("selected-date-time")

let zurichWeather = []
let luganoWeather = []
let mendrisioWeather = []

async function mainFunction() {
    const zurichRequest = await fetch(ZURICH_URL);
    const zurichjson = await zurichRequest.json()
    zurichWeather = zurichjson.list;

    const luganoRequest = await fetch(LUGANO_URL);
    const luganojson = await luganoRequest.json()
    luganoWeather = luganojson.list;

    const mendrisioRequest = await fetch(MENDRISIO_URL);
    const mendrisiojson = await mendrisioRequest.json()
    mendrisioWeather = mendrisiojson.list;
    showWeatherData(1731877200)

}
function showWeatherData(time) {
    let zurichWeatherAtTime;
    for (let i = 0; i < zurichWeather.length; i++) {
        if (zurichWeather[i].dt === time) {
            console.log(zurichWeather[i]);
            zurichWeatherAtTime = zurichWeather[i];
            break;
        }
    }
    let luganoWeatherAtTime;

    for (let i = 0; i < luganoWeather.length; i++) {
        if (luganoWeather[i].dt === time) {
            luganoWeatherAtTime = luganoWeather[i];
            break;
        }
    }

    let mendrisioWeatherAtTime;
    for (let i = 0; i < mendrisioWeather.length; i++) {
        if (mendrisioWeather[i].dt === time) {
            mendrisioWeatherAtTime = mendrisioWeather[i];
            break;
        }
    }

    zurich.innerHTML = getHTMLElement("Zurich", zurichWeatherAtTime.weather[0].main, zurichWeatherAtTime.main.temp_min, zurichWeatherAtTime.main.temp_max)
    lugano.innerHTML = getHTMLElement("Lugano", luganoWeatherAtTime.weather[0].main, luganoWeatherAtTime.main.temp_min, luganoWeatherAtTime.main.temp_max)
    mendrisio.innerHTML = getHTMLElement("Mendrisio", mendrisioWeatherAtTime.weather[0].main, mendrisioWeatherAtTime.main.temp_min, mendrisioWeatherAtTime.main.temp_max)
    selectedDateHeader.innerHTML = `${zurichWeatherAtTime.dt_txt}`

    updateWeatherCards([zurichWeatherAtTime, luganoWeatherAtTime, mendrisioWeatherAtTime]);
}

function getHTMLElement(city, weather, tempMin, tempMax) {
    return ` <img height="100%" width="100%" class="weather-image" src="assets/${weather}.png"/>        
            <h3>Weather in ${city} is ${weather} with a temperature from ${tempMin} to ${tempMax}</h3>
            `
}


// for changing the colors of the text because of the visibility
function updateWeatherCards(cityData) {
    const cities = ['zurich', 'mendrisio', 'lugano'];
  
    cities.forEach((city, index) => {
      let cityElement = document.getElementById(city);
      let weatherDescription = cityData[index].weather[0].main.toLowerCase();
  
      cityElement.classList.remove('clear', 'rain');
  
      if (weatherDescription.includes('clear') || weatherDescription.includes('clear')) {
        cityElement.classList.add('clear');
      } else if (weatherDescription.includes('rain')) {
        cityElement.classList.add('rain');
      }
    });
  }

  mainFunction()
slider.addEventListener("change", () => {
    const time = parseInt(slider.value)
    showWeatherData(time)
})