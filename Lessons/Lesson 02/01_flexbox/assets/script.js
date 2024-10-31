let clicks = 0

const BUTTON = document.getElementById("button") 

BUTTON.addEventListener("click",() => {
    clicks = clicks + 1
    console.log("click " + clicks)
})