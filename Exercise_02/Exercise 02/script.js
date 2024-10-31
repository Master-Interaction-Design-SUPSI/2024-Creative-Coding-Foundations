const BUTTON = document.getElementById("button");
const CONTAINER = document.getElementById("container");
const TEXT_INPUT = document.getElementById("text_input");
const CATEGORY_INPUT = document.getElementById("category_input");

const categoryColors = {
    "Shopping": "#f9e1e0",
    "Appointments": "#e0f7fa",
    "Places to Visit": "#e1f4e0",
    "Movies to Watch": "#f9f4e0",
    "Books to Read": "#e0e4f9",
    "Personal Goals": "#f9e0f0",
    "Work Tasks": "#e1e0f9"
};

BUTTON.addEventListener("click", () => {
    let userInput = TEXT_INPUT.value.trim();
    let selectedCategory = CATEGORY_INPUT.value;

    if (userInput && selectedCategory) {
        const block = document.createElement("div");
        block.classList.add("item");
        block.style.backgroundColor = categoryColors[selectedCategory];

        const text = document.createElement("p");
        text.textContent = userInput;
        block.appendChild(text);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", () => {
            block.remove();
        });
        block.appendChild(deleteButton);

        CONTAINER.appendChild(block);
        TEXT_INPUT.value = ""; // Clear input field
        CATEGORY_INPUT.value = ""; // Reset category selection
    }
});
