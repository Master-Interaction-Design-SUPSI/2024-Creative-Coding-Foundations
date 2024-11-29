//variable declarations
//api variable
const CLIENTID = '3357a822b05f4f35a315deefe60b4621';
const CLIENTSECRET = '6b39ff6e37a9488d9a6ecc30aa47a2c1';

//get the html elements
const RESULTS = document.getElementById("middle");
const ARTIST = document.getElementById("top-artist");
const CREDITS = document.getElementById("credits");
const TITLE = document.getElementById("title");
const HOME = document.getElementById("home");
const UP = document.getElementById("up");
const LUCKY = document.getElementById("lucky");
const LUCKYIMG = document.getElementById("lucky-img");

//local varibles
let access_token = "";
let artist_selected_album = "";
let selected_album_img = "";


let artistArray = [];
let artist_position = 0;
let albumArray = [];
let album_position = 0;
let trackArray = [];
let track_position = 0;
let change = "";


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

//This function gets the artist data
async function getArtist(artist_id1, artist_id2, artist_id3, artist_id4, artist_id5, artist_id6, artist_id7, artist_id8, artist_id9, artist_id10, artist_id11, artist_id12, artist_id13) {

    LUCKYIMG.style.display = "none";
    const authOptions = {
        url: `https://api.spotify.com/v1/artists?ids=${artist_id1},${artist_id2},${artist_id3},${artist_id4},${artist_id5},${artist_id6},${artist_id7},${artist_id8},${artist_id9},${artist_id10},${artist_id11},${artist_id12},${artist_id13}`,
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
async function getAlbums(artist_id) {
    LUCKYIMG.style.display = "none";
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
async function getAlbumTracks(album_id, album_title, image_album) {
    LUCKYIMG.style.display = "none";
    const authOptions = {
        url: `https://api.spotify.com/v1/albums/${album_id}/tracks?limit=50`,
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
            selected_album_img = image_album;
            displayAlbumTracks(data);
            console.log(data);
        }).catch(error => {
            console.error(error);
        });

}

//with this function we populate the main container with the basic information of the artist (name, followers, cover image)
//and we call the getAlbum function in order to get and display the album list
function displayArtist(data) {
    change = "artist";
    for (const element of data.artists) {
        artistArray.push(element);

    }
    console.log(artistArray);

    changeArtist(artist_position);
    console.log("art: "+artist_position);

}

function changeArtist(id) {
    TITLE.innerText = "Top artists";
    change = "artist";
    let artist = "";
    let img = "";
    let genres = "";
    if ((artistArray[id].images).length > 0) {
        img = artistArray[id].images[0].url
    }
    else {
        img = "assets/img/user_noimg.png"
    }
    for (const element of artistArray[id].genres) {
        genres = genres + element+ ", ";
    }
    artist += `
    <div class="card-result" onclick="getAlbums('${artistArray[id].id}')">
                <div class="picture">   
                    <img class="img-fluid" src="${img}"></img>
                </div>
                <div class="team-content">
                    <h3 class="name">${artistArray[id].name}</h3>
                    <h4 class="title">${genres.slice(0, -2)}</h4>
                </div>
                <div class="social">
                    <h5>${artistArray[id].followers.total} followers</h5>
                </div>
            </div>`;
    //change the display of the different alement within the page
    RESULTS.innerHTML = artist;
}


//with this function we populate the main container with the basic information of the artist (name, followers, cover image)
//and we call the getAlbum function in order to get and display the album list
function displayAlbum(data) {

    albumArray = [];
    change = "album";
    for (const element of data.items) {
        albumArray.push(element);

    }
    console.log(albumArray);

    changeAlbum(album_position);
    console.log("alb: "+album_position);

}

function changeAlbum(id) {
    TITLE.innerText = "Albums";
    change = "album";
    let album = "";
    let img;
    let arts="";
    if ((albumArray[id].images).length > 0) {
        img = albumArray[id].images[0].url
    }
    else {
        img = "assets/img/user_noimg.png"
    }
    for (const element of albumArray[id].artists) {
        arts = arts + element.name+ ", ";
    }
    const date = new Date(albumArray[id].release_date);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    album += `
    <div class="card-result" onclick="getAlbumTracks('${albumArray[id].id}', '${albumArray[id].name}', '${img}')">
                <div class="picture">   
                    <img class="img-fluid" src="${img}"></img>
                </div>
                <div class="team-content">
                    <h3 class="name">${albumArray[id].name}</h3>
                    <h4 class="title">${arts.slice(0, -2)} | Total tracks: ${albumArray[id].total_tracks}</h4>
                </div>
                <div class="social">
                    <h5>Release date: ${formattedDate}</h5>
                </div>
            </div>`;
    //change the display of the different alement within the page
    RESULTS.innerHTML = album;

}

function displayAlbumTracks(data) {

    trackArray = [];
    change = "track";
    for (const element of data.items) {
        trackArray.push(element);

    }
    console.log(trackArray);

    changeAlbumTracks(track_position);
    console.log("tra: "+track_position);

}

function changeAlbumTracks(id) {
    console.log(selected_album_img);
    TITLE.innerText = artist_selected_album;
    change = "track";
    let track = "";
    let duration = msToTime(trackArray[id].duration_ms);
    track += `
    <div class="card-result">
                <div class="picture">   
                    <img class="img-fluid" src="${selected_album_img}"></img>
                </div>
                <div class="team-content">
                    <h3 class="name">${trackArray[id].track_number}. ${trackArray[id].name}</h3>
                    <h4 class="title">Duration: ${duration}</h4>
                </div>
                <div class="social">
                    <a href="${trackArray[id].external_urls.spotify}" target="_blank"><img src="assets/img/listen_btn.png"></a>
                </div>
            </div>`;
    //change the display of the different alement within the page
    RESULTS.innerHTML = track;

}

//it cathches the error when the search gives no results and displays a specific page/information
function displayError(err) {
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
ARTIST.addEventListener("click", function () {
    getArtist('2eFv7NVs8R6Go7msuqikeg', '25MkkfEousyfp2eyh38FUl', '19HiWVd2g0XyJstBsbW2Qm', '5Nydhpz1rcPbgM0fYvLxhz', '1h5O32I1o0VOnpLmKXLfRa', '2pboyZFylWoAL86o6E1gDo', '6q8f3fxaWqkXzkbxtKOzYF', '4l0PmbNvFq3m5JaUuAPbcB', '6bMul6rmRS03x38tWKYifO', '1Ij5ZIGlPTkoZibay58zHe', '3hYLJPJuDyblFKersEaFd6', '396Jr76018oUMR6QBnqT8T', '6RdcIWVKYYzNzjQRd3oyHS');

})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//the actions done by clicking on the Home button on the sidebar
CREDITS.addEventListener("click", function () {
    if (change === "album") {
        LUCKYIMG.style.display = "none";
        if (album_position < albumArray.length - 1) {
            album_position++;
            console.log("alb: "+album_position);
        }
        else {
            album_position = 0;
        }

        changeAlbum(album_position);
    }
    else if (change === "artist") {
        LUCKYIMG.style.display = "none";
        if (artist_position < artistArray.length - 1) {
            artist_position++;
            console.log("art:" + artist_position);
        }
        else {
            artist_position = 0;
        }

        changeArtist(artist_position);
    }
    else if (change === "track") {
        LUCKYIMG.style.display = "none";
        if (track_position < trackArray.length - 1) {
            track_position++;
            console.log("tra:" + track_position);
        }
        else {
            track_position = 0;
        }

        changeAlbumTracks(track_position);
    }
})
UP.addEventListener("click", function () {
    if(change === "album"){
        LUCKYIMG.style.display = "none";
        changeArtist(artist_position);
        album_position = 0;
    }
    else if(change === "track"){
        LUCKYIMG.style.display = "none";
        changeAlbum(album_position);
        track_position = 0;
    }
    else {
        console.log("No more up!");
    }
})

HOME.addEventListener("click", function(){
    LUCKYIMG.style.display = "none";
    TITLE.innerText ="";
    RESULTS.innerHTML = `
        <img src="assets/img/welcome_page.png" style="width: 30rem; height: auto; margin: 0 auto;">
    `;
})

LUCKY.addEventListener("click", function () {
    if (change === "artist") {
        console.log(artistArray.length-1 + " " + getRandomInt(artistArray.length-1));
        artist_position = getRandomInt(artistArray.length-1);
        changeArtist(artist_position);
        LUCKYIMG.style.display = "flex";
    }
    else if (change === "album") {
        console.log(albumArray.length-1 + " " + getRandomInt(albumArray.length-1));
        album_position = getRandomInt(albumArray.length-1);
        changeAlbum(album_position);
        LUCKYIMG.style.display = "flex";
    }
    else if (change === "track") {
        console.log(trackArray.length-1 + " " + getRandomInt(trackArray.length-1));
        track_position = getRandomInt(trackArray.length-1);
        changeAlbumTracks(track_position);
        LUCKYIMG.style.display = "flex";
    }
    else {
        console.log("not lucky");
        change="";
    }
})


