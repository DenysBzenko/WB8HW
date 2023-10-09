document.addEventListener('DOMContentLoaded', function() {
    class TodoItem {
        constructor(text) {
            this.text = text;
            this.date = new Date();
            this.completed = false;
            this.deleted = false;
        }
    }

    class TodoItemPremium extends TodoItem {
        constructor(text, icon) {
            super(text);
            this.icon = icon; // URL of the image/icon
        }
    }

    const DOM = {
        taskList: document.getElementById('taskList'),
        newTaskInput: document.getElementById('newTask'),
        addTaskButton: document.getElementById('addTask'),
        removeCompletedButton: document.getElementById('removeCompleted'),
        removeAllButton: document.getElementById('removeAll'),
        sortAscButton: document.getElementById('sortAsc'),
        sortDescButton: document.getElementById('sortDesc'),
        clearStorageButton: document.getElementById('clearStorage'),
        pickRandomButton: document.getElementById('pickRandom'),
        iconFileInput: document.getElementById('iconFile')
    };

    let tasks = [];
    let sortDirection = 'desc';

    function formatDate(date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }

    function sortTasks() {
        tasks.sort((a, b) => sortDirection === 'desc' ? b.date - a.date : a.date - b.date);
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('sortDirection', sortDirection);
    }

    function loadTasksFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        const storedSortDirection = localStorage.getItem('sortDirection');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
        sortDirection = storedSortDirection || 'desc';
    }

    function pickRandomTask() {
        const activeTasks = tasks.filter(task => !task.completed && !task.deleted);
        const randomTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
        alert(randomTask ? `Your task for now: ${randomTask.text}` : 'No active tasks available.');
    }

    function renderTasks() {
        DOM.taskList.innerHTML = '';
        sortTasks();
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${task.text} <small>(${formatDate(task.date)})</small></span> <button class='delete' data-index='${index}'>Delete</button>`;
            if (task.icon) {
                li.innerHTML += `<img src="${task.icon}" alt="Icon" width="50">`;
            }
            li.classList.toggle('deleted', task.deleted);
            li.classList.toggle('completed', task.completed);
            DOM.taskList.appendChild(li);
        });
    }

    function initEventListeners() {
        DOM.sortAscButton.addEventListener('click', function() {
            sortDirection = 'asc';
            renderTasks();
            saveTasksToLocalStorage();
        });

        DOM.sortDescButton.addEventListener('click', function() {
            sortDirection = 'desc';
            renderTasks();
            saveTasksToLocalStorage();
        });

        DOM.clearStorageButton.addEventListener('click', function() {
            localStorage.clear();
            tasks = [];
            renderTasks();
        });

        DOM.pickRandomButton.addEventListener('click', pickRandomTask);

        DOM.removeCompletedButton.addEventListener('click', function() {
            tasks = tasks.filter(task => !task.completed);
            renderTasks();
        });

        DOM.taskList.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                tasks[index].deleted = true;
                renderTasks();
            } else if (e.target.tagName === 'LI' || e.target.tagName === 'SPAN') {
                const li = e.target.closest('li');
                const index = Array.from(DOM.taskList.children).indexOf(li);
                tasks[index].completed = !tasks[index].completed;
                renderTasks();
            }
        });

        DOM.addTaskButton.addEventListener('click', function() {
            const taskText = DOM.newTaskInput.value.trim();
            if (taskText) {
                const iconURL = DOM.iconFileInput.value;
                const newTask = iconURL ? new TodoItemPremium(taskText, iconURL) : new TodoItem(taskText);
                tasks.push(newTask);
                DOM.newTaskInput.value = '';
                DOM.iconFileInput.value = '';
                renderTasks();
                saveTasksToLocalStorage();
            }
        });

        DOM.removeAllButton.addEventListener('click', function() {
            tasks = [];
            renderTasks();
        });
    }

    loadTasksFromLocalStorage();
    renderTasks();
    initEventListeners();
});
