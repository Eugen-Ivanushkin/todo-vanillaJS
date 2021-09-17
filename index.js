const mainDiv = document.querySelector('.main');
const input = document.querySelector('input[type  = text]');
const addButton = document.querySelector('button[type  = button]');

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

//text validation
function checkText (text){
  if(typeof text !== 'string'){
    throw new Error('The name of task must be string type');
  };
  if(text.trim().length === 0){
    throw new Error('The name of task cannot be empty');
  };
};

//Item list Model
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
// function updateTask (id, text){
//   const index = findIdx(id);
//   const  modifyTask = store.splice(index, 1)[0];
//   modifyTask.text = text;
//   store.splice(index, 0, modifyTask);

//   return modifyTask;
// };

function isDone(id){
  const index = findIdx(id);
  const  updateStatus = store.splice(index, 1)[0];


  if(updateStatus.status){
    updateStatus.status = false
  } else {
    updateStatus.status = true;
  };
  
  store.splice(index, 0, updateStatus);

  return updateStatus.status;
};

//findIndex
function findIdx(id){

  const index = store.findIndex(item => item.id === +id);

  return index;
}

//render
function render(){

  if(mainDiv.children[3] !== undefined){
    mainDiv.children[3].remove();
  };

  const ul = document.createElement('ul');
  ul.addEventListener('click', function(e){
    const id = e.target.parentElement.id;
    console.log(id);
  
    if(e.target.getAttribute('class') === 'item-delete-button'){
      deleteTask(id);
      render();
    };

    if(e.target.getAttribute('class') === 'item-isDone-button'){
      isDone(id);
      render();
    }
  });
  
  store.forEach(item =>{

    const li = document.createElement('li');
    li.setAttribute('id', item.id);
    li.setAttribute('class', 'list-item');

    const isDoneButton = document.createElement('button');
    isDoneButton.innerText = 'isDone';
    isDoneButton.setAttribute('class', 'item-isDone-button');

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'delete';
    deleteButton.setAttribute('class', 'item-delete-button');

    const p = document.createElement('p');
    p.innerText = item.text;
    item.status?
      p.classList.add('isDone')
    :
      p.classList.remove('isDone');

    li.appendChild(isDoneButton);
    li.appendChild(p);
    li.appendChild(deleteButton);
    ul.appendChild(li);
  });

  mainDiv.appendChild(ul);
};

addButton.addEventListener('click', function(){
  const taskText = input.value;
  checkText(taskText);
  createTask(taskText);
  input.value = ''
  render();
});

createTask('someTask1');
createTask('someTask2');
createTask('someTask3');

// deleteTask(1);
// updateTask (3, 'some update task')
// isDone(3);

render();


// console.log('store: ', store);