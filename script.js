
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const timeSelect = document.getElementById("task-time");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("oneThingTasks")) || [];

function saveTasks() {
    localStorage.setItem("oneThingTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    const periods = ["Morning", "Afternoon", "Evening"];

    periods.forEach(period => {
        const periodTasks = tasks.filter(task => task.time === period);

        if (periodTasks.length === 0) return;

        const group = document.createElement("div");
        group.className = "task-group";

        const heading = document.createElement("h3");
        heading.textContent = period;
        group.appendChild(heading);

        periodTasks.forEach(task => {
            const item = document.createElement("div");
            item.className = "task-item";

            if (task.completed) {
                item.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const name = document.createElement("span");
            name.className = "task-name";
            name.textContent = task.name;

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "✕";
            deleteButton.setAttribute("aria-label", "Delete task");

            deleteButton.addEventListener("click", () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            });

            item.append(checkbox, name, deleteButton);
            group.appendChild(item);
        });

        taskList.appendChild(group);
    });

    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const percentage = total ? (completed / total) * 100 : 0;

    document.getElementById("progress-text").textContent =
        `${completed}/${total}`;

    document.getElementById("progress-fill").style.width =
        `${percentage}%`;

    document.getElementById("task-count").textContent =
        `${total} tasks`;
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const name = input.value.trim();

    if (!name) return;

    tasks.push({
        id: Date.now().toString(),
        name: name,
        time: timeSelect.value,
        completed: false
    });

    saveTasks();
    renderTasks();

    input.value = "";
    input.focus();
});

document.getElementById("today-date").textContent =
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

renderTasks();
