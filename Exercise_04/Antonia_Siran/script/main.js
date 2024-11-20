
const DATABASE_PATH = 'api/movies_page_';
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500'
const moviesContainer = document.getElementById("movies-container");
const ratingSelector = document.getElementById("rating-selector");
const genreSelector = document.getElementById("genre-selector");
const releaseDateSelector = document.getElementById("year-selector");
const popupContainer = document.getElementById("popup-container");


let movies = []
let moviesWithGenres = []
let lastPageLoaded = 0;
let selectedOrder = "Highest to Lowest Rating";
let selectedGenre = "All"
let selectedReleaseDate = "All"


const mainfunc = async function () {
    moviesContainer.innerHTML = "Loading movies...";
    movies = [];

    for (let pageNumber = 1; pageNumber <= 5; pageNumber++) {
        const currentPageURL = DATABASE_PATH + pageNumber + '.json';

        const response = await fetch(currentPageURL);
        const json = await response.json();

        movies.push(...json.results);
    }

    const movieGenreURL = 'api/movies_genres.json';
    const responseGenres = await fetch(movieGenreURL);
    const jsonGenres = await responseGenres.json();
    const genres = jsonGenres.genres

    // changing genre ids to genre names
    moviesWithGenres = []
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const genreNames = []
        for (let g = 0; g < movie.genre_ids.length; g++) {
            const currentGenre = movie.genre_ids[g];
            for (let gn = 0; gn < genres.length; gn++) {
                const genreName = genres[gn];
                if (genreName.id == currentGenre) {
                    genreNames.push(genreName.name)
                }
            }
        }
        const movieWithGenres = movie;
        movieWithGenres.genre_ids = genreNames;
        moviesWithGenres.push(movieWithGenres)
    }


    // filter by genre and release year
    let filteredMovies = [];
    if (selectedGenre != "All") {

        for (let i = 0; i < moviesWithGenres.length; i++) {
            const movie = moviesWithGenres[i];
            for (let g = 0; g < movie.genre_ids.length; g++) {
                const genre = movie.genre_ids[g];
                if (genre === selectedGenre) {
                    filteredMovies.push(movie)
                }
            }
        }
    } else {
        filteredMovies = moviesWithGenres
    }

    let filteredByDate = []

    if (selectedReleaseDate != "All") {
        for (let i = 0; i < filteredMovies.length; i++) {
            const movie = filteredMovies[i];
            if (movie.release_date.slice(0, 4) == selectedReleaseDate) {
                filteredByDate.push(movie)
            }
        }
    } else {
        filteredByDate = filteredMovies
    }


    // Sort by rating
    const sortedMovies = filteredByDate.sort((first, second) => {
        if (selectedOrder != "Highest to Lowest Rating") {
            return first.vote_average - second.vote_average;
        } else {
            return second.vote_average - first.vote_average;
        }
    })


    moviesContainer.innerHTML = ""
    // render movie card and add rating star 
    for (let i = 0; i < sortedMovies.length; i++) {
        moviesContainer.innerHTML += `
                    <div onclick="openPopup(${sortedMovies[i].id})" class="movie-card" style="background-image: url(${IMAGE_PATH + sortedMovies[i].poster_path})"> 
                        <span>${sortedMovies[i].vote_average}⭐️</span>
                    </div>
                `
    }

}

function openPopup(id) {
    let selectedMovie;
    for (let i = 0; i < moviesWithGenres.length; i++) {
        if (moviesWithGenres[i].id == id) {
            selectedMovie = moviesWithGenres[i];
            break;
        }
    }
    const popup = `
    <div id="popup-content">
        <button id="popup-close" onclick="closePopup()">x</button>
        <img src="${IMAGE_PATH + selectedMovie.poster_path}"/>
        <div>
            <h2 id="popup-title" title="${selectedMovie.original_title}">${selectedMovie.title}</h2>
            <p><strong>Overview:</strong> <span id="popup-overview">${selectedMovie.overview}</span></p>
            <p><strong>Release Date:</strong> <span id="popup-release-date">${selectedMovie.release_date}</span></p>
            <p><strong>Original Language:</strong> <span id="popup-release-date">${selectedMovie.original_language}</span></p>
            <p><strong>Rating:</strong> <span id="popup-rating">${selectedMovie.vote_average}</span> ⭐️ with ${selectedMovie.vote_count} votes</p>
            <p><strong>Categories:</strong> <span id="popup-categories">${selectedMovie.genre_ids.join(", ")}</span></p>
        </div>
    </div>`
    popupContainer.innerHTML = popup;
    popupContainer.style.display = "flex";
}

mainfunc();

// updated filters and re-render movie 
ratingSelector.addEventListener("change", () => {
    selectedOrder = ratingSelector.value
    mainfunc()
})
genreSelector.addEventListener("change", () => {
    selectedGenre = genreSelector.value
    mainfunc()
})
releaseDateSelector.addEventListener("change", () => {
    selectedReleaseDate = releaseDateSelector.value
    mainfunc()
})
const closePopup = () => {
    popupContainer.style.display = "none";
};