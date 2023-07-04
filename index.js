const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');
function createTaskElement(task) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.onchange = () => markTaskAsDone(li);
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.value = task.todo;
    taskInput.disabled = true;
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'delete.png';
    deleteIcon.alt = 'Delete';
    deleteIcon.className = 'delete-icon';
    deleteIcon.onclick = () => deleteTask(li, task.id);
    li.appendChild(checkbox);
    li.appendChild(taskInput);
    li.appendChild(deleteIcon);
    return li;
  }
  function fetchUserTodos(userId) {
    fetch(`https://dummyjson.com/todos/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (Array.isArray(data.todos)) {
          data.todos.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
          });
        } else {
          console.error('Invalid data format.');
        }
      })
      .catch(error => console.error(error));
  }
  fetchUserTodos(50);
  function addTask(newTask) {
    const userId = 5; // Replace with a valid user ID
    fetch('https://dummyjson.com/todos/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        todo: newTask,
        completed: true,
        userId: userId
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the response data for debugging
        const taskElement = createTaskElement(data);
        taskList.appendChild(taskElement);
        newTaskInput.value = '';
        showSuccessMessage('New task added');
      })
      .catch(error => console.error(error));
  }
function updateTask(taskId, completed) {
  fetch(`https://dummyjson.com/todos/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      completed: completed
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => console.error(error));
}
function deleteTask(li, taskId) {
  fetch(`https://dummyjson.com/todos/${taskId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      li.remove();
      showSuccessMessage('Task deleted successfully');
    })
    .catch(error => console.error(error));
}
function markTaskAsDone(li, taskId) {
  const checkbox = li.querySelector('input[type="checkbox"]');
  const completed = checkbox.checked;
  updateTask(taskId, completed);
  li.classList.toggle('completed');
  const taskInput = li.querySelector('input[type="text"]');
  taskInput.style.textDecoration = completed ? 'line-through' : 'none';
  showSuccessMessage('Task completed! :heavy_check_mark::tada:');
}
function showSuccessMessage(message) {
  const successMessage = document.createElement('p');
  successMessage.classList.add('success-message');
  successMessage.textContent = message;
  document.body.appendChild(successMessage);
  setTimeout(() => {
    successMessage.remove();
  }, 2000);
}