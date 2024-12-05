

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('todo-input');
    const addButton = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');


    // Load saved tasks from the local storage
    loadTasks();

    
    addButton.addEventListener('click', () => {
        const taskText = inputField.value.trim();
        if (taskText) {
            addTask(taskText);
            saveAllTasks(); 
            inputField.value = ''; 
        }
    });


    
    function addTask(text, completed = false) {
        const listItem = document.createElement('li');

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => {
            taskText.classList.toggle('completed', checkbox.checked);
            saveAllTasks(); 
        });

      


        const taskText = document.createElement('span');
        taskText.textContent = text;
        if (completed) {
            taskText.classList.add('completed');
        }


        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            const newText = prompt("Edit your task:", taskText.textContent);
            if (newText) {
                taskText.textContent = newText.trim();
                saveAllTasks(); 
            }
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            listItem.remove();
            saveAllTasks(); 
        });

        
        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

       
        todoList.appendChild(listItem);
    }

    // SAVE the entire task list to local storage
    function saveAllTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const text = item.querySelector('span').textContent;
            tasks.push({ text, completed: checkbox.checked });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // LOAD tasks from local storage!!
    function loadTasks() {
        
        todoList.innerHTML = '';

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.completed);
        });
    }
});
