const STORAGE_KEY = "naman-dev-todo-tasks-v1";
const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const list = document.querySelector("#todoList");
const emptyMessage = document.querySelector("#todoEmpty");
const remainingCount = document.querySelector("#remainingCount");
const statusMessage = document.querySelector("#todoStatus");
const clearCompletedButton = document.querySelector("#clearCompleted");
const filterButtons = document.querySelectorAll(".todo-filter");

let tasks = [];
let currentFilter = "all";

function isTask(value) {
  return value !== null
    && typeof value === "object"
    && typeof value.id === "string"
    && value.id.length > 0
    && typeof value.text === "string"
    && value.text.trim().length > 0
    && typeof value.completed === "boolean";
}

function loadTasks() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks === null) return [];

    const parsedTasks = JSON.parse(storedTasks);
    if (
      !Array.isArray(parsedTasks)
      || !parsedTasks.every(isTask)
      || new Set(parsedTasks.map((task) => task.id)).size !== parsedTasks.length
    ) {
      throw new Error("Saved tasks have an invalid format.");
    }
    return parsedTasks;
  } catch (error) {
    statusMessage.textContent = "Couldn't load saved tasks. Your browser storage may be unavailable or the saved data is invalid.";
    console.error("Unable to load saved tasks:", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    statusMessage.textContent = "Your tasks are saved in this browser.";
  } catch (error) {
    statusMessage.textContent = "Couldn't save your changes. Your browser storage may be unavailable or full.";
    console.error("Unable to save tasks:", error);
  }
}

function renderTasks() {
  list.replaceChildren();
  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `todo-item${task.completed ? " is-completed" : ""}`;

    const label = document.createElement("label");
    label.className = "todo-task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" ${task.completed ? "active" : "completed"}`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "todo-task-text";
    text.textContent = task.text;
    label.append(checkbox, text);

    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-delete";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((itemTask) => itemTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(label, deleteButton);
    list.append(item);
  });

  const remaining = tasks.filter((task) => !task.completed).length;
  remainingCount.textContent = String(remaining);
  if (visibleTasks.length === 0) {
    if (tasks.length === 0) {
      emptyMessage.textContent = "Nothing here yet. Add a task to get started.";
    } else if (currentFilter === "active") {
      emptyMessage.textContent = "All tasks are completed. Nice work!";
    } else if (currentFilter === "completed") {
      emptyMessage.textContent = "No completed tasks yet.";
    }
  }
  emptyMessage.hidden = visibleTasks.length > 0;
  list.hidden = visibleTasks.length === 0;
  clearCompletedButton.disabled = !tasks.some((task) => task.completed);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  tasks.push({
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    completed: false
  });
  saveTasks();
  renderTasks();
  form.reset();
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTasks();
  });
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

tasks = loadTasks();
renderTasks();
