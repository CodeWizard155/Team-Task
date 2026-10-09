
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");

let tasks = JSON.parse(localStorage.getItem("teamtask-tasks") || "[]");
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("teamtask-tasks", JSON.stringify(tasks));
}

function getTaskSummary() {
  const completed = tasks.filter(task => task.completed).length;

  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed
  };
}

function renderTasks() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    const label = document.createElement("span");
    label.textContent = task.text;
    label.style.cursor = "pointer";
    label.title = "Click to toggle completion";

    label.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const remove = document.createElement("button");
    remove.textContent = "Delete";

    remove.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(label, remove);
    list.appendChild(li);
  });

  const summary = getTaskSummary();

  count.textContent =
    `${summary.total} tasks · ` +
    `${summary.completed} completed · ${summary.pending} pending`;

  if (visibleTasks.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No tasks to display.";
    list.appendChild(empty);
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  saveTasks();
  input.value = "";
  renderTasks();
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

renderTasks();
