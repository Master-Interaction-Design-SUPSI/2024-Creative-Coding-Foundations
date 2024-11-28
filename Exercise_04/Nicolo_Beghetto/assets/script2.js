const TEAMS = document.getElementById("team");
const backLink = document.querySelector('.back-link');

const NBA_TEAMS = 'https://api.balldontlie.io/v1/teams';
const NBA_PLAYERS = 'https://api.balldontlie.io/v1/players?team_ids[]=';

const MY_API_KEY = "5fa3afdd-3188-4e69-ad96-61069899b257"

async function getTeams() {
    const authOptions = {
        url: NBA_TEAMS,
        method: 'GET',
        headers: {
            'Authorization': MY_API_KEY
        }
    };

    fetch(authOptions.url, authOptions)
        .then(response => response.json())
        .then(reply => {
            displayTeam(reply);
            console.log(reply);
        }).catch(error => {
            //displayError(error);
            console.error(error);
        });

}

getTeams();
async function getPlayers(id) {
    const authOptions = {
        url: NBA_PLAYERS+id,
        method: 'GET',
        headers: {
            'Authorization': MY_API_KEY
        }
    };

    fetch(authOptions.url, authOptions)
        .then(response => response.json())
        .then(reply => {
            displayPlayers(reply, id);
            console.log(reply);
        }).catch(error => {
            //displayError(error);
            console.error(error);
        });

}


function displayTeam(team) {
    backLink.style.display = "none";
    let teams = "";
    for (const element of team.data) {
        if (element.city != "") {
            teams += `
            <div class="box" onclick="getPlayers('${element.id}')"><img src="img/${element.abbreviation}.png" alt=""></div>
        `;
        }
    }
    TEAMS.innerHTML = teams;
}

function displayPlayers(data, team) {
    backLink.style.display = "flex";
    let teams = "";
    for (const element of data.data) {
            console.log (element.abbreviation);
       teams += `
            <div class="box-player">
            <h2><strong>Name:</strong>${element.first_name} ${element.last_name}</h2>
            <p><strong>Jersey:</strong>${element.jersey_number}</p>
            <p><strong>Position:</strong>${element.position}</p>
            <p><strong>Draft Year:</strong>${element.draft_year}</p>
            <p><strong>College:</strong>${element.college}</p>
            </div>
        `;
    }
    TEAMS.innerHTML = teams;
}


  
  
