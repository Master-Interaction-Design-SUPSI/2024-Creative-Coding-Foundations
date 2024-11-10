// Constants declaration
const SHOPINPUTTEXT = document.getElementById("shop-text");
const SPORTINPUTTEXT = document.getElementById("sport-text");
const STUDYINPUTTEXT = document.getElementById("study-text");
const SHOPALERT = document.getElementById("alert-shop");
const SPORTALERT = document.getElementById("alert-sport");
const STUDYALERT = document.getElementById("alert-study");
const SHOPITEM = document.getElementById("shop-items");
const SPORTITEM = document.getElementById("sport-items");
const STUDYITEM = document.getElementById("study-items");

// Create the arrax to add all the todo list items
let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
  todo = [];
}

// Create new todo item. It has type as parameter. THe function can understand on which section we are adding a new item.
function CreateToDoItems(type) {
  let alert;
  let input;
  let items;

  //THe function get the parameter and assign the right document element to modify/add/create 
  switch (type) {
    case 'shop':
      console.log('shop');
      alert = SHOPALERT;
      input = SHOPINPUTTEXT;
      items = SHOPITEM;
      break;
    case 'sport':
      console.log('sport');
      alert = SPORTALERT;
      input = SPORTINPUTTEXT;
      items = SPORTITEM;
      break;
    case 'study':
      console.log('study');
      alert = STUDYALERT;
      input = STUDYINPUTTEXT;
      items = STUDYITEM;
      break;
    default:
      console.log('Sorry, we are out of items');
  }

  alert.style.color = "#008000";
  if (input.value === "") {
    alert.style.color = "#ff0000";
    alert.innerText = "Please enter a valid element";
    input.focus();
    removeAlertMessage(alert);
  } else {
    let card = document.createElement("div");
    let currentdate = new Date();
    let now = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    const TODOITEMS = "<div class='card'><h3 class='div-item-top'>" + input.value + "</h3><p class='date'>" + now + "</p><button class='delete todo-controls' onclick='DeleteToDoItems(this)'>Delete</button></div>";
    card.innerHTML = TODOITEMS;
    items.appendChild(card);

    if (!todo) {
      todo = [];
    }
    let itemList = { item: input.value, status: false };
    todo.push(itemList);

    alert.innerText = "Item successfully added to the todo-list";

  }
  input.value = "";

  removeAlertMessage(alert);

}

//delete an item from todolist
function DeleteToDoItems(e) {
  let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;

  if (confirm('Are you sure. Due you want to delete this item?')) {
    e.parentElement.parentElement.setAttribute("class", "deleted-item");

    //remove element from the list
    todo.forEach((element) => {
      if (element.item == deleteValue.trim()) {
        todo.splice(element, 1);
      }
    });

    //remove the element from the page
    setTimeout(() => {
      e.parentElement.parentElement.remove();
    }, 1000);

  }
}

//Remove alert message after 1.5 seconds. It is parametric. It changes the message based on the status passed as parameter
function removeAlertMessage(alert) {
  setTimeout(() => {
    alert.innerText = "";
  }, 1500);
}