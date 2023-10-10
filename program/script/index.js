document.addEventListener('DOMContentLoaded', function() {
    class TodoItem {
        constructor(text) {
            this.text = text;
            this.date = new Date();
            this.completed = false;
            this.deleted = false;
            this.active = false; 
        }
    }

    class TodoItemPremium extends TodoItem {
        constructor(text, icon) {
            super(text);
            this.icon = icon; 
        }
    }

    const DOM = {
        taskList: document.getElementById('taskList'),
        newTaskInput: document.getElementById('newTask'),
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
        tasks = storedTasks ? JSON.parse(storedTasks).map(task => {
            task.date = new Date(task.date);
            return task;
        }) : [];
        sortDirection = storedSortDirection || 'desc';
    }

    function pickRandomTask() {
        tasks.forEach(task => task.active = false);
        const activeTasks = tasks.filter(task => !task.completed && !task.deleted);
        const randomTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
        if (randomTask) {
            randomTask.active = true; 
            alert(`Your task for now: ${randomTask.text}`);
        } else {
            alert('No active tasks available.');
        }
        renderTasks();
    }

    function renderTasks() {
        DOM.taskList.innerHTML = '';
        sortTasks();
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${task.text} <small>(${formatDate(task.date)})</small></span>`;
            if (task.icon) {
                li.innerHTML += `<img src="${task.icon}" alt="Icon" width="50">`;
            }
            li.innerHTML += `<button class='delete' data-index='${index}'>Delete</button>`;
            
            li.classList.toggle('deleted', task.deleted);
            li.classList.toggle('completed', task.completed);
            li.classList.toggle('active', task.active);
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

        DOM.newTaskInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
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
            }
        });

        DOM.removeAllButton.addEventListener('click', function() {
            if (tasks.some(task => !task.completed)) {
                const confirmDelete = confirm('Are you sure you want to delete all tasks, including uncompleted ones?');
                if (confirmDelete) {
                    tasks = [];
                    renderTasks();
                }
            } else {
                tasks = [];
                renderTasks();
            }
        });
    }

    loadTasksFromLocalStorage();
    renderTasks();
    initEventListeners();
});
