const BUTTON = document.getElementById("button") 
const CONTAINER = document.getElementById("container")

const TEXT_INPUT = document.getElementById("text_input")
const COLOR_INPUT = document.getElementById("color_input")

const ERASE = document.getElementById("erase")


BUTTON.addEventListener("click",() => {
    console.log("click")

    let user_input = TEXT_INPUT.value
    let user_color_input = COLOR_INPUT.value

    const BLOCK = document.createElement("div")
    BLOCK.textContent = user_input
    BLOCK.classList.add("item")
    BLOCK.style.backgroundColor = user_color_input

    CONTAINER.appendChild(BLOCK)

})

ERASE.addEventListener("click",() => {
    console.log("erase")

    const ELEMENTS = document.getElementById("container")
    ELEMENTS.innerHTML = ""
})