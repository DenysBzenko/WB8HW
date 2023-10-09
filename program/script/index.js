document.addEventListener('DOMContentLoaded', function() {
    class TodoItem {
        constructor(text, date) {
            this.text = text;
            this.date = date;
            this.completed = false;
            this.deleted = false;
        }
    }

    class TodoItemPremium extends TodoItem {
        constructor(text, date, icon) {
            super(text, date);
            this.icon = icon; // URL до зображення/іконки
        }
    }

    const taskList = document.getElementById('taskList');
    const newTaskInput = document.getElementById('newTask');
    const addTaskButton = document.getElementById('addTask');
    const removeCompletedButton = document.getElementById('removeCompleted');
    const removeAllButton = document.getElementById('removeAll');
    const sortAscButton = document.getElementById('sortAsc');
    const sortDescButton = document.getElementById('sortDesc');
    const clearStorageButton = document.getElementById('clearStorage');
    const pickRandomButton = document.getElementById('pickRandom');
    const iconFileInput = document.getElementById('iconFile');

    let tasks = [];
    let sortDirection = 'desc'; // за замовчуванням

    function formatDate(date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }

    function sortTasks() {
        if (sortDirection === 'desc') {
            tasks.sort((a, b) => b.date - a.date);
        } else {
            tasks.sort((a, b) => a.date - b.date);
        }
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('sortDirection', sortDirection);
    }

    function loadTasksFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        const storedSortDirection = localStorage.getItem('sortDirection');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
        if (storedSortDirection) {
            sortDirection = storedSortDirection;
        }
    }

    function pickRandomTask() {
        const activeTasks = tasks.filter(task => !task.completed && !task.deleted);
        if (activeTasks.length) {
            const randomTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
            alert(`Your task for now: ${randomTask.text}`);
        } else {
            alert('No active tasks available.');
        }
    }

    sortAscButton.addEventListener('click', function() {
        sortDirection = 'asc';
        sortTasks();
        renderTasks();
        saveTasksToLocalStorage();
    });

    sortDescButton.addEventListener('click', function() {
        sortDirection = 'desc';
        sortTasks();
        renderTasks();
        saveTasksToLocalStorage();
    });

    clearStorageButton.addEventListener('click', function() {
        localStorage.clear();
        tasks = [];
        renderTasks();
    });

    pickRandomButton.addEventListener('click', pickRandomTask);

    removeCompletedButton.addEventListener('click', function() {
        tasks = tasks.filter(task => !task.completed && !task.deleted);
        renderTasks();
    });

    taskList.addEventListener('dblclick', function(e) {
        if (e.target.tagName === 'SPAN' && !e.target.parentElement.classList.contains('deleted')) {
            const index = parseInt(e.target.nextElementSibling.getAttribute('data-index'));
            newTaskInput.value = tasks[index].text;
            newTaskInput.focus();
            newTaskInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    tasks[index].text = newTaskInput.value.trim();
                    tasks[index].date = new Date();
                    newTaskInput.value = '';
                    renderTasks();
                } else if (event.key === 'Escape') {
                    newTaskInput.value = '';
                }
            });
        }
    });

    function renderTasks() {
        taskList.innerHTML = '';
        sortTasks();
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${task.text} <small>(${formatDate(task.date)})</small></span> <button class='delete' data-index='${index}'>Delete</button>`;
            if (task.icon) {
                li.innerHTML += `<img src="${task.icon}" alt="Icon" width="50">`;
            }
            if (task.deleted) {
                li.classList.add('deleted');
            }
            if (task.completed) {
                li.classList.add('completed');
            }
            li.addEventListener('click', function(e) {
                if (e.target.tagName !== 'BUTTON') {
                    tasks[index].completed = !tasks[index].completed;
                    renderTasks();
                }
            });
            taskList.appendChild(li);
        });
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(button.getAttribute('data-index'));
                tasks[index].deleted = true;
                renderTasks();
            });
        });
    }

    addTaskButton.addEventListener('click', function() {
        const taskText = newTaskInput.value.trim();
        const iconURL = iconFileInput.value;
        if (taskText) {
            const newTask = iconURL ? new TodoItemPremium(taskText, new Date(), iconURL) : new TodoItem(taskText, new Date());
            tasks.push(newTask);
            newTaskInput.value = '';
            iconFileInput.value = '';
            renderTasks();
            saveTasksToLocalStorage();
        }
    });

    removeAllButton.addEventListener('click', function() {
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

    loadTasksFromLocalStorage();
    renderTasks();
});

    
    

    