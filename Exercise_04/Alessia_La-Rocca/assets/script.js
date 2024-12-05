const content = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const comicsFilter = document.getElementById('comicsFilter');
const sortFilter = document.getElementById('sortFilter');

let data = []; // To store the fetched JSON data

// Fetch data from the JSON endpoint
fetch('assets/marvel_data.json') // Adjust the path to your JSON file if needed
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jsonData => {
        data = jsonData.data.results; // Access the 'results' array from your JSON data
        displayData(data); // Display the initial data
    })
    .catch(error => {
        console.error('Error fetching the data:', error);
        content.innerHTML = '<p>Failed to load data. Please try again later.</p>';
    });

function displayData(filteredData) {
    content.innerHTML = ''; // Clear previous content
    
    if (filteredData.length === 0) {
        content.innerHTML = '<p>No results found.</p>';
        return;
    }

    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Construct the image URL using 'thumbnail' path and extension
        const imageUrl = `${item.thumbnail.path}.${item.thumbnail.extension}`;

        card.innerHTML = `
            <img src="${imageUrl || 'https://via.placeholder.com/150'}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>${item.description || 'No description available.'}</p>
            <p><strong>Comics Available:</strong> ${item.comics.available}</p>
        `;
        content.appendChild(card);
    });
}

function filterData() {
    const searchText = searchInput.value.toLowerCase();
    const selectedComicsFilter = comicsFilter.value;
    const selectedSort = sortFilter.value;

    // Filter characters based on search text and comics availability
    let filteredData = data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText);
        let matchesComics;

        // Filter based on comics availability
        if (selectedComicsFilter === 'all') {
            matchesComics = true;
        } else if (selectedComicsFilter === 'withComics') {
            matchesComics = item.comics.available > 0;
        } else if (selectedComicsFilter === 'withoutComics') {
            matchesComics = item.comics.available === 0;
        }

        return matchesSearch && matchesComics;
    });

    // Sort the filtered data based on comics available
    if (selectedSort === 'asc') {
        filteredData.sort((a, b) => a.comics.available - b.comics.available);
    } else if (selectedSort === 'desc') {
        filteredData.sort((a, b) => b.comics.available - a.comics.available);
    }

    displayData(filteredData);
}

let debounceTimeout;

function debounce(func, delay) {
    return function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(func, delay);
    };
}

// Event listeners for interactivity
searchInput.addEventListener('input', debounce(filterData, 300));
comicsFilter.addEventListener('change', filterData);
sortFilter.addEventListener('change', filterData);
