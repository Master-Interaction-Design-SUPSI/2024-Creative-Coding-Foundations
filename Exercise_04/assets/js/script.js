//variable declarations
//api variable
const CLIENTID = '3357a822b05f4f35a315deefe60b4621';
const CLIENTSECRET = '6b39ff6e37a9488d9a6ecc30aa47a2c1';

//get the html elements
const RESULTS = document.getElementById("results");
const HOME = document.getElementById("home");
const SEARCH = document.getElementById("search");
const BACK = document.getElementById("back");
const TITLE = document.getElementById("title");
const HEADER = document.getElementById("cover-artist");
const SEARCHARTIST = document.getElementById("search-artist");
const SEARCHBTN = document.getElementById("search-btn");
const SEARCHQUERY = document.getElementById("search-query");
const SEARCHWRAP = document.getElementById("search-wrap");
const NORESULTS = document.getElementById("no-results");
const HOMECONTENT = document.getElementById("home-content");

//local varibles
let access_token = "";
let artist_1 = "";
let query_val = "";
let artist_selected_id = "";
let artist_selected_name = "";
let artist_selected_album = "";

//in order to use the Spotify API is mandatory to receive an access token. By sneding a POST request with personal keys you get the token
async function getToken() {
    const authOptions = {
        url: `https://accounts.spotify.com/api/token`,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(CLIENTID + ':' + CLIENTSECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    };

    fetch(authOptions.url, authOptions)
        .then(response => response.json())
        .then(data => {
            assignToken(data);
        }).catch(error => {
            console.error(error);
        });
}
getToken();

//in order to call the API we should assign the access token we get with the POST call, to a variable.
function assignToken(data) {
    access_token = data.access_token
    //console.log(access_token);
}

//search artist
//we pass as parameter the search query.
async function searchArtist(artist_id1) {
    const authOptions = {
        url: `https://api.spotify.com/v1/search?q=${artist_id1}&type=artist`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    fetch(authOptions.url, authOptions)
        .then(response => response.json())
        .then(data => {
            displaySearchArtist(data);
            console.log(data);
        }).catch(error => {
            displayError(error);
            console.log("message: " + error.message);
        });

}

//This function gets the artist data
async function getArtist(artist_id1) {
    const authOptions = {
        url: `https://api.spotify.com/v1/artists/${artist_id1}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    fetch(authOptions.url, authOptions)
        .then(response => response.json())
        .then(data => {
            displayArtist(data);
            //console.log(data);
        }).catch(error => {
            console.error(error);
        });

}

//With this call we get all the album data from the selected artist
async function getAlbum(artist_id) {
    const authOptions = {
        url: `https://api.spotify.com/v1/artists/${artist_id}/albums`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    fetch(authOptions.url, authOptions)
        .then(response => response.json())
        .then(data => {
            displayAlbum(data);
            //console.log(data);
        }).catch(error => {
            console.error(error);
        });

}

//We get the tracklist (e.g. track number, title, duration) of the selected album
async function getAlbumTracks(album_id, album_title) {
    const authOptions = {
        url: `https://api.spotify.com/v1/albums/${album_id}/tracks`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    fetch(authOptions.url, authOptions)
        .then(response => response.json())
        .then(data => {
            //it is necessary in order to disolay the title album on the tracklist. The tracklist api does not provide this information
            artist_selected_album = album_title;
            displayAlbumTracks(data);
            //console.log(artist_selected_album);
        }).catch(error => {
            console.error(error);
        });

}

//The function populate the result "area" with a set of cards
function displaySearchArtist(data) {
    //change the display of the different alement within the page
    RESULTS.style.display = "flex";
    NORESULTS.style.display = "none";
    SEARCHQUERY.innerHTML = `You searched for <em>"${query_val}"</em>`;
    let artistSearch = "";
    if (data.artists.total != 0) {
        //there are some case where the artist has no profile img. This arises an error. It checks if the array is not empty. OTherwise it gives a default profile image
        for (const element of data.artists.items) {
            console.log("ecolo");
            if (element.images.length > 0) {
                artistSearch += `<section>
                    <div class="card" onclick="getArtist('${element.id}')">
                        <img class="img-artist" src="${element.images[0].url}" alt="Avatar">
                        <div class="container">
                          <h4><b>${element.name}</b></h4>
                          <em>Total followers: ${element.followers.total}</em>
                        </div>
                      </div>
                </section>
                    `;
            }
            else {
                artistSearch += `<section>
                    <div class="card" onclick="getArtist('${element.id}')">
                        <img class="img-artist" src="assets/img/user_noimg.png" alt="Avatar">
                        <div class="container">
                          <h4><b>${element.name}</b></h4>
                          <em>Total followers: ${element.followers.total}</em>
                        </div>
                      </div>
                </section>
                    `;
            }

            RESULTS.innerHTML = artistSearch;

        }
        query_val = ""
    }
    else {

        SEARCHQUERY.innerHTML = ``;
        NORESULTS.style.display = "flex";
        RESULTS.innerHTML = "";
        console.log("Eeeeee");
    }
}

//with this function we populate the main container with the basic information of the artist (name, followers, cover image)
//and we call the getAlbum function in order to get and display the album list
function displayArtist(data) {
    let artist = "";
    artist += `
                <div class="overlay">
                    <h1>${data.name}</h1>
                    <h3><img src="assets/img/headphones.png">${data.followers.total} followers</h3>
                </div>`;
    //change the display of the different alement within the page
    HEADER.innerHTML = artist;
    //there are some case where the artist has no profile img. This arises an error. It checks if the array is not empty. OTherwise it gives a default profile image
    if ((data.images).length > 0) {
        HEADER.style.backgroundImage = `url('${data.images[0].url}')`;
    }
    else {
        HEADER.style.backgroundImage = `url('assets/img/head_noimg.png')`;
    }
    SEARCHWRAP.style.display = "none";
    HEADER.style.display = "flex";
    //get albums
    getAlbum(data.id);

    //we are assigning the id of the artist to a variable. It will be used in another function
    artist_selected_id = data.id;

}


//It displays the basic information of the artist's albums
function displayAlbum(data) {
    BACK.style.display = "none";
    SEARCHQUERY.innerHTML = "";
    let album = "";
    TITLE.innerText = "Albums";
    for (const element of data.items) {
        album += `
            <section>
                <div class="card" onclick="getAlbumTracks('${element.id}', '${element.name}')">
                    
                    <div class="container">
                    <img src="${element.images[1].url}" alt="Avatar">
                      <h4><b>${element.name}</b></h4>
                      <p>Total traks: ${element.total_tracks}</p>
                      <em>Release date: ${element.release_date}</em>
                    </div>
                  </div>
            </section>`;
    }
    RESULTS.innerHTML = album;
}
//it displays the track list of the selected album
function displayAlbumTracks(data) {
    //the back button has been enabled in order to go back to the seleted artist page.
    BACK.style.display = "flex";
    TITLE.innerText = artist_selected_album;
    let album = `<h3 class='album-details'>Total tracks: ${data.total}</h3>
                    <table>
                        <tr>
                            <th id="col-1">#</th>
                            <th id="col-2">Title</th>
                            <th id="col-3">Duration</th>
                        </tr>`;
    for (const element of data.items) {
        //the duration has to be converted from milliseconds to a moe readable "format" (MM:SS)
        let duration = msToTime(element.duration_ms);
        album += `<tr>
                        <td>${element.track_number}</td>
                        <td>${element.name}</td>
                        <td>${duration}</td>
                    </tr>
                    `;
    }
    RESULTS.innerHTML = album + '</table>';
    //we are setting the right call to the back button
    BACK.setAttribute("onclick", `getAlbum('${artist_selected_id}')`)
}

//it cathches the error when the search gives no results and displays a specific page/information
function displayError(err) {
    SEARCHQUERY.innerHTML = ``;
    NORESULTS.style.display = "flex";
    RESULTS.innerHTML = "";
}

//it converts milliseconds to a more readable format (MM:SS)
function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

//the actions done by clicking on the Home button on the sidebar
HOME.addEventListener("click", function () {
    HOMECONTENT.style.display = "flex";
    SEARCHWRAP.style.display = "none";
    RESULTS.style.display = "none";
    BACK.style.display = "none";
    SEARCHQUERY.innerHTML = "";
    HEADER.style.display = "none";
    TITLE.innerText = "";
    NORESULTS.style.display = "none";
})
//the actions done by clicking on the search button on the sidebar
SEARCH.addEventListener("click", function () {
    SEARCHWRAP.style.display = "flex";
    HOMECONTENT.style.display = "none";
    BACK.style.display = "none";
    RESULTS.style.display = "none";
    SEARCHQUERY.innerHTML = "";
    HEADER.style.display = "none";
    TITLE.innerText = "";
})

//the actions done by submitting a search
SEARCHBTN.addEventListener("click", function () {
    if (SEARCHARTIST.value != "") {
        query_val = SEARCHARTIST.value.replace('/\s+/g', '+');
        searchArtist(query_val);
    }
})