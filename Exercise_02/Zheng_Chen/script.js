// Get DOM elements
const addTaskButton = document.getElementById('add-task');
const taskInput = document.getElementById('taskInput');
const taskDateInput = document.getElementById('taskDate');
const taskDeadlineInput = document.getElementById('taskDeadline');
const toDoList = document.getElementById('to-do-list');
const doneList = document.getElementById('box-done');
const clearUpButton = document.getElementById('clear-up');

// Load tasks from localStorage
loadTasksFromStorage();
loadCompletedTasksFromStorage();

// Event listener for adding a task
addTaskButton.addEventListener('click', function() {
    const taskText = taskInput.value.trim(); // Get task input and trim whitespace
    const taskDate = taskDateInput.value; // Get selected start date
    const taskDeadline = taskDeadlineInput.value; // Get deadline

    if (taskText) { // Ensure input is not empty
        // Create a new task div
        const taskDiv = createTaskDiv(taskText, taskDate, taskDeadline);
        toDoList.appendChild(taskDiv);

        // Save task to localStorage
        saveTaskToStorage(taskText, taskDate, taskDeadline);

        // Clear input fields and date pickers
        taskInput.value = '';
        taskDateInput.value = '';
        taskDeadlineInput.value = '';
    } else {
        alert('Please enter a task!'); // Alert the user if input is empty
    }
});

// Event listener to clear input fields and date pickers
clearUpButton.addEventListener('click', function() {
    taskInput.value = '';
    taskDateInput.value = '';
    taskDeadlineInput.value = '';
});

// Function to create a task div
function createTaskDiv(taskText, taskDate, taskDeadline) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item'); // Add styling class name
    
    // Set task HTML content
    taskDiv.innerHTML = `
        <p><strong>Task:</strong> ${taskText}</p>
        <p><strong>Start Date:</strong> ${taskDate || 'Not specified'}</p>
        <p><strong>Deadline:</strong> ${taskDeadline || 'Not specified'}</p>
        <button class="complete-task">Done</button>
        <button class="delete-task">Delete</button>
    `;

    // Add event listener for "Done" button
    const completeButton = taskDiv.querySelector('.complete-task');
    completeButton.addEventListener('click', function() {
        const completedTaskDiv = createCompletedTaskDiv(taskText, taskDate, taskDeadline);
        doneList.appendChild(completedTaskDiv);
        taskDiv.remove(); // Remove task from to-do list

        // Save completed task to localStorage
        saveCompletedTaskToStorage(taskText, taskDate, taskDeadline);
        removeTaskFromStorage(taskText); // Remove to-do task from localStorage
    });

    // Add event listener for delete button
    const deleteButton = taskDiv.querySelector('.delete-task');
    deleteButton.addEventListener('click', function() {
        taskDiv.remove(); // Remove task from to-do list
        removeTaskFromStorage(taskText); // Remove task from localStorage
    });

    return taskDiv;
}

// Function to create completed task div
function createCompletedTaskDiv(taskText, taskDate, taskDeadline) {
    const completedTaskDiv = document.createElement('div');
    completedTaskDiv.classList.add('task-item'); // Use same styling class name as to-do tasks

    // Set HTML content for completed task
    completedTaskDiv.innerHTML = `
        <p><strong>Task:</strong> ${taskText}</p>
        <p><strong>Start Date:</strong> ${taskDate || 'Not specified'}</p>
        <p><strong>Deadline:</strong> ${taskDeadline || 'Not specified'}</p>
        <button class="re-add-task">Restore</button>
        <button class="delete-task">Delete</button>
    `;

    // Add event listener for delete button
    const deleteButton = completedTaskDiv.querySelector('.delete-task');
    deleteButton.addEventListener('click', function() {
        completedTaskDiv.remove(); // Remove completed task
        removeCompletedTaskFromStorage(taskText); // Remove completed task from localStorage
    });

    // Add event listener for restore button
    const reAddButton = completedTaskDiv.querySelector('.re-add-task');
    reAddButton.addEventListener('click', function() {
        const newTaskDiv = createTaskDiv(taskText, taskDate, taskDeadline);
        toDoList.appendChild(newTaskDiv); // Add back to to-do list
        completedTaskDiv.remove(); // Remove from completed tasks
        removeCompletedTaskFromStorage(taskText); // Remove completed task from localStorage
        saveTaskToStorage(taskText, taskDate, taskDeadline); // Add back to to-do task
    });

    return completedTaskDiv;
}

// Save task to localStorage
function saveTaskToStorage(taskText, taskDate, taskDeadline) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ taskText, taskDate, taskDeadline });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskDiv = createTaskDiv(task.taskText, task.taskDate, task.taskDeadline);
        toDoList.appendChild(taskDiv);
    });
}

// Remove task from localStorage
function removeTaskFromStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.taskText !== taskText);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Save completed task to localStorage
function saveCompletedTaskToStorage(taskText, taskDate, taskDeadline) {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.push({ taskText, taskDate, taskDeadline });
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Load completed tasks from localStorage
function loadCompletedTasksFromStorage() {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks.forEach(task => {
        const completedTaskDiv = createCompletedTaskDiv(task.taskText, task.taskDate, task.taskDeadline);
        doneList.appendChild(completedTaskDiv);
    });
}

// Remove completed task from localStorage
function removeCompletedTaskFromStorage(taskText) {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    const updatedCompletedTasks = completedTasks.filter(task => task.taskText !== taskText);
    localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
}
