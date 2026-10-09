
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");

let tasks = [];
let currentFilter = "all";

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

    label.addEventListener("click", () => {
      task.completed = !task.completed;
      renderTasks();
    });

    const remove = document.createElement("button");
    remove.textContent = "Delete";

    remove.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      renderTasks();
    });

    li.append(label, remove);
    list.appendChild(li);
  });

  count.textContent =
    `${tasks.length} tasks · ` +
    `${tasks.filter(task => task.completed).length} completed`;
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
