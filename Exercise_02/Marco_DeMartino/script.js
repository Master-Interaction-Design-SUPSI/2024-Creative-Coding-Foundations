/*const button = document.getElementById("button");
const postText = document.getElementById("post-text");
const board = document.getElementById("board");

button.addEventListener("click", () => {
  console.log("click!");

  let userInput = postText.value.trim(); // Trim whitespace
  console.log(userInput);

  if (userInput) {
    // Check if input is not empty
    const post = document.createElement("div");
    post.textContent = userInput;
    post.classList.add("post");

    board.appendChild(post);
    postText.value = ""; // Clear input field
  } else {
    alert("Please enter a message!"); // Alert for empty input
  }
});*/

const button = document.getElementById("button");
const postText = document.getElementById("post-text");
const board = document.getElementById("board");
const dateList = document.getElementById("date-list");
const color = document.getElementById("color");
const postTitle = document.getElementById("title");
const clearButton = document.getElementById("clear-button");

let postsByDate = JSON.parse(localStorage.getItem("postsByDate")) || {};

function loadPosts() {
  const dates = Object.keys(postsByDate);
  if (dates.length > 0) {
    const lastDate = dates[dates.length - 1];
    showPostsForDate(lastDate);

    dates.forEach((date) => {
      const dateItem = document.createElement("li");
      dateItem.textContent = date;
      dateItem.addEventListener("click", () => showPostsForDate(date));
      dateList.appendChild(dateItem);
    });
  }
}

loadPosts();

button.addEventListener("click", () => {
  let userInput = postText.value.trim();
  const today = new Date().toLocaleDateString();
  let userColor = color.value;
  let userTitle = postTitle.value;

  if (userInput) {
    const post = {
      title: userTitle,
      content: userInput,
      color: userColor,
    };

    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.style.backgroundColor = userColor;

    const titleParagraph = document.createElement("p");
    titleParagraph.textContent = userTitle;
    titleParagraph.classList.add("post-title");

    const textParagraph = document.createElement("p");
    textParagraph.textContent = userInput;
    textParagraph.classList.add("post-content");

    postElement.appendChild(titleParagraph);
    postElement.appendChild(textParagraph);
    board.appendChild(postElement);

    postText.value = "";
    postTitle.value = "";

    if (!postsByDate[today]) {
      postsByDate[today] = [];
      const dateItem = document.createElement("li");
      dateItem.textContent = today;
      dateItem.addEventListener("click", () => showPostsForDate(today));
      dateList.appendChild(dateItem);
    }

    postsByDate[today].push(post);

    localStorage.setItem("postsByDate", JSON.stringify(postsByDate));
  } else {
    alert("Please enter a message!");
  }
});

function showPostsForDate(date) {
  board.innerHTML = "";
  const posts = postsByDate[date] || [];
  posts.forEach(({ title, content, color }) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.style.backgroundColor = color;
    const titleParagraph = document.createElement("p");
    titleParagraph.textContent = title;
    titleParagraph.classList.add("post-title");
    const textParagraph = document.createElement("p");
    textParagraph.textContent = content;
    textParagraph.classList.add("post-content");

    postElement.appendChild(titleParagraph);
    postElement.appendChild(textParagraph);
    board.appendChild(postElement);
  });
}

clearButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all posts?")) {
    postsByDate = {};
    localStorage.removeItem("postsByDate");
    board.innerHTML = "";
    dateList.innerHTML = "";
  }
});
