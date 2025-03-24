class Task {
  constructor(name, description, status) {
    this.id = Date.now();
    this.name = name;
    this.description = description;
    this.status = status; // Ensure status is correctly assigned
  }
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Main Page Logic
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  const taskNameInput = document.getElementById("task-name");
  const taskDescriptionInput = document.getElementById("task-description");
  const addTaskBtn = document.getElementById("add-task-btn");
  const viewTasksBtn = document.getElementById("view-tasks-btn");

  function addTask() {
    const name = taskNameInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const status = document.querySelector('input[name="status"]:checked').value; // Get selected status

    if (!name) {
      alert("Task name cannot be empty!");
      return;
    }

    if (!description) {
      alert("Task description cannot be empty!");
      return;
    }

    const newTask = new Task(name, description, status); // Pass status to Task constructor
    tasks.push(newTask);
    saveTasks();

    taskNameInput.value = "";
    taskDescriptionInput.value = "";
    document.querySelector('input[name="status"]:checked').checked = false;

    alert("Task added successfully!");
  }

  addTaskBtn.addEventListener("click", addTask);
  viewTasksBtn.addEventListener("click", () => {
    window.location.href = "tasks.html";
  });
}

// Tasks Page Logic
if (window.location.pathname.endsWith("tasks.html")) {
  const taskList = document.getElementById("task-list");
  const filterSelect = document.getElementById("filter");
  const backBtn = document.getElementById("back-btn");

  function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter((task) => {
      if (filter === "completed") return task.status === "completed";
      if (filter === "pending") return task.status === "pending";
      return true;
    });

    filteredTasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = `task-item ${task.status}`; // Fixed template literal
      taskItem.innerHTML = `
        <div>
          <h3>${task.name}</h3>
          <p>${task.description}</p>
          <small>Status: ${task.status}</small>
        </div>
        <div class="task-actions">
          <button class="complete-btn" onclick="toggleTaskStatus(${task.id})">
            ${task.status === "pending" ? "Mark as Completed" : "Mark as Pending"}
          </button>
          <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
      taskList.appendChild(taskItem);
    });
  }

  window.toggleTaskStatus = function (id) {
    const task = tasks.find((task) => task.id === id);
    task.status = task.status === "pending" ? "completed" : "pending";
    saveTasks();
    renderTasks(filterSelect.value);
  };

  window.editTask = function (id) {
    const task = tasks.find((task) => task.id === id);
    const newName = prompt("Enter new task name:", task.name);
    const newDescription = prompt("Enter new task description:", task.description);
    const newStatus = prompt("Enter new status (pending/completed):", task.status);

    if (newName !== null && newDescription !== null && newStatus !== null) {
      task.name = newName.trim();
      task.description = newDescription.trim();
      task.status = newStatus.trim().toLowerCase() === "completed" ? "completed" : "pending"; // Ensure valid status
      saveTasks();
      renderTasks(filterSelect.value);
    }
  };

  window.deleteTask = function (id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks(filterSelect.value);
  };

  filterSelect.addEventListener("change", (e) => {
    renderTasks(e.target.value);
  });

  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Initial render
  renderTasks();
}