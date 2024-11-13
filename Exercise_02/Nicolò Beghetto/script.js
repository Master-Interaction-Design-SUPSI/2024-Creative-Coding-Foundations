document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('saveNoteButton').addEventListener('click', saveNote);
document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);

let timer;
let minutes = 0;
let seconds = 0;

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const newTask = taskInput.value.trim();

    if (newTask) {
        const li = document.createElement('li');
        li.textContent = newTask;
        li.addEventListener('click', completeTask);
        taskList.appendChild(li);
        taskInput.value = '';
    }
}

function completeTask(e) {
    const completedList = document.getElementById('completedList');
    const li = document.createElement('li');
    li.textContent = e.target.textContent;
    completedList.appendChild(li);
    e.target.remove();
}

function saveNote() {
    const notesInput = document.getElementById('notesInput');
    const notesDisplay = document.getElementById('notesDisplay');
    const note = notesInput.value.trim();

    if (note) {
        const div = document.createElement('div');
        div.textContent = note;
        notesDisplay.appendChild(div);
        notesInput.value = '';
    }
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    minutes = 0;
    seconds = 0;
    document.getElementById('timerDisplay').textContent = '00:00';
}

function changeTheme() {
    const theme = document.getElementById('theme').value;
    document.body.setAttribute('data-theme', theme);
}
// Salva gli obiettivi a lungo termine
document.getElementById('saveLongTermGoals').addEventListener('click', function () {
    const goals = document.getElementById('longTermGoals').value;
    if (goals) {
        alert('Long-Term Goals saved!');
        // Qui puoi anche decidere di memorizzarli in locale o in un database
    } else {
        alert('Please enter your goals before saving.');
    }
});
// Aggiungi questo codice alla fine di script.js

document.getElementById("add-task").addEventListener("click", function () {
    const taskDropdown = document.getElementById("predefined-tasks");
    const selectedTask = taskDropdown.value;

    if (selectedTask) {
        addTaskToList(selectedTask);
        taskDropdown.value = ""; // Resetta il dropdown
    } else {
        alert("Please select a task to add.");
    }
});

/*function addTaskToList(task) {
    const taskList = document.getElementById("task-list");
    const listItem = document.createElement("li");
    listItem.textContent = task;
    taskList.appendChild(listItem);
}*/
function addTaskToList(task) {
    const taskList = document.getElementById("task-list");
    
    // Crea l'elemento per il task
    const listItem = document.createElement("li");
    listItem.textContent = task;

    // Crea il pulsante di cancellazione
    const deleteButton = document.createElement("span");
    deleteButton.textContent = " ✕";
    deleteButton.classList.add("delete-button");

    // Aggiungi l'evento di cancellazione al pulsante
    deleteButton.addEventListener("click", function() {
        taskList.removeChild(listItem);
    });

    // Aggiungi il pulsante di cancellazione al task
    listItem.appendChild(deleteButton);

    // Aggiungi il task con il pulsante di cancellazione alla lista
    taskList.appendChild(listItem);
}
lettimer = 0;
letminutes = 0;
letseconds = 0;

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    minutes = 0;
    seconds = 0;
    document.getElementById('timerDisplay').textContent = '00:00';
}
