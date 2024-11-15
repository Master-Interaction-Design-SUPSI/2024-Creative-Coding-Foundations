const CLIENTID = '3357a822b05f4f35a315deefe60b4621';
const CLIENTSECRET = '6b39ff6e37a9488d9a6ecc30aa47a2c1';
let access_token = "";
let artist_1 = "";
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

let quey_val = "";
let artist_selected_id = "";
let artist_selected_name = "";
let artist_selected_album = "";

//in order to use the Spotify API is mandatory to receive an access token. By sneding a POST request with personal keys you get the token
async function getToken(){
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
function assignToken(data){
    access_token = data.access_token
    console.log(access_token);
    //we call the function to get the artists on the sidebar
    //getArtist("7AC976RDJzL2asmZuz7qil");
}

//search artist
//we call the Spotify API in order to get artist
async function searchArtist(artist_id1){
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
            console.error(error);
    });
    
}

//we call the Spotify API in order to get artist
async function getArtist(artist_id1){
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
            console.log(data);
        }).catch(error => {
            console.error(error);
    });
    
}

//we call the Spotify API in order to get 4 artist (fixed list of artists)
async function getAlbum(artist_id){
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
            console.log(data);
        }).catch(error => {
            console.error(error);
    });
    
}

//we call the Spotify API in order to get 4 artist (fixed list of artists)
async function getAlbumTracks(album_id, album_title){
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
            artist_selected_album = album_title;
            displayAlbumTracks(data);
            console.log(artist_selected_album);
        }).catch(error => {
            console.error(error);
    });
    
}

//with this function we populate the sidebar with profile image and name of the artist
function displaySearchArtist(data){
    
    RESULTS.style.display = "flex";
    NORESULTS.style.display = "none";
    SEARCHQUERY.innerHTML = `You searched for <em>"${query_val}"</em>`;
    let artistSearch ="";
    for (const element of data.artists.items) {
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
    RESULTS.innerHTML = artistSearch;
    query_val ="";
}

//with this function we populate the sidebar with profile image and name of the artist
function displayArtist(data){
    let artist = "";
        artist += `
                <div class="overlay">
                    <h1>${data.name}</h1>
                    <h3><img src="assets/img/headphones.png">${data.followers.total} followers</h3>
                </div>`;
    HEADER.innerHTML = artist;
    HEADER.style.backgroundImage = `url('${data.images[0].url}')`;
    SEARCHWRAP.style.display = "none";
    HEADER.style.display = "flex";
    getAlbum(data.id);
    artist_selected_id = data.id;
    artist_selected_name = data.name;
    console.log("artista: " + artist_selected_name);
    
}


//with this function we populate the sidebar with profile image and name of the artist
function displayAlbum(data){
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
//with this function we populate the sidebar with profile image and name of the artist
function displayAlbumTracks(data){
    BACK.style.display = "flex";
    TITLE.innerText = artist_selected_album.toString();
    let album = `<h3 class='album-details'>Total tracks: ${data.total}</h3>
                    <table>
                        <tr>
                            <th id="col-1">#</th>
                            <th id="col-2">Title</th>
                            <th id="col-3">Duration</th>
                        </tr>`;
    for (const element of data.items) {
        let duration = msToTime(element.duration_ms);
        album += `<tr>
                        <td>${element.track_number}</td>
                        <td>${element.name}</td>
                        <td>${duration}</td>
                    </tr>
                    `;
    }
    RESULTS.innerHTML = album + '</table>';
    BACK.setAttribute("onclick", `getAlbum('${artist_selected_id}')`)
}

function displayError(err) {
    SEARCHQUERY.innerHTML = ``;
    NORESULTS.style.display = "flex";
    RESULTS.innerHTML = "";
}

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

  HOME.addEventListener("click", function() {
    HOMECONTENT.style.display = "flex";
    SEARCHWRAP.style.display = "none";
    RESULTS.style.display = "none";
    BACK.style.display = "none";
    SEARCHQUERY.innerHTML = "";
    HEADER.style.display = "none"; 
    TITLE.innerText = "";
  })
  SEARCH.addEventListener("click", function() {
    SEARCHWRAP.style.display = "flex";
    HOMECONTENT.style.display = "none";
    BACK.style.display = "none";
    RESULTS.style.display = "none";
    SEARCHQUERY.innerHTML = "";
    HEADER.style.display = "none"; 
    TITLE.innerText = "";
  })

  SEARCHBTN.addEventListener("click", function() {
    
    if(SEARCHARTIST.value === ""){

    }
    else{
        query_val = SEARCHARTIST.value.replace(/\s+/g, '+');
        searchArtist(query_val);
    }
  })