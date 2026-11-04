const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// טעינה מ-LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        const text = document.createElement("span");
        text.innerText = task.text;

        if (task.done) {
            text.classList.add("task-done");
        }

        // סימון הושלם
        text.addEventListener("click", () => {
            tasks[index].done = !tasks[index].done;
            saveTasks();
            renderTasks();
        });

        const btns = document.createElement("div");

        // כפתור וי
        const doneBtn = document.createElement("button");
        doneBtn.className = "btn btn-success btn-sm ms-2";
        doneBtn.innerHTML = `<i class="bi bi-check-lg"></i>`;

        doneBtn.addEventListener("click", () => {
            tasks[index].done = !tasks[index].done;
            saveTasks();
            renderTasks();
        });

        // כפתור מחיקה
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.innerHTML = `<i class="bi bi-trash"></i>`;

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        btns.appendChild(doneBtn);
        btns.appendChild(deleteBtn);

        li.appendChild(text);
        li.appendChild(btns);

        taskList.appendChild(li);
    });
}
