const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const stats = document.getElementById("stats");

const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterDone = document.getElementById("filterDone");
const clearDone = document.getElementById("clearDone");

let todos = loadTodos();
let currentFilter = "all"; // all | active | done

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem("todos")) ?? [];
  } catch {
    return [];
  }
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function setActiveChip(activeId) {
  [filterAll, filterActive, filterDone].forEach(btn => btn.classList.remove("active"));
  document.getElementById(activeId).classList.add("active");
}

function filteredTodos() {
  if (currentFilter === "active") return todos.filter(t => !t.done);
  if (currentFilter === "done") return todos.filter(t => t.done);
  return todos;
}

function render() {
  list.innerHTML = "";

  const items = filteredTodos();
  for (const t of items) {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");
    li.dataset.id = t.id;

    li.innerHTML = `
      <div class="left">
        <input class="checkbox" type="checkbox" ${t.done ? "checked" : ""} />
        <span class="text"></span>
      </div>
      <div class="actions">
        <button class="iconBtn edit" type="button">Edit</button>
        <button class="iconBtn delete" type="button">Delete</button>
      </div>
    `;

    li.querySelector(".text").textContent = t.text;

    // Toggle done
    li.querySelector(".checkbox").addEventListener("change", () => {
      t.done = !t.done;
      saveTodos();
      render();
    });

    // Delete
    li.querySelector(".delete").addEventListener("click", () => {
      todos = todos.filter(x => x.id !== t.id);
      saveTodos();
      render();
    });

    // Edit
    li.querySelector(".edit").addEventListener("click", () => {
      const newText = prompt("Edit task:", t.text);
      if (newText === null) return; // cancelled
      const trimmed = newText.trim();
      if (!trimmed) return;
      t.text = trimmed;
      saveTodos();
      render();
    });

    list.appendChild(li);
  }

  const total = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  const activeCount = total - doneCount;

  stats.textContent = `Total: ${total} | Active: ${activeCount} | Done: ${doneCount}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.unshift({ id: uid(), text, done: false });
  input.value = "";
  saveTodos();
  render();
});

filterAll.addEventListener("click", () => {
  currentFilter = "all";
  setActiveChip("filterAll");
  render();
});

filterActive.addEventListener("click", () => {
  currentFilter = "active";
  setActiveChip("filterActive");
  render();
});

filterDone.addEventListener("click", () => {
  currentFilter = "done";
  setActiveChip("filterDone");
  render();
});

clearDone.addEventListener("click", () => {
  todos = todos.filter(t => !t.done);
  saveTodos();
  render();
});

render();
