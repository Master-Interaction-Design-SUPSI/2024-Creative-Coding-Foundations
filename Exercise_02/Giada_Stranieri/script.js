const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const deletedTasksList = document.getElementById('deletedTasksList');

let deletedTasks = [];

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <div>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        taskList.appendChild(taskItem);
        taskInput.value = '';

        const editBtn = taskItem.querySelector('.edit');
        editBtn.addEventListener('click', () => editTask(taskItem, taskText));

        const deleteBtn = taskItem.querySelector('.delete');
        deleteBtn.addEventListener('click', () => deleteTask(taskItem));
    }
}

function editTask(taskItem, oldText) {
    const newText = prompt('Edit your task:', oldText);
    if (newText !== null && newText.trim() !== '') {
        taskItem.querySelector('span').textContent = newText.trim();
    }
}

function deleteTask(taskItem) {
    const taskText = taskItem.querySelector('span').textContent;
    deletedTasks.push(taskText);
    taskList.removeChild(taskItem);
    renderDeletedTasks();
}

function restoreTask(taskText) {
    deletedTasks = deletedTasks.filter(task => task !== taskText);
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;
    taskList.appendChild(taskItem);
    
    const editBtn = taskItem.querySelector('.edit');
    editBtn.addEventListener('click', () => editTask(taskItem, taskText));
    
    const deleteBtn = taskItem.querySelector('.delete');
    deleteBtn.addEventListener('click', () => deleteTask(taskItem));
    
    renderDeletedTasks();
}

function renderDeletedTasks() {
    deletedTasksList.innerHTML = '';
    deletedTasks.forEach(taskText => {
        const deletedTaskItem = document.createElement('li');
        deletedTaskItem.innerHTML = `
            <span>${taskText}</span>
            <button class="restore">Restore</button>
        `;
        deletedTasksList.appendChild(deletedTaskItem);
        
        const restoreBtn = deletedTaskItem.querySelector('.restore');
        restoreBtn.addEventListener('click', () => restoreTask(taskText));
    });
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
