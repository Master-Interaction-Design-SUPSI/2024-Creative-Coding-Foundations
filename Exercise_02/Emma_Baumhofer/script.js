// Add delete functionality to any list
function addDeleteFunctionality(button) {
    button.addEventListener('click', function() {
        const listToDelete = button.parentElement;
        listToDelete.parentElement.removeChild(listToDelete);
    });
}

document.querySelectorAll('.delete-list').forEach(addDeleteFunctionality);

document.querySelectorAll('.add-task').forEach(button => {
    button.addEventListener('click', addTask);
});

// Enter key to add tasks
document.querySelectorAll('.task-input').forEach(input => {
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTask({ target: input.nextElementSibling });
            event.preventDefault();
        }
    });
});

// Color change
function addColorChangeListener(selector) {
    selector.addEventListener('change', function(event) {
        const newColor = event.target.value;
        event.target.parentElement.style.backgroundColor = newColor;
    });
}

document.querySelectorAll('.color-selector').forEach(addColorChangeListener);

// Tasks with ombre effect
function addTask(event) {
    const taskInput = event.target.previousElementSibling;
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskList = event.target.previousElementSibling.previousElementSibling;
        const taskItem = document.createElement('li');
        taskItem.className = 'task';
        taskItem.innerHTML = `${taskText} <span class="task-complete">&#10003;</span>`;
        taskList.appendChild(taskItem);

        taskInput.value = '';

        const taskItems = taskList.querySelectorAll('.task');
        taskItems.forEach((item, index) => {
            // Calculate opacity - start from 0.9 and go down by 0.1 each step
            const opacity = Math.max(0.9 - index * 0.1, 0.2); // Min opacity of 0.2 
            item.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        });

        // Mark task complete
        taskItem.querySelector('.task-complete').addEventListener('click', () => {
            taskList.removeChild(taskItem);
        });
    }
}

// Add new list color selector and delete button
document.getElementById('addListButton').addEventListener('click', () => {
    const listsContainer = document.getElementById('listsContainer');
    const listCount = listsContainer.children.length + 1;

    const newList = document.createElement('div');
    newList.className = 'list';

    const title = document.createElement('h2');
    title.textContent = `List ${listCount}`;
    title.setAttribute('contenteditable', 'true');
    newList.appendChild(title);

    const deleteButton = document.createElement('span');
    deleteButton.className = 'delete-list';
    deleteButton.innerHTML = '&times;';
    newList.appendChild(deleteButton);

    const colorSelector = document.createElement('select');
    colorSelector.className = 'color-selector';
    colorSelector.innerHTML = `
        <option disabled selected>Choose list color</option>    
        <option value="#f3733e">Orange</option>
        <option value="#e04636">Red</option>
        <option value="#33818f">Icy Blue</option>
        <option value="#171f30">Dark Blue</option>
    `;
    newList.appendChild(colorSelector);

    const tasks = document.createElement('ul');
    tasks.className = 'tasks';
    newList.appendChild(tasks);

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'Add a task';
    taskInput.className = 'task-input';
    newList.appendChild(taskInput);

    const addTaskButton = document.createElement('button');
    addTaskButton.className = 'add-task';
    addTaskButton.textContent = '+';
    newList.appendChild(addTaskButton);

    listsContainer.appendChild(newList);

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTask({ target: taskInput.nextElementSibling });
            event.preventDefault();
        }
    });

    addDeleteFunctionality(deleteButton);
    addColorChangeListener(colorSelector);
});