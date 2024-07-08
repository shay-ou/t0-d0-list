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
