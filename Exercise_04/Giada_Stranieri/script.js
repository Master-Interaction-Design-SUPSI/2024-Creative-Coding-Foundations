const API_URL = 'https://api.pokemontcg.io/v2/cards';
const visualizationContainer = document.getElementById('visualization-container');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const retryButton = document.getElementById('retryButton');


const typeColors = {
    Water: '#3498db',
    Fire: '#e74c3c',
    Grass: '#2ecc71',
    Psychic: '#9b59b6',
    Electric: '#f39c12',
    Fighting: '#e67e22',
    Dark: '#34495e',
    Fairy: '#f1c40f',
    Dragon: '#8e44ad',
    Normal: '#95a5a6',
};


const rarityShapes = {
    Common: 'shape-small',
    Uncommon: 'shape-large',
    Rare: 'shape-large',
    UltraRare: 'shape-holo',
};


async function fetchCards() {
    try {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        const response = await fetch(API_URL);
        const data = await response.json();

        
        visualizationContainer.innerHTML = '';

        if (data.data && data.data.length > 0) {
            createVisualization(data.data);
        } else {
            displayNoDataMessage();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        displayNoDataMessage();
    } finally {
        loadingMessage.style.display = 'none';
    }
}


function createVisualization(cards) {
    cards.forEach(card => {
        const cardType = card.types ? card.types[0] : 'Normal';
        const cardRarity = card.rarity || 'Common';

        const typeColor = typeColors[cardType] || '#95a5a6';
        const rarityClass = rarityShapes[cardRarity] || 'shape-small';

        const visualElement = document.createElement('div');
        visualElement.classList.add('visual-element');

        const shapeElement = document.createElement('div');
        shapeElement.classList.add('shape', rarityClass);
        shapeElement.style.backgroundColor = typeColor;

        const shapeText = document.createElement('span');
        shapeText.classList.add('name');
        shapeText.textContent = card.name || 'Unknown Card';
        
        shapeElement.appendChild(shapeText);
        visualElement.appendChild(shapeElement);
        visualizationContainer.appendChild(visualElement);

        
        visualElement.addEventListener('click', () => {
            alert(`Card Name: ${card.name}\nType: ${cardType}\nRarity: ${cardRarity}`);
        });
    });
}


function displayNoDataMessage() {
    visualizationContainer.innerHTML = '';
    errorMessage.style.display = 'block';
}


retryButton.addEventListener('click', () => {
    errorMessage.style.display = 'none';
    fetchCards();
});


fetchCards();
