const API_URL = 'assets/henna.json';

fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
        hennaData = data.hennaStyles;
        initializeDefaultStyles();
        renderHennaStyle(currentStyle);
        renderAllDesignElements();
    })
    .catch((error) => console.error("Error loading JSON:", error));


let hennaData = null;
let currentStyle = "Indian Henna"; 
let selectedStyles = {};
let rotationSettings = {}; 



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


function initializeDefaultStyles() {
    const style = hennaData.find((style) => style.title === currentStyle);
    if (!style) {
        console.error(`Style "${currentStyle}" not found`);
        return;
    }

    const elements = Object.keys(style.designElements);
    elements.forEach((elementName) => {
        selectedStyles[elementName] = 1;
        if (elementName === "FloralVines") {
            rotationSettings[elementName] = 12;
        } else if (elementName === "humps") {
            rotationSettings[elementName] = 60; 
        } else if (elementName === "Ambi") {
            rotationSettings[elementName] = 8;
        } else if (elementName === "Islamic Art") {
            rotationSettings[elementName] = 20; 
        } else if (elementName === "Nuqat") {
            rotationSettings[elementName] = 18;
        } else {
            rotationSettings[elementName] = 1;
        }
    });
}


function renderHennaStyle(styleName) {
    const style = hennaData.find((style) => style.title === styleName);
    if (!style) {
        console.error(`Style "${styleName}" not found in JSON.`);
        return;
    }

    document.getElementById("title").innerText = style.title;
    document.getElementById("about").innerText = `${style.description.about}`;
    document.getElementById("history").innerText = `${style.description.history}`;
    document.getElementById("religion").innerText = `${style.description.religion}`;
    document.getElementById("country").innerText = `${style.description.country}`;

    const elementsContainer = document.getElementById("design-elements");
    elementsContainer.innerHTML = "";

    const elements = Object.keys(style.designElements);
    elements.forEach((elementName, index) => {
        const element = style.designElements[elementName];
        const elementDiv = document.createElement("div");
        elementDiv.id = `element${index + 1}`;

        const elementTitle = document.createElement("h3");
        elementTitle.innerText = elementName;
        elementDiv.appendChild(elementTitle);

        const elementDescription = document.createElement("p");
        elementDescription.innerText = element.description;
        elementDiv.appendChild(elementDescription);

        const dropdown = document.createElement("select");
        dropdown.classList.add("design-dropdown");
        dropdown.dataset.element = elementName;

        element.images.forEach((image, idx) => {
            const option = document.createElement("option");
            option.value = idx + 1;
            option.innerText = `Style ${idx + 1}`;
            if (selectedStyles[elementName] === idx + 1) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });

        elementDiv.appendChild(dropdown);

        if (element.rotation) {
            const rotationLabel = document.createElement("label");
            rotationLabel.innerText = "Rotation:";
            elementDiv.appendChild(rotationLabel);

            const rotationInput = document.createElement("input");
            rotationInput.type = "number";
            rotationInput.classList.add("rotation-input");
            rotationInput.dataset.element = elementName;
            rotationInput.value = rotationSettings[elementName] || element.rotation;
            elementDiv.appendChild(rotationInput);
        }

        elementsContainer.appendChild(elementDiv);
    });

   
    const audioPlayer = document.createElement("audio");
    audioPlayer.id = "hennaAudio";
    audioPlayer.controls = true;
    audioPlayer.style.width = "100%";
    audioPlayer.style.display = "none";
    elementsContainer.appendChild(audioPlayer);
}

