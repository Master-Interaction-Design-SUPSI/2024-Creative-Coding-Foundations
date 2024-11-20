const tabsContainer = document.querySelector('.tabs');
const tabContentContainer = document.querySelector('.tab-content');
const shoppingList = document.getElementById('shopping-list');
const addItemInput = document.getElementById('item-input');
const addItemBtn = document.getElementById('add-item-btn');

// Define an array of categories, each with a name and a list of products
const categories = [
    {
        name: 'Fruits & Vegetables',
        products: [
            { name: 'Apple', image: 'https://img.icons8.com/color/48/000000/apple.png' },
            { name: 'Banana', image: 'https://img.icons8.com/color/48/000000/banana.png' },
            { name: 'Orange', image: 'https://img.icons8.com/color/48/000000/orange.png' },
            { name: 'Grapes', image: 'https://img.icons8.com/color/48/000000/grapes.png' },
            { name: 'Carrot', image: 'https://img.icons8.com/color/48/000000/carrot.png' },
            { name: 'Broccoli', image: 'https://img.icons8.com/color/48/000000/broccoli.png' },
            { name: 'Lettuce', image: 'https://img.icons8.com/color/48/000000/lettuce.png' },
            { name: 'Cucumber', image: 'https://img.icons8.com/color/48/000000/cucumber.png' }
        ]
    },
    {
        name: 'Dairy',
        products: [
            { name: 'Milk', image: 'https://img.icons8.com/color/48/000000/milk-bottle.png' },
            { name: 'Cheese', image: 'https://img.icons8.com/color/48/000000/cheese.png' },
            { name: 'Butter', image: 'https://img.icons8.com/color/48/000000/butter.png' },
            { name: 'Yogurt', image: 'https://img.icons8.com/color/48/000000/yogurt.png' },
            { name: 'Eggs', image: 'https://img.icons8.com/color/48/000000/eggs.png' }
        ]
    },
    {
        name: 'Bakery',
        products: [
            { name: 'Bread', image: 'https://img.icons8.com/color/48/000000/bread.png' },
            { name: 'Bagels', image: 'https://img.icons8.com/color/48/000000/bagel.png' },
            { name: 'Croissant', image: 'https://img.icons8.com/color/48/000000/croissant.png' },
            { name: 'Pancake', image: 'https://img.icons8.com/color/48/000000/pancake.png' },
            { name: 'Donut', image: 'https://img.icons8.com/color/48/000000/doughnut.png' }
        ]
    },
    {
        name: 'Meat & Seafood',
        products: [
            { name: 'Salmon', image: 'https://img.icons8.com/color/48/000000/fish.png' },
            { name: 'Beef Steak', image: 'https://img.icons8.com/color/48/000000/steak.png' },
            { name: 'Bacon', image: 'https://img.icons8.com/color/48/000000/bacon.png' }
        ]
    },
    {
        name: 'Frozen Foods',
        products: [
            { name: 'Frozen Pizza', image: 'https://img.icons8.com/color/48/000000/pizza.png' },
            { name: 'Ice Cream', image: 'https://img.icons8.com/color/48/000000/ice-cream-cone.png' },
            { name: 'Frozen Fish', image: 'https://img.icons8.com/color/48/000000/fish-food.png' },
            { name: 'French Fries', image: 'https://img.icons8.com/color/48/000000/french-fries.png' },
        ]
    },
    {
        name: 'Snacks',
        products: [
            { name: 'Chocolate Bar', image: 'https://img.icons8.com/color/48/000000/chocolate-bar.png' },
            { name: 'Popcorn', image: 'https://img.icons8.com/color/48/000000/popcorn.png' },
            { name: 'Cookies', image: 'https://img.icons8.com/color/48/000000/cookie.png' },
            { name: 'Pretzels', image: 'https://img.icons8.com/color/48/000000/pretzel.png' }
        ]
    },
    {
        name: 'Beverages',
        products: [
            { name: 'Orange Juice', image: 'https://img.icons8.com/color/48/000000/orange-juice.png' },
            { name: 'Soda', image: 'https://img.icons8.com/color/48/000000/soda-bottle.png' },
            { name: 'Coffee', image: 'https://img.icons8.com/color/48/000000/coffee-to-go.png' },
            { name: 'Tea', image: 'https://img.icons8.com/color/48/000000/tea.png' },
            { name: 'Mineral Water', image: 'https://img.icons8.com/color/48/000000/water-bottle.png' }
        ]
    },
    {
        name: 'Pantry Items',
        products: [
            { name: 'Pasta', image: 'https://img.icons8.com/color/48/000000/spaghetti.png' },
            { name: 'Rice', image: 'https://img.icons8.com/color/48/000000/rice-bowl.png' },
            { name: 'Olive Oil', image: 'https://img.icons8.com/color/48/000000/olive-oil.png' },
            { name: 'Honey', image: 'https://img.icons8.com/color/48/000000/honey.png' },
        ]
    },
    {
        name: 'Household Supplies',
        products: [
            { name: 'Toilet Paper', image: 'https://img.icons8.com/color/48/000000/toilet-paper.png' },
            { name: 'Laundry Detergent', image: 'https://img.icons8.com/color/48/000000/washing-machine.png' },
        ]
    },
    {
        name: 'Health & Beauty',
        products: [
            { name: 'Shampoo', image: 'https://img.icons8.com/color/48/000000/shampoo.png' },
            { name: 'Toothpaste', image: 'https://img.icons8.com/color/48/000000/toothpaste.png' },
            { name: 'Soap', image: 'https://img.icons8.com/color/48/000000/soap.png' }
        ]
    }
];

let shoppingItems = {};

// Generate tabs for categories
tabsContainer.innerHTML = categories.map((category, index) => 
    `<button onclick="setActiveTab(${index})">${category.name}</button>`
).join('');

// Activate a tab and display products
function setActiveTab(activeIndex) {
    document.querySelectorAll('.tabs button').forEach((tab, index) => {
        tab.classList.toggle('active', index === activeIndex);
    });

    const category = categories[activeIndex];
    tabContentContainer.innerHTML = `
        <div class="product-grid">
            ${category.products.map(product => `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}" style="width: 48px; height: 48px;">
                    <div>${product.name}</div>
                    <button onclick="addItemToList('${product.name}')">Add</button>
                </div>
            `).join('')}
        </div>
    `;
}

// Add an item to the shopping list
function addItemToList(itemName) {
    if (shoppingItems[itemName]) {
        shoppingItems[itemName].count++;
        shoppingItems[itemName].span.textContent = `${itemName} x${shoppingItems[itemName].count}`;
    } else {
        shoppingItems[itemName] = { count: 1 };

        const listItemHTML = `
            <li>
                <input type="checkbox" onchange="this.parentElement.classList.toggle('completed', this.checked)">
                <span>${itemName}</span>
                <button class="remove-button" onclick="removeItemFromList('${itemName}', this)">✖</button>
            </li>
        `;
        shoppingList.insertAdjacentHTML('beforeend', listItemHTML);
        shoppingItems[itemName].span = shoppingList.lastElementChild.querySelector('span');
    }
}

// Remove an item from the shopping list
function removeItemFromList(itemName, button) {
    delete shoppingItems[itemName];
    button.parentElement.remove();
}

// Handle adding custom items from input
addItemBtn.addEventListener('click', () => {
    const itemName = addItemInput.value.trim();
    if (itemName) addItemToList(itemName);
    addItemInput.value = ''; // Clear input after adding
});

// Initialize the first tab as active
setActiveTab(0);
