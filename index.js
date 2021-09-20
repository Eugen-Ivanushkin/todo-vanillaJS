const mainDiv = document.querySelector('.main');
const input = document.querySelector('#input');
const addButton = document.querySelector('#add');
const ul = document.querySelector('#todo_list');

/***************LISTENERS****************/

  ul.addEventListener('click', function(e){
    const id = +e.target.parentElement.id;
  
    if(e.target.getAttribute('class') === 'item-delete-button'){
      deleteTask(id);
      render();
    };

    if(e.target.getAttribute('class') === 'text'){
      theClick(e);
    } 
    else if(e.target.getAttribute('class') === 'text isDone'){
      theClick(e);
    }
  });

  addButton.addEventListener('click', function(){
  const taskText = input.value;
  checkText(taskText);
  createTask(taskText);
  input.value = '';
  render();
});

//Double-click
let waitingForClick = false;

function theClick(e) {
  const id = +e.target.parentElement.id;
    switch (e.detail) {
    case 1: // first click
        waitingForClick = setTimeout(function() {
          isDone(id);
          render();
        }, 250);
        break;
    default: // more click
        if (waitingForClick) { // remove click
            clearTimeout(waitingForClick);
            waitingForClick = false;
        }
        const inputChangeText = document.createElement('input');
        const textEl = e.target;
        inputChangeText.value = e.target.textContent;
        textEl.parentElement.prepend(inputChangeText);
        textEl.innerHTML = "";
        inputChangeText.focus();
        inputChangeText.onblur = function(){
          textEl.textContent = inputChangeText.value;
          inputChangeText.remove();
          updateTask(id, textEl.textContent);
          render();
        };

        break;
    };
};

/**********STORE***********/
const store = [];

/********COUNTER**********/
function counter(){
  let count = 0;

  return {
    increment: function(){
      return ++count;
    }
  };
};

const id = counter();

//Text validation
function checkText (text){
  if(typeof text !== 'string'){
    throw new Error('The name of task must be string type');
  };
  if(text.trim().length === 0){
    throw new Error('The name of task cannot be empty');
  };
};

//Item list model
function ListItemModel (text){
  checkText (text);

  this.text = text;
  this.status = false;
  this.id = id.increment();
};

//create task
function createTask(text){
  const newTask = new ListItemModel(text);
  store.push(newTask);

  return newTask;
};

//delete
function deleteTask (id){
  const index = findIdx(id);
  const deleteEl = store.splice(index, 1);

  return deleteEl;
};

//udate
function updateTask (id, text){
  const index = findIdx(id);
  const  modifyTask = store.splice(index, 1)[0];
  modifyTask.text = text;
  store.splice(index, 0, modifyTask);

  return modifyTask;
};

function isDone(id){
  const index = findIdx(id);
  const  updateStatus = store.splice(index, 1)[0];

  updateStatus.status = !updateStatus.status
  
  store.splice(index, 0, updateStatus);

  return updateStatus.status;
};

//findIndex
function findIdx(id){

  const index = store.findIndex(item => item.id === +id);

  return index;
};

//render
function render(){
  ul.innerHTML = '';
  
  store.forEach(item =>{

    const li = document.createElement('li');
    li.setAttribute('id', item.id);
    li.setAttribute('class', 'list-item');

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'delete';
    deleteButton.setAttribute('class', 'item-delete-button');

    const p = document.createElement('p');
    p.innerText = item.text;
    p.classList.add('text');
    item.status?
      p.classList.add('isDone')
    :
      p.classList.remove('isDone');

    li.appendChild(p);
    li.appendChild(deleteButton);
    ul.appendChild(li);
  });
  
};

createTask('someTask1');
createTask('someTask2');
createTask('someTask3');

render();

//Использовать classlist

//Добавить стили

//Переделать под реакт с <div id="root">