// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".todo-form");
const task = document.getElementById("task");
const addBtn = document.querySelector(".addBtn");
const saveBtnEmptyList = document.querySelector(".saveBtnEmptyList");
const container = document.querySelector(".todo-container");
const list = document.querySelector(".todo-list");
const clearBtn = document.querySelector(".clearBtn");
const emptyBtn = document.querySelector(".emptyBtn");
const saveBtn = document.querySelector(".saveBtn");

//edit values
let nTasks = 0;

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addTask);
clearBtn.addEventListener('click', clearList);
emptyBtn.addEventListener('click', emptyList);
saveBtn.addEventListener('click', saveList);
saveBtnEmptyList.addEventListener('click', saveList);
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
// add task to the list
function addTask (e) {
    e.preventDefault();
    const value = task.value;
    const id = new Date().getTime().toString();

    if(value && e.submitter === addBtn) {
        nTasks++;
        createListItem(id, value);
        // display alert
        displayAlert('Tarea añadida a la lista', "success");
        // hide save button
        saveBtnEmptyList.classList.add('hide-btn');
        // show container with items
        container.classList.add("show-container");
        // set back to default
        setBackToDefault();
    } else if(!value && e.submitter === addBtn) {
      displayAlert('No has escrito ninguna tarea', "danger");
    } else {
        displayAlert('Lista vacía guardada', 'success');
    }
}

// clear completed tasks from the list
function clearList() {
    const tasks = document.querySelectorAll(".todo-item");
    let nCompletedItems = 0;

    tasks.forEach((item) => {
        let element = item.querySelector("p");
        if(element.classList.contains("completed")) {
            list.removeChild(item);
            nTasks--;
            nCompletedItems++;
        }
    });

    if(nTasks === 0) {
        saveBtnEmptyList.classList.remove("hide-btn");
        container.classList.remove("show-container");
    }

    updateList();

    if(nCompletedItems > 0) {
        displayAlert('Tareas completadas eliminadas', 'danger');

    } else {
        displayAlert('No has marcado ninguna tarea como completada', 'info');
    }
}

// remove all items from the list
function emptyList() {
    const tasks = document.querySelectorAll('.todo-item');

    container.classList.remove("show-container");
    saveBtnEmptyList.classList.remove("hide-btn");

    setTimeout(() => {
        tasks.forEach((item) => {
            list.removeChild(item);
        });
    }, 350);

    nTasks = 0;

    displayAlert('Lista vaciada', "danger");
}

// update list with correct numbers
function updateList() {
    const tasks = document.querySelectorAll(".todo-item");
    nTasks = 0;

    tasks.forEach((item) => {
        nTasks++;
        let paragraph = item.querySelector("p");
        let value = paragraph.innerText.split(".")[1].trim();
        paragraph.innerText = `${nTasks}. ${value}`;
    });
}

// save list on local storage calling addToLocalStorage function
// after remove all items early
function saveList() {
    const tasks = document.querySelectorAll(".todo-item");
    console.log(tasks);
    removeAllFromLocalStorage();

    tasks.forEach((item) => {
        let paragraph = item.querySelector("p");
        let value = paragraph.innerText.split(".")[1].trim();
        let id = item.dataset.id;
        addToLocalStorage(id, value);
    });

    displayAlert('Lista guardada', 'success');
}

// mark task with line-through
function markTask(e) {
    e.target.classList.toggle("completed");
}

// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function (){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

// set back to default
function setBackToDefault() {
    task.value = "";
}

// ****** LOCAL STORAGE **********
// add item to local storage
function addToLocalStorage(id, value) {
    const task = {id, value};
    let items = getLocalStorage();
    // console.log(items);
    items.push(task);
    localStorage.setItem('list', JSON.stringify(items));
}

// remove all items from local storage
function removeAllFromLocalStorage() {
    localStorage.clear()
}

// get local storage
function getLocalStorage() {
    return localStorage.getItem('list')
        ? JSON.parse(localStorage.getItem('list')) :[];
}

// ****** SETUP ITEMS **********
// set list item
function setupItems() {
    let items = getLocalStorage();
    if(items.length > 0) {
        saveBtnEmptyList.classList.add('hide-btn');
        items.forEach(function(item) {
            nTasks++;
            createListItem(item.id, item.value);
        });
        container.classList.add('show-container');
    }
    else {
        saveBtnEmptyList.classList.remove('hide-btn');
    }
}

// create list item
function createListItem (id, value) {
    const element = document.createElement('article');
    // add class
    element.classList.add('todo-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${nTasks}. ${value}</p>`;

    // mark listener
    element.addEventListener('dblclick', markTask);

    // append child
    list.appendChild(element);
}
