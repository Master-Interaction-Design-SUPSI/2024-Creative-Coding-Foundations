const container = document.getElementById("container")
const categoriesContainer = document.getElementById("category-select")

const subjects = [
    "math",
    "physics",
    "design",
    "art",
    "astronomy"
];
let selectedSubject = 0;
let currentController = null; // To track and abort the fetch request

categoriesContainer.innerHTML += subjects.map((subject, index) => `
    <button class="category-button" onclick="switchCloudSource('${index}')">${subject.toLocaleUpperCase()}</button>`).join(''); // Loads category buttons 

// Initially load the default selected subject
switchCloudSource(selectedSubject);

// Add listener to update the view on window resize
window.addEventListener("resize", () => {
    switchCloudSource(selectedSubject);
});

function switchCloudSource(index) {
    // Cancel the previous fetch if any
    if (currentController) {
        currentController.abort();  // Abort the previous fetch
    }

    // Create a new AbortController for the new request
    currentController = new AbortController();
    const signal = currentController.signal;

    selectedSubject = index;
    console.log(index, subjects[index]);

    // Disable buttons while loading
    disableButtons(true);

    // Display loading message
    container.innerHTML = "Loading cloud graphic...";

    // Perform the fetch request with abort signal
    fetch(`assets/${subjects[selectedSubject]}.json`, { signal })
        .then(response => response.json())
        .then(data => {
            displayData(data);
            disableButtons(false); // Re-enable buttons after data is fetched
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                display_error(error);
            }
            disableButtons(false); // Re-enable buttons on error as well
        });
}

function disableButtons(disabled) {
    const buttons = document.querySelectorAll('#category-select button');
    buttons.forEach(button => {
        button.disabled = disabled;
    });
}

function display_error(error) {
    console.error('Error:', error);
    container.innerHTML = "Sorry, the data is not available :(";
}

function displayData(response) {
    function displayBooksModal(event) {
        disableButtons(true);

        const word = event.target.innerText;
        // Find books that match the word as a subject
        const books = response.works.filter(work => (work.subject || []).includes(word));

        // Populate modal content
        const modal = document.getElementById('book-modal');
        modal.innerHTML = `
            <h2>Books containing the subject "${word}"</h2>
            <ul class="modal-content">
                ${books.map(book => `<li class="book">
                    <img src="https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg">
                    <h3>${book.title}</h3>
                    <h4>First edition published in (${book.first_publish_year || 'Unknown Year'}) by ${book.authors[0].name}</h4>
                    </li>`).join('')}
            </ul>
            <button id="closeModalButton">Close</button>
        `;
        modal.style.display = 'block';
        const overlay = document.getElementById('modal-overlay');
        overlay.style.display = 'block';

        // Close modal event
        document.getElementById('closeModalButton').addEventListener('click', () => {
            disableButtons(false);

            modal.style.display = 'none';
            overlay.style.display = 'none';
        });
    }

    container.innerHTML = "";

    // Extract and count words from subjects
    const subjects = response.works.flatMap(work => work.subject || []);
    const wordFrequency = subjects.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});

    // Helper function to check collision
    function isOverlapping(newElem, otherElems) {
        const rect1 = newElem.getBoundingClientRect();
        for (let elem of otherElems) {
            const rect2 = elem.getBoundingClientRect();
            if (
                rect1.left < rect2.right &&
                rect1.right > rect2.left &&
                rect1.top < rect2.bottom &&
                rect1.bottom > rect2.top
            ) {
                return true;
            }
        }
        return false;
    }

    // Create the word cloud
    const maxFrequency = Math.max(...Object.values(wordFrequency));
    const words = Object.entries(wordFrequency)
        .map(([word, freq]) => ({
            text: word,
            size: (freq / maxFrequency) * 50 + 10 // Scale font size
        }));

    const placedElements = [];

    words.forEach(({ text, size }) => {
        const span = document.createElement('span');
        span.textContent = text;
        span.style.position = 'absolute';
        span.style.marginBlockStart = '80px';
        span.style.fontSize = `${size}px`;
        span.style.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        span.addEventListener("click", displayBooksModal);

        // Try to place the element
        let xPos, yPos, attempts = 0;
        do {
            xPos = Math.random() * (window.innerWidth - 100);
            yPos = Math.random() * (window.innerHeight - 100);
            span.style.left = `${xPos}px`;
            span.style.top = `${yPos}px`;
            container.appendChild(span);
            attempts++;
        } while (isOverlapping(span, placedElements) && attempts < 100);

        if (attempts < 100) {
            placedElements.push(span);
        } else {
            container.removeChild(span); // Remove if no position found
        }
    });
}
