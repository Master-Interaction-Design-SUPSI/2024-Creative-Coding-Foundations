// filtering only popular shows from the paginated big api
/* const API_URL = "https://api.tvmaze.com/shows"
const POPULAR_SHOWS = [
    "Breaking Bad", "Friends", "How I Met Your Mother", "Grey's Anatomy", "The Office", 
    "Game of Thrones", "Stranger Things", "The Mandalorian", "The Crown", "The Witcher", 
    "The Simpsons", "The Walking Dead", "Narcos", "Money Heist", "Big Bang Theory", 
    "Supernatural", "Peaky Blinders", "Fargo", "Westworld", "Lucifer", "Sherlock", 
    "Dark", "Better Call Saul", "Chernobyl", "The Boys", "House of Cards", "The Flash", 
    "Vikings", "Dexter", "The Haunting of Hill House", "Rick and Morty", "The Umbrella Academy", 
    "One Piece", "Ozark", "The Good Doctor", "This Is Us", "The Handmaid's Tale", 
    "Castle Rock", "True Detective", "Black Mirror", "Brooklyn Nine-Nine", "Narcos: Mexico", 
    "The 100", "Lost", "Mindhunter", "Fleabag", "The Vampire Diaries", "Arrow", "Doctor Who", 
    "The Expanse", "The Queen's Gambit", "Hannibal", "Sons of Anarchy", "Battlestar Galactica", 
    "The Good Place", "One Piece", "Fargo", "Stranger Things", "Game of Thrones", 
    "Friends", "Rick and Morty", "The Mandalorian", "The Haunting of Hill House", "The Good Place", 
    "The Office", "Sherlock", "Westworld", "The Umbrella Academy", "Lucifer", "Dark", "The Walking Dead", 
    "Big Mouth", "The Simpsons", "Brooklyn Nine-Nine", "The Good Doctor", "The Marvelous Mrs. Maisel", 
    "Black Mirror", "The Flash", "Vikings", "Stranger Things", "Better Call Saul", "Money Heist", 
    "Lost", "The Expanse", "The Vampire Diaries", "One Piece", "Fargo", "Chernobyl", 
    "The Office", "Narcos", "Ozark", "The Handmaid's Tale", "Big Bang Theory", "Supernatural", 
    "Fleabag", "True Detective", "Sherlock", "Doctor Who", "Breaking Bad", "Money Heist", 
    "Narcos: Mexico", "The Boys", "The Mandalorian", "True Detective", "Fargo", "Black Mirror", 
    "The Crown", "Money Heist", "The Flash", "Fleabag", "The Office", "Stranger Things", "Vikings", 
    "The Expanse", "House of Cards", "The Haunting of Hill House", "The Umbrella Academy", 
    "Supernatural", "The Witcher", "The Simpsons", "The Walking Dead", "Hannibal", 
    "Superstore", "The Flash", "The Mindy Project", "Bates Motel", "Big Little Lies", 
    "The Outsider", "The X-Files", "The 100", "Bojack Horseman", "Narcos", "Prison Break", 
    "Black Lightning", "The Politician", "The Deuce", "The Magicians", "The Fosters", 
    "Legion", "The Resident", "Outlander", "Teen Wolf", "The Morning Show", "The Sinner", 
    "Schitt's Creek", "The New Pope", "The Leftovers", "Halt and Catch Fire", "The Good Fight", 
    "Euphoria", "Money Heist", "Russian Doll", "A Discovery of Witches", "The Falcon and the Winter Soldier", 
    "The Great", "The Night Manager", "Tales from the Loop", "Lovecraft Country", "Watchmen", 
    "The Terror", "Kingdom", "The Mandalorian", "Ted Lasso", "The Boys", "Curb Your Enthusiasm", "The Newsroom", "Narcos: Mexico", "Supernatural", "Shameless", 
    "The Last Dance", "The Flash", "Breaking Bad", "Big Bang Theory", "The Middle", 
    "The Good Place", "The Crown", "Rick and Morty", "House of Cards", "The Umbrella Academy", 
    "Fargo", "The Witcher", "Black Mirror", "The Marvelous Mrs. Maisel", "How I Met Your Mother", 
    "Dexter", "Castle", "The Handmaid's Tale", "Lucifer", "Superstore", "Unorthodox", "The Mandalorian", 
    "Orange is the New Black", "Friends", "The Umbrella Academy", "True Detective", "Lucifer", 
    "Money Heist", "Vikings", "Peaky Blinders", "The Haunting of Hill House", "Westworld"
];

// see the number of listed shows
// console.log(POPULAR_SHOWS);

//removing duplicate shows
const noRepeatingShows = [...new Set(POPULAR_SHOWS)];
// console.log(noRepeatingShows);
  
  
// searching for the popular shows in all the pages and creating an array

// fetching pages
  const fetchShowsPage = async (page) => {
    const response = await fetch(`https://api.tvmaze.com/shows?page=${page}`);
    const data = await response.json();
    //console.log(data);
    return data;
};

// fetchShowsPage(5);


// searching for the shows by name
const ALL_FETCHED_SHOWS = [];

const searchShowByName = async (showName) => {
    let currentPage = 0;
    let foundShow = null;

    while (!foundShow) {
        const allShows = await fetchShowsPage(currentPage);

        if (allShows.length === 0) {
            // console.log(`No more shows found.`);
            break;
        }

        foundShow = allShows.find(show => show.name.toLowerCase() === showName.toLowerCase());
        if (!foundShow) {
            currentPage++;
        }
    }

    if (foundShow) {
        console.log(`Found show ${showName}`, foundShow);
        ALL_FETCHED_SHOWS.push(foundShow);
    } else {
        console.log(`Show "${showName}" not found.`);
    }
};


const searchShows = async () => {
    for (const show of noRepeatingShows) {
        // console.log(`Searching for: ${show}`);
        await searchShowByName(show);
    }
};

searchShows();
console.log(ALL_FETCHED_SHOWS); */
// copied cleaned shows array into the shows.json file




// creating array for the game - show name1[image url, summary], show name2[image2 url, summary2]...
const ALL_SHOWS = '/assets/shows.json';

fetch(ALL_SHOWS) 
  .then(response => response.json()) 
  .catch(error => console.error('Error:', error)); 

async function createArrays() {
    let response = await fetch(ALL_SHOWS); 
    let data = await response.json();

    let showsGame = {};

    for (let i = 0; i < data.length; i++) {
        let showName = data[i].name;
        let summary = data[i].summary;
        let image = data[i].image.original;

        showsGame[showName] = [image, summary];
    }

    // console.log(shows);

    // Cleaning up the summaries - removing bold and italic parts of strings to get the show names and book names to use the summaries as hints
    for (let showName in showsGame) {
      
            let cleanSummary = showsGame[showName][1]
                .replace(/<b>.*?<\/b>/g, 'The TV Show')
                .replace(/<i>.*?<\/i>/g, '');
            showsGame[showName][1] = cleanSummary;
        
    }

    // shows with summaries for hints
    console.log('Cleaned Shows:', showsGame);
}

createArrays();
// copied shows array ready for the game in the showsGame.json file
