document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskContainer = document.getElementById('taskContainer');
    const tagColorPicker = document.getElementById('tagColorPicker');
    const tagButtons = document.querySelectorAll('.self-care-tag');

    function addTask(taskText = taskInput.value.trim(), taskColor = tagColorPicker.value) {
        if (taskText === "") return;

        const taskItemTemplate = document.querySelector('.task-item');
        const newTaskItem = taskItemTemplate.cloneNode(true);
        newTaskItem.style.display = 'flex';
        newTaskItem.style.backgroundColor = taskColor;

        const taskContent = newTaskItem.querySelector('.task-text');
        taskContent.textContent = taskText;

        const editButton = newTaskItem.querySelector('.edit-button');
        editButton.onclick = () => editTask(taskContent);

        const removeButton = newTaskItem.querySelector('.remove-button');
        removeButton.onclick = () => {
            const confirmRemoval = confirm("Are you sure you want to remove this task?");
            if (confirmRemoval) {
                newTaskItem.remove();
            }
        };

        taskContainer.appendChild(newTaskItem);
        taskInput.value = '';
    }

    function editTask(taskContent) {
        const newText = prompt("Edit your task:", taskContent.textContent);
        if (newText) {
            taskContent.textContent = newText;
        }
    }

    addTaskButton.addEventListener('click', () => addTask());

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.id !== 'addCustomTag') {
                addTask(button.dataset.tag, tagColorPicker.value);
            } else {
                const customTag = prompt("Enter your custom tag:");
                if (customTag) addTask(customTag, tagColorPicker.value);
            }
        });
    });
});