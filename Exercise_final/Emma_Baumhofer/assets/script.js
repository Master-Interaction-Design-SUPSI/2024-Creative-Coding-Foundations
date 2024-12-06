const CANVAS = document.getElementById("canvas");
const CONTAINER = document.getElementById("canvas-container");
const ctx = CANVAS.getContext("2d");
const BUTTON = document.getElementById("open-mic");
const bookSelector = document.getElementById("book-selector");
const rightColumn = document.getElementById("right-column");
// Dynamically set the canvas width and height
function resizeCanvas() {
    CANVAS.width = CONTAINER.offsetWidth;
    CANVAS.height = CONTAINER.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
// Color palettes for each book in arrays
const colorPalettes = {
    "1_The_Wonderful_Wizard_of_Oz": ["#B45E78", "#8B9855", "#9D9C6F", "#F9EFC4"],
    "2_The_Marvelous_Land_of_Oz": ["#4E76CE", "#4F8C5C", "#C67475", "#C6C6C6"],
    "3_Ozma_of_Oz": ["#F29B75", "#65B4E0", "#F4DF76", "#F2D3A0"],
    "4_Dorothy_and_the_Wizard_in_Oz": ["#8DB2AF", "#E58D51", "#EACA44", "#DBC3A1"],
    "5_The_Road_to_Oz": ["#609363", "#D3837D", "#ABA659", "#EFE389"],
    "6_The_Emerald_City_of_Oz": ["#9B9B5C", "#E27774", "#809278", "#E4CEC1"],
    "7_The_Patchwork_Girl_of_Oz": ["#729164", "#E29086", "#BFAC3A", "#E2DB7D"],
    "8_Tik-Tok_of_Oz": ["#E57D77", "#F49C76", "#C2D3CC", "#F7DD8B"],
    "9_The_Scarecrow_of_Oz": ["#3B8BA3", "#688268", "#D88880", "#E8D6C8"],
    "10_Rinkitink_in_Oz": ["#9DE09D", "#E08158", "#DDAF4A", "#B2D3C2"],
    "11_The_Lost_Princess_of_Oz": ["#627DA5", "#627DA5", "#D3898A", "#C1F3FD"],
    "12_The_Tin_Woodman_of_Oz": ["#579B7F", "#D67682", "#D6A380", "#B1C4DB"],
    "13_The_Magic_of_Oz": ["#92996B", "#DB8367", "#D8A127", "#E5C3AD"],
    "14_Glinda_of_Oz": ["#F7C786", "#B7CCBF", "#C6A595", "#E7DCC0"]
};
// Variable for current palette for dynamic handling (depends on book choice)
let currentPalette = [];
// Handle scroll-based background color transitions
function handleScroll() {
    if (!currentPalette.length) return; // Skip if no palette is set
    const scrollHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const scrollPosition = window.scrollY / scrollHeight; // Get scroll percentage
    // Increase the frequency of transitions
    const transitionFactor = 16; // Increase this value for more frequent transitions
    const adjustedPosition = scrollPosition * transitionFactor;
    
    // Calculate the transition between colors
    const colorIndex = Math.floor(adjustedPosition) % currentPalette.length; // Cycle through colors
    const nextColorIndex = (colorIndex + 1) % currentPalette.length; // Loop back to the start
    const transition = adjustedPosition % 1; // Fractional part determines blending
 
    // Find colors in between current and next color
    const currentColor = currentPalette[colorIndex];
    const nextColor = currentPalette[nextColorIndex];
    const blendedColor = blendColors(currentColor, nextColor, transition);
    // Apply the blended color to the html element
    document.documentElement.style.backgroundColor = blendedColor;
    console.log("Blended color:", blendedColor); // Debugging
}
// Helper function to do the mathematical blending of the two colors identified above 
function blendColors(color1, color2, ratio) {
    if (!color1 || !color2) return color1 || color2 || "#FFFFFF"; // Fallback to white
    const hexToRgb = hex => hex.match(/\w\w/g).map(x => parseInt(x, 16));
    const rgbToHex = rgb => `#${rgb.map(x => x.toString(16).padStart(2, "0")).join("")}`;
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    const blendedRgb = [
        Math.round(r1 + (r2 - r1) * ratio),
        Math.round(g1 + (g2 - g1) * ratio),
        Math.round(b1 + (b2 - b1) * ratio)
    ];
    return rgbToHex(blendedRgb);
}

const openingMessage = document.getElementById("opening-message");
const coverImage = document.getElementById("cover-image");
const attributionContainer = document.getElementById("attribution-container");

bookSelector.addEventListener("change", () => {
    const selectedBook = bookSelector.value;

    if (!selectedBook || selectedBook === "The Oz books...") {
        // Show the opening message and attribution image
        openingMessage.classList.remove("hidden");
        attributionContainer.classList.remove("hidden");
        coverImage.style.display = "none";
    } else {
        // Hide the opening message and attribution image
        openingMessage.classList.add("hidden");
        attributionContainer.classList.add("hidden");
        coverImage.style.display = "block";
    
        // Load book content and cover image
        loadBookContent(selectedBook);
        loadCoverImage(selectedBook);
    }    
});

// Initialize the default background color on app load
document.documentElement.style.backgroundColor = "#e9d8be";
// Detect dropdown selection and set the palette
bookSelector.addEventListener("change", () => {
    const selectedBook = bookSelector.value;
    if (!selectedBook || selectedBook === "Select a book...") {
        // Handle default selection
        currentPalette = []; // Clear palette
        document.documentElement.style.backgroundColor = "#e9d8be"; // Set default background color
        window.removeEventListener("scroll", handleScroll); // Remove scroll event listener
        rightColumn.innerHTML = "<p>Select a book to see its content.</p>"; // Optional: Reset content
        // Clear cover image
        const coverImage = document.getElementById("cover-image");
        if (coverImage) coverImage.remove();
        return;
    }

    // Handle specific book selection
    currentPalette = colorPalettes[selectedBook] || []; // Update the current palette
    if (currentPalette.length) {
        console.log(`Applying palette for ${selectedBook}:`, currentPalette); // Debugging
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Trigger once to apply initial color
    } else {
        window.removeEventListener("scroll", handleScroll); // Remove listener if no palette
        document.documentElement.style.backgroundColor = ""; // Reset background
    }
    // Load book content
    loadBookContent(selectedBook);
     // Load cover image
     loadCoverImage(selectedBook);
});
// Function to load the cover image
function loadCoverImage(bookFolder) {
    const bookPath = `/assets/book-content/${bookFolder}/index.html`;
    const coverPath = `/assets/book-content/${bookFolder}/images/cover.jpg`;
    // Select the cover image element
    const coverImage = document.getElementById("cover-image");
    if (bookFolder) {
        // Update the src attribute with the new path
        coverImage.src = coverPath;
        // Show the image (set display back to block)
        coverImage.style.display = "block";
    } else {
        // Hide the image when no book is selected
        coverImage.style.display = "none";
    }
    // Update the src attribute of the image
    coverImage.src = coverPath;
}
// Function to load the book content
function loadBookContent(bookFolder) {
    const bookPath = `/assets/book-content/${bookFolder}/index.html`;
    fetch(bookPath)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const storyStart = doc.querySelector("#story-start");
            if (storyStart) {
                rightColumn.innerHTML = "";
                let current = storyStart.nextElementSibling;
                while (current) {
                    const clonedNode = current.cloneNode(true);
                    // Adjust image paths for <img> tags
                    const images = clonedNode.querySelectorAll
                        ? clonedNode.querySelectorAll("img")
                        : [];
                    images.forEach(img => {
                        const currentSrc = img.getAttribute("src");
                        if (currentSrc && !currentSrc.startsWith("http") && !currentSrc.startsWith("/")) {
                            img.src = `/assets/book-content/${bookFolder}/${currentSrc}`;
                        }
                    });
                    // Append the cloned node
                    rightColumn.appendChild(clonedNode);
                    current = current.nextElementSibling;
                }
            } else {
                rightColumn.innerHTML = "<p>Story content not found.</p>";
            }
        })
        .catch(() => {
            rightColumn.innerHTML = "<p>Error loading the book. Please try again.</p>";
        });
}




