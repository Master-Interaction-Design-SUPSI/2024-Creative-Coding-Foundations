// Selecting Elements
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task');
const taskTypeSelect = document.getElementById('task-type');
const taskList = document.getElementById('task-list');
const rewardList = document.getElementById('reward-list');

// Adding a Task
addTaskBtn.addEventListener('click', () => {
  const taskText = newTaskInput.value;
  const taskType = taskTypeSelect.value;

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = taskText;
  li.classList.add(taskType);
  li.appendChild(span);

  // Edit Button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    const newTaskText = prompt('Edit your task:', taskText);
    if (newTaskText !== null && newTaskText.trim() !== '') {
      span.textContent = newTaskText;
    }
  });
  
  // Remove Button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    taskList.removeChild(li);
    if (taskType === 'planet') {
      addReward('A planet has vanished!');
    } else {
      addReward('A star has burned out!');
    }
  });

  li.appendChild(editBtn);
  li.appendChild(removeBtn);
  taskList.appendChild(li);
  newTaskInput.value = '';
});

// Adding Reward to Reward List
function addReward(reward) {
  const li = document.createElement('li');
  li.textContent = reward;
  rewardList.appendChild(li);
}
