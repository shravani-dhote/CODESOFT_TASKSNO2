const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Today's Date
const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

document.getElementById("todayDate").innerText =
new Date().toLocaleDateString("en-US", options);

// Save
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Stats
function updateStats() {

    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasks.innerText = total;
    completedTasks.innerText = completed;
    pendingTasks.innerText = pending;

    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.style.width = percent + "%";
    progressPercent.innerText = percent + "%";
}

// Render Tasks
function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.className = task.completed ? "task completed" : "task";

        li.innerHTML = `
        <div class="task-info">

            <h3>${task.name}</h3>

            <p>📅 ${task.date || "No Due Date"}</p>

            <span class="priority ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

        </div>

        <div class="actions">

            <button class="done" onclick="toggleTask(${index})">
                <i class="fa-solid fa-check"></i>
            </button>

            <button class="edit" onclick="editTask(${index})">
                <i class="fa-solid fa-pen"></i>
            </button>

            <button class="delete" onclick="deleteTask(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
        `;

        taskList.appendChild(li);

    });

    updateStats();
}

// Add Task
addBtn.addEventListener("click", () => {

    if (taskInput.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({

        name: taskInput.value,
        priority: priority.value,
        date: dueDate.value,
        completed: false

    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    dueDate.value = "";

});

// Complete Task
function toggleTask(index) {

    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    renderTasks();

}

// Delete Task
function deleteTask(index) {

    if(confirm("Delete this task?")){

        tasks.splice(index,1);

        saveTasks();
        renderTasks();

    }

}

// Initial Load
renderTasks();
let filteredTasks = tasks.filter(task => {

    let matchSearch =
        task.name.toLowerCase().includes(search.value.toLowerCase());

    let matchFilter =
        currentFilter === "all" ||
        (currentFilter === "completed" && task.completed) ||
        (currentFilter === "pending" && !task.completed);

    return matchSearch && matchFilter;

});

filteredTasks.forEach((task) => {

    let index = tasks.indexOf(task);


// ================================
// SEARCH + FILTER + EDIT
// ================================

const search = document.getElementById("search");
const filterBtns = document.querySelectorAll(".filter");

let currentFilter = "all";

// Search
search.addEventListener("input", renderTasks);

// Filter
filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        filterBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();

    });

});

// Edit Task
function editTask(index){

    let newTask = prompt("Edit Task", tasks[index].name);

    if(newTask !== null && newTask.trim() !== ""){

        tasks[index].name = newTask.trim();

        saveTasks();
        renderTasks();

    }

}
});