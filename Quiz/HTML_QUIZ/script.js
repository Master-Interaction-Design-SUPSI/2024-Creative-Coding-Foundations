const codesList = document.getElementsByTagName("code");
const buttonQuizNext = document.getElementById("button-quiz-next");
const buttonHelper = document.getElementById("button-helper");
const buttonNextBlock = document.getElementById("button-next-block");
const sectionHelpers = document.getElementById("helpers");
let currentCodeBlock = 0;

let spanList = codesList[currentCodeBlock].getElementsByTagName("span");


buttonQuizNext.addEventListener('click', ()=> {
    const spanArray = Array.from(spanList);
    spanArray.forEach((element) => {
        element.classList.remove('selected');
    })
    const spanActive = spanList[Math.floor(Math.random()*spanList.length)];
    console.log(spanActive.className);
    spanActive.classList.add('selected');
})

buttonHelper.addEventListener('click', ()=> {
    sectionHelpers.classList.toggle("hidden");
})

buttonNextBlock.addEventListener('click', ()=> {
    codesList[currentCodeBlock].classList.remove("active");
    if(currentCodeBlock < codesList.length - 1) {
        currentCodeBlock++;
    }
    else {
        currentCodeBlock = 0;
    }
    codesList[currentCodeBlock].classList.add("active");
    spanList = codesList[currentCodeBlock].getElementsByTagName("span");
})