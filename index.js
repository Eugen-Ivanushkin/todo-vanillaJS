const mainDiv = document.querySelector('.root');

const titleToDo = document.createElement('h1');
titleToDo.textContent = 'Todolist';

const input = document.createElement('input');
input.setAttribute('id', 'input');
input.setAttribute('type', 'text');
input.setAttribute('placeholder', 'What need to be done?');

const addBtn = document.createElement('button');
addBtn.setAttribute('id', 'add');
addBtn.setAttribute('type', 'button');
addBtn.textContent = 'Add';

const todoListEl = document.createElement('ul');
todoListEl.setAttribute('id', 'todo_list');

const buttonsActionWrapper = document.createElement('div');
buttonsActionWrapper.setAttribute('id', 'button_group');
buttonsActionWrapper.classList.add('button_group');

const showAllBtn = document.createElement('button');
showAllBtn.classList.add('group-btn', 'show-all-btn');
showAllBtn.textContent = 'All';

const showActiveBtn = document.createElement('button');
showActiveBtn.classList.add('group-btn', 'show-activ-btn');
showActiveBtn.textContent = 'Active';

const showCompletedBtn = document.createElement('button');
showCompletedBtn.classList.add('group-btn', 'show-complited-btn');
showCompletedBtn.textContent = 'Complited';

const clearCompletedBtn = document.createElement('button');
clearCompletedBtn.classList.add('group-btn', 'delete-complited');
clearCompletedBtn.textContent = 'Clear complited';

buttonsActionWrapper.append(
  showAllBtn, 
  showActiveBtn, 
  showCompletedBtn, 
  showCompletedBtn, 
  clearCompletedBtn
  );

mainDiv.append(
  titleToDo,
  input,
  addBtn,
  todoListEl,
  buttonsActionWrapper
  );

/***************LISTENERS****************/

todoListEl.addEventListener('click', function(e){
    const id = +e.target.parentElement.id;
  
    if(e.target.classList.contains('item-delete-button')){
      deleteTask(id);
      render(store);
    }
    else if(e.target.classList.contains('list-item')){
      theClick(e);
    }
    else if(e.target.classList.contains('text')){
      theClick(e);
    };

  });

  addBtn.addEventListener('click', function(){
  const taskText = input.value;
  checkText(taskText);
  createTask(taskText);
  input.value = '';
  render(store);
});

buttonsActionWrapper.addEventListener('click', function(e){
  if(e.target.classList.contains('show-all-btn')){
    render(store);
  };

  if(e.target.classList.contains('show-activ-btn')){
    render(store.filter(item => item.status === false));
  };

  if(e.target.classList.contains('show-complited-btn')){
    render(store.filter(item => item.status === true));
  };

  if(e.target.classList.contains('delete-complited')){
    isDoneDelete();
    render(store);
  };
});

//Double-click
let waitingForClick = false;

function theClick(e) {
  let id = null;
  if(e.target.classList.contains('text')){
    id = +e.target.parentElement.id;
  } 
  else if(e.target.classList.contains('list-item')){
    id = +e.target.id;
  }

  
    switch (e.detail) {
    case 1: // first click
        waitingForClick = setTimeout(function() {
          isDone(id);
          render(store);
        }, 250);
        break;
    default: // more click
        if (waitingForClick) { // remove click
            clearTimeout(waitingForClick);
            waitingForClick = false;
        }
        const inputChangeText = document.createElement('input');
        inputChangeText.classList.add('change_input');
        let textEl = null;

        if(e.target.classList.contains('text')){
          textEl = e.target;
        } 
        else if(e.target.classList.contains('list-item')){
          textEl = e.target.children[0];
        };

        inputChangeText.value = textEl.textContent;
        textEl.parentElement.prepend(inputChangeText);
        textEl.textContent = "";
        inputChangeText.focus();
        inputChangeText.onblur = function(){
          textEl.textContent = inputChangeText.value;
          inputChangeText.remove();
          updateTask(id, textEl.textContent);
          render(store);
        };

        break;
    };
};

function storeIsEmpty (){
  return store.length <= 0? true : false;
}

/**********STORE***********/
let store = [];

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

function isDoneDelete (){
  store = store.filter(item => item.status === false);
};

function showAll (){

};

//render
function render(store){
  todoListEl.innerHTML = '';
  
  store.forEach(item =>{

    const li = document.createElement('li');
    li.setAttribute('id', item.id);
    li.classList.add('list-item');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    deleteButton.classList.add('item-delete-button');

    const p = document.createElement('p');
    p.textContent = item.text;
    p.classList.add('text');
    item.status?
      p.classList.add('isDone')
    :
      p.classList.remove('isDone');

    li.append(p, deleteButton);
    todoListEl.appendChild(li);
  });

  storeIsEmpty()? buttonsActionWrapper.remove() : mainDiv.append(buttonsActionWrapper);
};

createTask('someTask1');
createTask('someTask2');
createTask('someTask3');


render(store);