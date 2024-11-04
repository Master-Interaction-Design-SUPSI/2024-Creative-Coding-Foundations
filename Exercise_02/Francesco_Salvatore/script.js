const imageReferences = [
    "images/image-1.jpeg",
    "images/image-2.jpeg",
    "images/image-3.jpeg",
    "images/image-4.jpeg",
    "images/image-5.jpeg",
    "images/image-6.jpeg",
    "images/image-7.jpeg",
    "images/image-8.jpeg",
    "images/image-9.jpeg",
    "images/image-10.jpeg",
];

// Add variables to track and count used images
let usedImages = [];
let imageCount = 0;

document.getElementById("addImageBtn").addEventListener("click", addRandomImage);
document.getElementById("erase").addEventListener("click", clearAllImages);

function addRandomImage() {
    if (imageCount >= 5) {
        alert("Maximum of 5 images reached!"); // Limit to a maximum of 5 images
        console.log("Attempted to add image, but limit reached.");
        return;
    }

    // Filter out images that have already been used
    const availableImages = imageReferences.filter(img => !usedImages.includes(img));
    
    console.log("Available images:", availableImages); 

    if (availableImages.length === 0) {
        alert("All images have been shown!");
        console.log("No available images left to show.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];
    usedImages.push(selectedImage); // Mark image as used
    console.log("Selected image:", selectedImage); // Log the selected image

    const container = document.createElement("div");
    container.classList.add("image-text-container");

    const img = document.createElement("img");
    img.src = selectedImage; // Set the selected unique image
    img.alt = "Random Image"; // Optional alt text for accessibility

    // Create a text box with editable content
    const textBox = document.createElement("div");
    textBox.classList.add("text-box");
    textBox.contentEditable = true;
    textBox.textContent = "Your text here";

    // Add focus event listener to clear the placeholder text
    textBox.addEventListener("focus", function() {
        if (textBox.textContent === "Your text here") {
            textBox.textContent = ""; // Clear the text
        }
    });

    // Add blur event listener to restore placeholder if empty --> if didn't write anything it restore the placeholder
    textBox.addEventListener("blur", function() {
        if (textBox.textContent.trim() === "") {
            textBox.textContent = "Your text here"; // Restore placeholder if is empty
        }
    });

    // Create a color input for changing the background color of the text box
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = "#f0f0f0";
    colorInput.addEventListener("input", function() {
        textBox.style.backgroundColor = colorInput.value;
        console.log("Changed text box background color to:", colorInput.value); // Log color change
    });

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button"); // Add class for styling
    deleteButton.addEventListener("click", function() {
        container.remove(); 
        usedImages = usedImages.filter(img => img !== selectedImage); // Remove the image from the used list
        imageCount--; // Decrement the image count
        console.log("Image deleted. Current image count:", imageCount); // Log the current count
    });

    // Append image, text box, color input, and delete button to the container
    container.appendChild(img);
    container.appendChild(textBox);
    container.appendChild(colorInput);
    container.appendChild(deleteButton);

    document.getElementById("imageContainer").appendChild(container); // Append to main image container
    imageCount++; 
    console.log("Current image count:", imageCount); // Log current image count
}

function clearAllImages() {
    document.getElementById("imageContainer").innerHTML = ""; // Clear all elements within the container
    usedImages = []; // Reset the used images tracker
    imageCount = 0; // Reset image count
    console.log("All images cleared. Image count reset to 0."); // Log clear action
}
