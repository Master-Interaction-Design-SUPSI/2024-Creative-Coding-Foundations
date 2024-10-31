const addButton = document.getElementById("add_button");
const container = document.getElementById("container");
const textInput = document.getElementById("text_input");
const categoryInput = document.getElementById("category_input");
const priorityInput = document.getElementById("priority_input");
const eraseButton = document.getElementById("erase_button");
const sortSelect = document.getElementById("sort_select");
const sortDirectionButton = document.getElementById("sort_direction");
const sortArrow = document.getElementById("sort_arrow");
  
// Array to hold to-do items
let todoList = [];

 
// Sort state object
let sortState = {
    sortBy: 'default',
    order: 'asc' // 'asc' or 'desc'
};


// Event Listener to Add Task
addButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission

    const taskText = textInput.value.trim();
    let taskCategory = categoryInput.value;
    let taskPriority = priorityInput.value;

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    if (!taskCategory) {
        taskCategory = "work"
    }

    if (!taskPriority) {
        taskPriority="low"
     }

    const task = {
        id: Date.now(),
        text: taskText,
        category: taskCategory,
        priority: taskPriority,
        completed: false
    };

    todoList.push(task);
    renderList();

    // Reset form fields
    textInput.value = "";
    categoryInput.selectedIndex = 0;
    priorityInput.selectedIndex = 0;
});

// Event Listener to Erase All Tasks
eraseButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to erase all tasks?")) {
        todoList = [];
        renderList();
    }
});

// Event Listeners for Sorting
sortSelect.addEventListener("change", () => {
    sortState.sortBy = sortSelect.value;
    renderList();
});

sortDirectionButton.addEventListener("click", () => {
    // Toggle sort order
    sortState.order = sortState.order === 'asc' ? 'desc' : 'asc';
    // Update arrow icon
    sortArrow.textContent = sortState.order === 'asc' ? '↑' : '↓';
    renderList();
});

// Function to Render the To-Do List
function renderList() {
    // Clear the container
    container.innerHTML = "";

    // Sort the list based on selection
    let sortedList = [...todoList];
    const { sortBy, order } = sortState;

    if (sortBy === "name") {
        sortedList.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortBy === "priority") {
        const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
        sortedList.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "category") {
        sortedList.sort((a, b) => a.category.localeCompare(b.category));
    }

    if (order === "desc") {
        sortedList.reverse();
    }

    // Create DOM elements for each task
    sortedList.forEach(task => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        // Checkbox Container
        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("checkbox-container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            renderList();
        });

        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkmark);

        // Task Text
        const textDiv = document.createElement("div");
        textDiv.classList.add("task-text");
        textDiv.textContent = task.text;
        if (task.completed) {
            textDiv.classList.add("completed");
        }

        // Category Label
        const categorySpan = document.createElement("span");
        categorySpan.classList.add("category-label");
        categorySpan.textContent = capitalizeFirstLetter(task.category);

        // Priority Indicator (Right Side)
        const priorityDiv = document.createElement("div");
        priorityDiv.classList.add("priority-indicator", task.priority);
        priorityDiv.title = `${capitalizeFirstLetter(task.priority)} Priority`;

        itemDiv.appendChild(checkboxContainer);
        itemDiv.appendChild(textDiv);
        itemDiv.appendChild(categorySpan);
        itemDiv.appendChild(priorityDiv);

        container.appendChild(itemDiv);
    });
}

// Helper Function to Capitalize First Letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize Sort Arrow
document.addEventListener("DOMContentLoaded", () => {
    sortArrow.textContent = sortState.order === 'asc' ? '↑' : '↓';
});
