(function () {
  let todoArray = [];
  let listName = "";

  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Что нужно сделать?";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить задачу";

    button.disabled = true;
    input.addEventListener("input", function () {
      if (input.value.trim() !== "") {
        button.disabled = false;
      }
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    item.textContent = obj.name;

    if (obj.done == true) {
      item.classList.add("list-group-item-success");
    }

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    doneButton.addEventListener("click", function () {
      obj.done = !obj.done;
      item.classList.toggle("list-group-item-success");
      saveList(todoArray, listName);
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        for (let i = 0; i < todoArray.length; i++) {
          if (todoArray[i].id == obj.id) {
            todoArray.splice(i, 1);
            break;
          }
        }
        item.remove();
        saveList(todoArray, listName);
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) {
        max = item.id;
      }
    }
    return max + 1;
  }

  function createTodoApp(container, title = "Список дел", myListName, defArr = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    listName = myListName;

    let listData = localStorage.getItem(listName);

    if (listData !== null && listData !== "") {
      todoArray = JSON.parse(listData);
    } else {
      todoArray = defArr;
      saveList(todoArray, listName);
    }

    for (const element of todoArray) {
      let todoItem = createTodoItem(element);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let itemObj = {
        id: getNewID(todoArray),
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoItem(itemObj);
      todoArray.push(itemObj);
      todoList.append(todoItem.item);

      todoItemForm.input.value = "";
      todoItemForm.button.disabled = true;

      saveList(todoArray, listName);
    });
  }

  function saveList(arr, key) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  window.createTodoApp = createTodoApp;
})();