// Variables
let analyser;
let dataArray;
function startAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Size of the frequency data (this will affect resolution)
    dataArray = new Uint8Array(analyser.frequencyBinCount); // Number of frequency data points
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream); // Create audio source from microphone
            source.connect(analyser); // Connect the source to the analyser
            draw(); // Start the visualization loop
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
        });
}
// Visualization function
let smoothedData = []; // Array to store smoothed values
const dampingFactor = 0.99; // Control how much smoothing to apply (0.8 = slower reactions)
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    // Get audio data for the visualization
    analyser.getByteTimeDomainData(dataArray);
    // Calculate the maximum amplitude for the current frame
    const maxAmplitude = Math.max(...dataArray) / 255; // Normalize to 0-1
    // Dynamically adjust the line width based on max amplitude
    const dynamicLineWidth = Math.max(maxAmplitude * 20, 1); // Scale width from 1 to 20
    ctx.lineWidth = dynamicLineWidth;
    // Set line style with blurred edges
    ctx.strokeStyle = "#e9d8be"; // Set to the desired color
    ctx.shadowColor = "#e9d8be"; // Same color as the line
    ctx.shadowBlur = 15; // Adjust this value for more or less blur
      // Draw soundwave
      ctx.beginPath();
      const gap = CANVAS.width / dataArray.length; // Calculate spacing between points
      const centerY = CANVAS.height / 2;
  
      for (let i = 0; i < dataArray.length; i++) {
          const amplitude = (dataArray[i] / 255) * CANVAS.height;
  
          // Draw the soundwave
          const x = i * gap;
          const y = centerY - amplitude / 2;
  
          if (i === 0) {
              ctx.moveTo(x, y);
          } else {
              ctx.lineTo(x, y);
          }
      }
  
      ctx.stroke();
    requestAnimationFrame(draw);
}
// Start the microphone visualization when the button is clicked
BUTTON.addEventListener("click", startAudio);

document.addEventListener("DOMContentLoaded", () => {
    openingMessage.classList.remove("hidden");
    attributionContainer.classList.remove("hidden");
    coverImage.style.display = "none";
});
