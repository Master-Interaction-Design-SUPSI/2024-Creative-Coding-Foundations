const clearButton = document.getElementById("clear");
const generateButton = document.getElementById("generate");
const deleteButton = document.getElementById("delete");

const numberInput = document.getElementById("number_input");
const colorInput = document.getElementById("color");

const brickContainer = document.getElementById("brick_container");

generateButton.addEventListener("click", () => {
    console.log("click")
    let user_input = parseInt(numberInput.value);
    let user_color_input = colorInput.value

    if (user_input >= 1 && user_input <= 20) {
        const block = document.createElement("div")
        
        block.style.width = `${user_input}rem`; // Width = typed number in rem
        block.style.height = "2rem"; // Same height for all blocks
        block.style.backgroundColor = user_color_input; // User chooses the color of the block
        brickContainer.prepend(block);
    
    } else {
        alert("Please enter a number between 1 and 20.");
    }
} )

deleteButton.addEventListener("click", () => {
    console.log("click")
    brickContainer.innerHTML = "";
});

clearButton.addEventListener("click", () => {
    console.log("click")
    numberInput.value = "";
    colorInput.value = "#233671";
})
