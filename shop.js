 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://cart-desu-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
let inputEl = document.getElementById("input-field")
let addBtn = document.getElementById("add-btn")
let ulEl = document.getElementById("shopping-list")
let del = document.getElementById("delete-btn")


addBtn.addEventListener("click", function () {
    let inputValue = inputEl.value
    if (inputValue.trim() !== "") {
        push(shoppingListInDB, { text: inputValue, checked: false })
        clearInputField()
    }
})



onValue(shoppingListInDB, function (snapshot) {   //updates the database after aby change
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingList()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            addToCart(currentItem)

        }
    }
    else {
        ulEl.innerHTML = "i know you can do it:)"
    }

})



function addToCart(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")



    newEl.style.alignItems = "center"
    newEl.style.padding = "20px 0"
    newEl.style.fontFamily = "georgia"
    newEl.className = "list-item"

    let checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.style.marginRight = "10px"
    checkbox.checked = itemValue.checked

    if (checkbox.checked) {
        newEl.style.textDecoration = "line-through" // Add strikethrough if checked
    } else {
        newEl.style.textDecoration = "none"
    }
    checkbox.addEventListener("change", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        update(exactLocationOfItemInDB, {
            checked: checkbox.checked
        })
        if (checkbox.checked) {
            newEl.style.textDecoration = "line-through" // Optional: Add a strikethrough style
        } else {
            newEl.style.textDecoration = "none"
        }
    })


    newEl.appendChild(checkbox)
    newEl.appendChild(document.createTextNode(itemValue.text))


    del.addEventListener("click", function () {

        remove(shoppingListInDB)
    })

    ulEl.append(newEl)
}
function clearInputField() {
    inputEl.value = ""
}
function clearShoppingList() {
    ulEl.innerHTML = ""
}
