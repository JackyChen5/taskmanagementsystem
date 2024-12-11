const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskListEl = document.getElementById("task-list");
const calendarEl = document.getElementById("calendar");
const calendarMonthEl = document.getElementById("calendar-month");
const popup = document.getElementById("popup");
const popupTasksEl = document.getElementById("popup-tasks");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

document.getElementById("add-task-btn").addEventListener("click", () => {
    const title = document.getElementById("task-title").value.trim();
    const date = document.getElementById("task-date").value;
    const priority = document.getElementById("task-priority").value;
    const link = document.getElementById("task-link").value.trim();

    if (title && date) {
        tasks.push({ title, date, priority, link, completed: false });
        saveTasks();
        renderTasks();
        renderCalendar();

        // Reset inputs
        document.getElementById("task-title").value = '';
        document.getElementById("task-date").value = '';
        document.getElementById("task-priority").value = 'High';
        document.getElementById("task-link").value = '';
    }
});

document.getElementById("clear-all-tasks").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tasks? This action cannot be undone.")) {
        tasks.length = 0; // Clear the tasks array
        saveTasks();
        renderTasks();
        renderCalendar();
    }
});

document.getElementById("show-list-view").addEventListener("click", () => {
    document.getElementById("list-view").style.display = "block";
    document.getElementById("calendar-view").style.display = "none";
});

document.getElementById("show-calendar-view").addEventListener("click", () => {
    document.getElementById("list-view").style.display = "none";
    document.getElementById("calendar-view").style.display = "block";
});

document.getElementById("sort-by-date").addEventListener("click", () => {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveTasks();
    renderTasks();
});

document.getElementById("sort-by-priority").addEventListener("click", () => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    saveTasks();
    renderTasks();
});

document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

function renderTasks() {
    taskListEl.innerHTML = "";
    const sortedTasks = [...tasks.filter(t => !t.completed), ...tasks.filter(t => t.completed)];
    sortedTasks.forEach((task, index) => {
        const row = document.createElement("tr");
        row.classList.toggle("completed", task.completed);
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${formatDate(task.date)}</td>
            <td>${task.priority}</td>
            <td>${task.link ? `<a href="${task.link}" target="_blank">Link</a>` : 'N/A'}</td>
            <td>
                <button onclick="markTaskComplete(${tasks.indexOf(task)})">${task.completed ? "Undo" : "Complete"}</button>
                <button onclick="confirmDeleteTask(${tasks.indexOf(task)})">Delete</button>
            </td>
        `;
        taskListEl.appendChild(row);
    });
}

function renderCalendar() {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    calendarEl.innerHTML = "";
    calendarMonthEl.textContent = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" });

    for (let i = 0; i < firstDay; i++) {
        calendarEl.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayCell = document.createElement("div");
        dayCell.textContent = day;
        const dayTasks = tasks.filter(task => task.date === date);

        if (dayTasks.length) {
            dayCell.classList.add("has-tasks");
            if (dayTasks.every(task => task.completed)) {
                dayCell.classList.add("completed");
            }
            dayCell.addEventListener("click", () => showPopup(dayTasks));
        }
        calendarEl.appendChild(dayCell);
    }
}

function showPopup(dayTasks) {
    popup.style.display = "block";
    popupTasksEl.innerHTML = ""; // Clear previous tasks

    dayTasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${task.title}</strong><br>
            Priority: ${task.priority}<br>
            ${task.completed ? "<span style='color:green;'>✔ Completed</span><br>" : ""}
            ${task.link ? `<a href="${task.link}" target="_blank">Link</a>` : "No link"}
        `;
        popupTasksEl.appendChild(li);
    });
}

function closePopup() {
    popup.style.display = "none";
}

function confirmDeleteTask(index) {
    const task = tasks[index];
    if (confirm(`Are you sure you want to delete the task: "${task.title}"? This action cannot be undone.`)) {
        deleteTask(index);
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    renderCalendar();
}

function markTaskComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    renderCalendar();
}

function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate() +1).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();
renderCalendar();
