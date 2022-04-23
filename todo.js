// Selectors
const list = document.querySelector('.list');
const todoInput = document.querySelector('.add-area input');
const btn_add = document.querySelector('.btn_add');
const remaningNum = document.getElementById('remaningNum');
const deleteChecked = document.getElementById('deleteChecked');
// todo array
let todoArr;

// Event Listeners
document.addEventListener("DOMContentLoaded", loadTodos);
btn_add.addEventListener("click", addItem);
todoInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        addItem();
    }
})
deleteChecked.addEventListener("click", deleteCheckedItems);

list.addEventListener('click', (event) => {
    // if <div> for checkbox is clicked
    if(event.target.classList.contains('checkbox')) {
        toggleCheckbox.call(event.target);
        return;
    }

    // if <i> inside the checkbox div is clicked
    if(event.target.closest('div').classList.contains('checkbox')) {
        toggleCheckbox.call(event.target.parentElement);
        return;
    }

    // if <i> inside the delete button is clicked
    if(event.target.parentElement.classList.contains('btn_delete')) {
        deleteItem.call(event.target.parentElement);
        return;
    }
});

list.addEventListener('dblclick', (event) => {
    if(event.target.classList.contains('description')) {
        modifyItem.call(event.target);
    }
});

// Functions
function addItem() {
    // append Item into the list
    const todoValue = todoInput.value;
    const newItem = makeItemElement(todoValue);
    list.appendChild(newItem);

    todoInput.value = '';

    // Save Todos to LOCAL STORAGE
    todoArr.push(todoValue);
    saveLocalTodos();

    remaningNum.innerText = todoArr.length;
}

function deleteItem() {
    // Get the list-item Element and its todo text
    const listItem = this.parentElement;
    const todoValue = listItem.querySelector('.description').innerText;

    // Remove item from todoArr and list Element
    const index = todoArr.indexOf(todoValue);
    todoArr.splice(index, 1);

    list.removeChild(listItem);

    // Save changed todos to Local Storage
    saveLocalTodos();

    remaningNum.innerText = todoArr.length;
}

function toggleCheckbox() {
    this.classList.toggle("checked");

    const description = this.nextSibling;

    if(this.classList.contains("checked")) {
        this.style.backgroundColor = "#ffd24d";
        description.style.textDecorationLine = "line-through";
        description.style.color = "#BFBFBF"
        description.style.fontStyle = "italic";
    } else {
        this.style.backgroundColor = "white";
        description.style.textDecorationLine = "";
        description.style.color = "black"
        description.style.fontStyle = "normal";
    }
    setRemaningNum();
}

function modifyItem() {
    const description = this;
    const oldValue = description.innerText;
    const listItem = description.parentElement;

    // Make input Element
    const input = document.createElement('input');
    input.setAttribute("type", "text");
    input.classList.add("modify");
    input.value = oldValue;
    
    // hide description area
    description.style.display = 'none';
    listItem.insertBefore(input, description);

    input.focus();
    
    // Event Listeners to end modifying
    // - 1. when click outside of input
    document.body.addEventListener('click', onClickBody);

    // - 2. when enter key is down
    input.addEventListener("keydown", (event) => {
        if(event.key === "Enter") {
            endModify();
            document.body.removeEventListener('click', onClickBody);
        }
    });

    function onClickBody(event) {
        if(event.target != input) {
            endModify();
            document.body.removeEventListener('click', onClickBody);
        }
    }

    function endModify() {
        // Change description's text
        description.innerText = input.value;
    
        // Remove input element and show description again
        listItem.removeChild(input);
        description.style.display = 'block';
    
        // Change todoArr and Save to Local Storage
        const index = todoArr.indexOf(oldValue);
        todoArr[index] = description.innerText;   
        saveLocalTodos();
    }
}

function deleteCheckedItems() {
    const checkedBoxes = list.querySelectorAll('.checked');
    if(checkedBoxes) {
        checkedBoxes.forEach((checkbox) => {
            // Get todo text
            let listItem = checkbox.parentElement;
            let todoValue = listItem.querySelector('.description').innerText;

            // Remove item from todoArr
            const index = todoArr.indexOf(todoValue);
            todoArr.splice(index, 1);

            list.removeChild(listItem);
        });
        // Save changed todos to Local Storage
        saveLocalTodos();
    }
}

function makeItemElement(todoValue) {
    // Make list-item
    const listItem = document.createElement("li");
    listItem.classList.add("list-item");

    // Make Checkbox
    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");
    checkbox.innerHTML = "<i class='fas fa-check'></i>";
    listItem.appendChild(checkbox);

    // Make Description
    const description = document.createElement("span");
    description.innerHTML = todoValue;
    description.classList.add("description");
    listItem.appendChild(description);

    // Make Delete Button
    const btn_delete = document.createElement("button");
    btn_delete.classList.add("btn_delete");
    btn_delete.setAttribute("type", "button");
    btn_delete.innerHTML = "<i class='fa fa-trash' aria-hidden='true'></i>";
    listItem.appendChild(btn_delete);

    // Example
    /*
    <li class="list-item">
        <div class="checkbox">
            <i class="fas fa-check" aria-hidden="true"></i>
        </div>
        <span class="description">강아지와 놀아주기</span>
        <button class="btn_delete" type="button">
            <i class="fa fa-trash" aria-hidden="true"></i>
        </button>
    </li>
    */

    return listItem;
}

function saveLocalTodos() {
    localStorage.setItem("todoArr", JSON.stringify(todoArr));
}

function loadTodos() {
    todoArr = getTodoArr();

    todoArr.forEach((todoValue) => {
        list.appendChild(makeItemElement(todoValue));
    });
    
    remaningNum.innerText = todoArr.length;
}

// check if 'todoArr' exists in Local Storage and Return an array
function getTodoArr() {
    let todos;
    if(localStorage.getItem("todoArr") === null) {
        // if todoArr doesn't exist in Local Storage
            // make an empty arr
            todos = [];
    } else {
    // if todoList exists in Local Storage
        // get todoList from Local Storage
        todos = JSON.parse(localStorage.getItem("todoArr"));
    }

    return todos;
}

function setRemaningNum() {
    const checkedItem = list.querySelectorAll('.checked');
    remaningNum.innerText = todoArr.length - checkedItem.length;
}
