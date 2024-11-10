const textInput = document.getElementById("text_input");
const colorInput = document.getElementById("color_input");
const button = document.getElementById("button");
const clear = document.getElementById("clear");
const generatedItemsContainer = document.getElementById("generatedItemsContainer");
let selectedCategory = "";

// Funzione per mostrare/nascondere il menu dropdown
document.getElementById('dropdownButton').addEventListener('click', () => {
  const dropdownContent = document.getElementById('dropdownContent');
  dropdownContent.classList.toggle('show');
  console.log("Dropdown menu aperto/chiuso");
});

// Aggiungi un listener a ciascun link di categoria
document.querySelectorAll('.dropdown-content a').forEach(link => {
  link.addEventListener('click', (event) => {
    selectedCategory = event.target.getAttribute('data-category');

    console.log("Categoria selezionata:", selectedCategory); 

    document.getElementById('dropdownButton').textContent = `Category: ${selectedCategory}`;
  });
});

// Chiude il menu dropdown se si clicca fuori
window.addEventListener('click', (event) => {
  if (!event.target.matches('.dropbtn')) {
    const dropdownContent = document.getElementById('dropdownContent');
    if (dropdownContent.classList.contains('show')) {
      dropdownContent.classList.remove('show');
    }
  }
});


button.addEventListener("click", () => {
  console.log('click');

  let userInput = textInput.value;
  let userColorInput = colorInput.value;

  const block = document.createElement("div");
  block.classList.add("item");
  block.style.backgroundColor = userColorInput;

  // Crea un elemento immagine SVG
  const icon = document.createElement("img");
  icon.src = `assets/${selectedCategory}.svg`; // Percorso SVG basato sulla categoria selezionata
  icon.alt = selectedCategory;
  icon.classList.add("icon"); // Aggiunge una classe per lo stile, se necessario

  // Crea un elemento per il testo dell'utente
  const text = document.createElement("span");
  text.textContent = userInput;
  text.classList.add("text");

  // Aggiunge l'icona SVG e il testo al blocco
  block.appendChild(icon);
  block.appendChild(text);

  // Aggiunge il blocco completo al contenitore esterno
  generatedItemsContainer.appendChild(block);
});


// Aggiungi un listener al bottone "Clear" per svuotare il contenitore generato
clear.addEventListener("click", () => {
  console.log('click');
  generatedItemsContainer.innerHTML = "";
});
