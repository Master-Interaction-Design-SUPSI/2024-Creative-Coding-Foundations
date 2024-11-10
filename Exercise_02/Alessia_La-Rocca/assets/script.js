// packing list
function addItem() {
    const itemText = document.getElementById("new-item").value;
    if (itemText) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<input type="checkbox" /> ${itemText} <button onclick="deleteItem(this)">Delete</button>`;
        document.getElementById("packing-list").appendChild(listItem);
        document.getElementById("new-item").value = ""; // clear input
    }
}

// delete from packing list
function deleteItem(button) {
    const listItem = button.parentNode;
    listItem.parentNode.removeChild(listItem);
}

// reservations + delete
function addReservation() {
    const type = document.getElementById("reservation-type").value;
    const name = document.getElementById("reservation-name").value;
    const date = document.getElementById("reservation-date").value;
    const time = document.getElementById("reservation-time").value;
    
    if (name && date) {
        const reservationItem = document.createElement("li");
        reservationItem.innerHTML = `${type}: ${name} on ${date} at ${time} <button onclick="deleteItem(this)">Delete</button>`;
        document.getElementById("reservation-list").appendChild(reservationItem);

        // clear fields after adding
        document.getElementById("reservation-name").value = "";
        document.getElementById("reservation-date").value = "";
        document.getElementById("reservation-time").value = "";
    }
}

// itinerary + delete
function saveItinerary() {
    const itinerary = document.getElementById("itinerary").value;
    if (itinerary) {
        const itineraryItem = document.createElement("div");
        itineraryItem.innerHTML = `<p>${itinerary}</p> <button onclick="deleteItem(this)">Delete</button>`;
        document.getElementById("saved-itinerary").appendChild(itineraryItem);
        document.getElementById("itinerary").value = ""; // clear text area
    }
}
