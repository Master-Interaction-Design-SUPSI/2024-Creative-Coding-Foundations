
const DATABASE_TEAMS = 'assets/teams-details.json';
const CONTAINER = document.getElementById("container");

async function getTeams() {
    fetch(DATABASE_TEAMS)
        .then(response => response.json())
        .then(data => {
            displayData(data);
            //console.log(data);
        }).catch(error => {
            displayError();
        });
}

async function getTeamsInfo(idTeam) {
    fetch(DATABASE_TEAMS)
        .then(response => response.json())
        .then(data => {
            showDetails(data, idTeam);
            //console.log(data);
        }).catch(error => {
            displayError();
        });
}

getTeams();

function displayError(error) {
    console.error('Error:', error);
    CONTAINER.innerHTML = "Data not available :(";
}

function displayData(data) {
    console.log(data);

    if (!data.teams || data.teams.length === 0) {
        CONTAINER.innerHTML = "No teams found.";
        return;
    }

    let output = '<div class="teams">';

    for (const team of data.teams) {
        output += `
            <div class="team-card" onclick="getTeamsInfo('${team.idTeam}')">
                <img src="${team.strBadge}" alt="${team.strTeam} Badge" class="team-badge">
                <h3>${team.strTeam}</h3>
            </div>
        `; 
    }

    output += '</div>';
    CONTAINER.innerHTML = output;
}

function showDetails(data, teamId) {
    
    for (const team of data.teams) {
        if(team.idTeam === teamId) {
            console.log(team.strTeam);
            CONTAINER.innerHTML = `
            <div class="team-details">
                <a href="http://${team.strWebsite}"><img src="${team.strBadge}" alt="${team.strTeam} Badge" class="team-details-badge"></a>
                <h2>${team.strTeam}</h2>
                <p><strong>Team colors:</strong> 
                    <svg width="12px" height="12px">
                        <rect width="12px" height="12px" x="0" y="0" rx="3" ry="3" style="fill:${team.strColour1};stroke-width:1;stroke:black"/>                        
                    </svg>
                    <svg width="12px" height="12px">
                        <rect width="12px" height="12px" x="0" y="0" rx="3" ry="3" style="fill:${team.strColour2};stroke-width:1;stroke:black"/>                        
                    </svg>
                </p>
                <p><strong>Location:</strong> ${team.strLocation}</p>
                <p><strong>Nickname:</strong> ${team.strKeywords}</p>
                <p><strong>Foundation year:</strong> ${team.intFormedYear}</p>
                <p><strong>Stadium:</strong> ${team.strStadium}</p>
                <p><strong>Stadium capacity:</strong> ${team.intStadiumCapacity}</p>
                <p><strong>Description:</strong> ${team.strDescriptionEN || "Not available"}</p>
                <div class="team-socials">
                <a href="http://${team.strInstagram}" class="social-images"><img src="assets/Instagram_logo_2022.svg.png" alt="Instagram link" style="width:42px;height:42px;"></a>
                <a href="http://${team.strFacebook}" class="social-images"><img src="assets/2021_Facebook_icon.svg.png" alt="Facebook link" style="width:42px;height:42px;"></a>
                <a href="http://${team.strTWitter}" class="social-images"><img src="assets/X_logo_2023.svg.png" alt="X (Twitter) link" style="width:42px;height:42px;"></a>
                <a href="http://${team.strYoutube}" class="social-images"><img src="assets/Youtube_logo.png" alt="Youtube link" style="width:60px;height:42px;"></a>
                
                </div>
                <button onclick="window.location.reload()">Back</button>
            </div>
            `;
        }
        else {
            console.log("no: " + team.strTeam);
        }
        
    }
}