//first JS code - presentation -
function renderAllDesignElements() {
    const style = hennaData.find((style) => style.title === currentStyle);
    if (!style) {
        console.error(`Style "${currentStyle}" not found`);
        return;
    }

    const elements = Object.keys(style.designElements);
    const handImage = new Image();
    handImage.src = "assets/images/indian/PLAIN/hand.png"; 

    handImage.onload = () => {
        canvas.width = handImage.width;
        canvas.height = handImage.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(handImage, 0, 0, canvas.width, canvas.height);

        
        elements.forEach((elementName) => {

            const element = style.designElements[elementName];

            const layerStyle = selectedStyles[elementName] || 1; 
            const designImage = new Image();

            if (element.images[layerStyle - 1]) {
                designImage.src = element.images[layerStyle - 1];

            } else {
                console.error(`Image not found for ${elementName}, Style ${layerStyle}`);
                return;
            }

            designImage.onload = () => {
                const rotationValue = rotationSettings[elementName] || 1; 
                console.log("Drawing", elementName, "with rotation", rotationValue);
                drawDesign(designImage, elementName, rotationValue);
            };
        });
    };
}

//second JS code - presentation -
function drawDesign(designImage, elementName, rotationCount) {
    const centerX = canvas.width / 2 - 90;
    const centerY = canvas.height / 2 + 50;
    const size = 100; //to make them center

    if (elementName !== "Tikki" && elementName !== "Hamsa" && elementName !== "Musallas") {
        let radius, defaultRotations;
        

        if (elementName === "FloralVines" || elementName === "Nuqat") {
            radius = 140;
            defaultRotations = 12;
        } else if (elementName === "humps") {
            radius = 60;
            defaultRotations = 60;
        } else if(elementName === "Ambi") {
            radius = 86;
            defaultRotations = 8;
        } else if (elementName === "Islamic Art") {
            radius = 100;
            defaultRotations = 10;
        }

        const numImages = rotationCount || defaultRotations;
        const angleIncrement = (360 / numImages) * Math.PI / 180;
        console.log("numImages", numImages, "angleIncrement", angleIncrement);

        for (let i = 0; i < numImages; i++) {
            const angle = i * angleIncrement;
            const x = centerX + radius * Math.cos(angle) - designImage.width / 2;
            const y = centerY + radius * Math.sin(angle) - designImage.height / 2;

            ctx.save();
            ctx.translate(x + designImage.width / 2, y + designImage.height / 2);
            ctx.rotate(angle + Math.PI / 2);
            ctx.drawImage(designImage, -designImage.width / 2, -designImage.height / 2, designImage.width, designImage.height);
            ctx.restore();
        }
    } else {
        ctx.drawImage(designImage, centerX - size / 2, centerY - size / 2, size, size);
    }
}
function handleMusic(styleName) {
    const style = hennaData.find(style => style.title === styleName);
    const audioPlayer = document.getElementById('hennaAudio');
  
    if (style && style.music && style.music.length > 0) {
      audioPlayer.src = style.music[0]; 
      audioPlayer.style.display = 'block'; 
    } else {
      audioPlayer.style.display = 'none'; 
    }
  }


document.addEventListener("change", (e) => {
    if (e.target.classList.contains("design-dropdown")) {
        const elementName = e.target.dataset.element;
        const selectedStyle = parseInt(e.target.value, 10);
        selectedStyles[elementName] = selectedStyle;
        renderAllDesignElements();
    } else if (e.target.classList.contains("rotation-input")) {
        const elementName = e.target.dataset.element;
        const rotationValue = parseInt(e.target.value, 10);
        rotationSettings[elementName] = rotationValue;
        renderAllDesignElements();
    }
});


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("style-btn")) {
        const buttons = document.querySelectorAll('.style-btn');
        buttons.forEach(button => button.classList.remove('selected'));
        e.target.classList.add('selected');
        currentStyle = e.target.dataset.style;
        initializeDefaultStyles();
        renderHennaStyle(currentStyle);
        renderAllDesignElements();

        // Audio
        const style = hennaData.find(s => s.title === currentStyle);
        if (style && style.music && style.music.length > 0) {
            const audioPlayer = document.getElementById("hennaAudio");
            audioPlayer.src = style.music[0];
            audioPlayer.style.display = 'block';
            
        }
        
    }
});