// TODO 

(function() {
    // создаем и возвращаем заголовок
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }
    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder ='Введите новое дело';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.setAttribute('disabled', 'disabled')

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        }
    }
    // Создаем и возвращаем список елементов
    function createTodoList(){
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }
    
    // Блокируем добавление в список дел, если поле пустое    
    function findValue() {
        let todoItemInput = document.querySelector('.form-control');
        let button = document.querySelector('.btn');
        let timeout;
        timeout = setTimeout(inputValueHafe, 300);
        function inputValueHafe(){
            if (!!todoItemInput.value) {
                button.removeAttribute('disabled');
                } else {
                    button.setAttribute('disabled', 'disabled');
                }
            }
        }

    // вытаскиваем из localStorage дела и записываем их список
    function createTodoListStorage(title, list) {
        let todoStorage = JSON.parse(localStorage.getItem(title));
        if (todoStorage != null) {
            for (let item of todoStorage) {
                // создание и добавление в спиcок нового дела
                let todoItem = createTodoItem(item.name);
                if (item.done === true) {
                    todoItem.item.classList.toggle('list-group-item-success');
                }
                // обработчики событий 
                todoItem.doneButton.addEventListener('click', function() {
                    todoItem.item.classList.toggle('list-group-item-success');
                    // перезаписываем свойство в localStorage
                    // необходимо достать из localStorage c соответственным ключом массив
                    // // for off
                    for (let objectTodoItem of todoStorage){
                        if (objectTodoItem.name !== todoItem.item.childNodes[0].nodeValue.trim()) continue;
                            // выводим элемент цикла
                            objectTodoItem.done = !objectTodoItem.done;
                        }
                    localStorage.setItem(title, JSON.stringify(todoStorage));
                });
                todoItem.deleteButton.addEventListener('click', function() {
                    if (confirm('Вы уверены?')) {
                        todoItem.item.remove();
                        // работа с localStorage
                        let todoStorage = JSON.parse(localStorage.getItem(title));
                        for (let i = 0; i < todoStorage.length; ++i){
                            if (todoStorage[i].name !== todoItem.item.childNodes[0].nodeValue.trim()) continue;
                            todoStorage.splice(i, 1);
                        }
                        localStorage.setItem(title, JSON.stringify(todoStorage));
                    }
                });
                list.append(todoItem.item);
            }
        }
    }

    window.findValue = findValue;

    function createTodoApp(container, title = 'Список дел'){
    
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        // добавление объкта// вытаскиваем значения
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        createTodoListStorage(title, todoList);

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();
            // создание и добавление в спиcок нового дела
            let todoItem = createTodoItem(todoItemForm.input.value);

            // Создание и добавление нового дела в localstorage
            // создаю объект, для каждого дела c названием и состоянием
            let todoItemStorage = {};
            todoItemStorage.name = todoItemForm.input.value;
            todoItemStorage.done = false;
            // небходимо добавить дело в общее хранение
            if (JSON.parse(localStorage.getItem(title)) != null) {
                let todoStorage = JSON.parse(localStorage.getItem(title));
                todoStorage.push(todoItemStorage);
                localStorage.setItem(title, JSON.stringify(todoStorage))
            } else {
                localStorage.setItem(title, JSON.stringify([todoItemStorage]))
            }


            // обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');
                // перезаписываем свойство в localStorage
                // необходимо достать из localStorage c соответственным ключом массив
                todoStorage = JSON.parse(localStorage.getItem(title));
                // // for off
                for (let objectTodoItem of todoStorage){
                    if (objectTodoItem.name !== todoItem.item.childNodes[0].nodeValue.trim()) continue;
                        // выводим элемент цикла
                        objectTodoItem.done = !objectTodoItem.done;
                        todoItemStorage.done = !todoItemStorage.done;
                    }
                localStorage.setItem(title, JSON.stringify(todoStorage));
            });

            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();
                    // работа с localStorage
                    todoStorage = JSON.parse(localStorage.getItem(title));
                    for (let i = 0; i < todoStorage.length; ++i){
                        if (todoStorage[i].name !== todoItem.item.childNodes[0].nodeValue.trim()) continue;
                        todoStorage.splice(i, 1);
                    }
                    localStorage.setItem(title, JSON.stringify(todoStorage));
                    console.log(todoStorage);
                }
            });

            // создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            // обнуляем значение
            todoItemForm.input.value = '';
            todoItemForm.button.setAttribute('disabled', 'disabled');
        })
    }

    // явно регистрируем функцию в глобальном виндов, чтобы доставать его из других скриптов
    window.createTodoApp = createTodoApp;

    // Двигаемся
    function createTodoItem(name) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент который красиво покажет их в одной группе
        let content = document.createElement('div');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        content.classList.add('col')
        deleteButton.textContent = 'Удалить';

        content.textContent = name;

        // вкладываем кнопки в один элемент, чтобы объеденить в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);

        item.append(content);
        item.append(buttonGroup);

        // приложению нужен доступ к кнопкам и самому элементу
        return{
            item,
            doneButton,
            deleteButton
        };
    }
})();

























