import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://cart-desu-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

function getUID() {
    let uid = localStorage.getItem("userUID");
    if (!uid) {
        uid = 'uid-' + Math.random().toString(36).substr(2, 16);
        localStorage.setItem("userUID", uid);
    }
    return uid;
}

const userUID = getUID();
const shoppingListInDB = ref(database, `shoppingList/${userUID}`);

let inputEl = document.getElementById("input-field");
let addBtn = document.getElementById("add-btn");
let ulEl = document.getElementById("shopping-list");
let del = document.getElementById("delete-btn");

addBtn.addEventListener("click", function () {
    let inputValue = inputEl.value;
    if (inputValue.trim() !== "") {
        push(shoppingListInDB, { text: inputValue, checked: false });
        clearInputField();
    }
});

onValue(shoppingListInDB, function (snapshot) {
    clearShoppingList();
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        itemsArray.forEach((currentItem) => {
            addToCart(currentItem);
        });
    } else {
        ulEl.innerHTML = "I know you can do it :)";
    }
});

function addToCart(item) {
    let itemID = item[0];
    let itemValue = item[1];

    if (typeof itemValue.text === 'undefined') {
        console.error("itemValue.text is undefined for item:", item);
        return;
    }

    let newEl = document.createElement("li");

    newEl.style.alignItems = "center";
    newEl.style.padding = "20px 0";
    newEl.style.fontFamily = "georgia";
    newEl.className = "list-item form-check";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox-${itemID}`;
    checkbox.checked = itemValue.checked;
    checkbox.className = "form-check-input";

    let label = document.createElement("label");
    label.setAttribute("for", `checkbox-${itemID}`);
    label.textContent = itemValue.text;
    label.className = "form-check-label";

    if (checkbox.checked) {
        label.style.textDecoration = "line-through";
    } else {
        label.style.textDecoration = "none";
    }

    checkbox.addEventListener("change", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${userUID}/${itemID}`);
        update(exactLocationOfItemInDB, {
            checked: checkbox.checked
        });
        if (checkbox.checked) {
            label.style.textDecoration = "line-through";
        } else {
            label.style.textDecoration = "none";
        }
    });

    newEl.appendChild(checkbox);
    newEl.appendChild(label);

    ulEl.append(newEl);
}

del.addEventListener("click", function () {
    remove(shoppingListInDB);
});

function clearInputField() {
    inputEl.value = "";
}

function clearShoppingList() {
    ulEl.innerHTML = "";
}
