const mainDiv = document.querySelector('.main');
const input = document.querySelector('input[type  = text]');
const addButton = document.querySelector('button[type  = button]');

const store = [];

//counter
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
  }
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

}

//render
function render(){
  if(mainDiv.children[3] !== undefined){
    mainDiv.children[3].remove();
  };
  
  const ul = document.createElement('ul');
  store.forEach(item =>{

    const li = document.createElement('li');
    li.setAttribute('id', item.id);
    li.setAttribute('class', 'list-item')

    const isDoneButton = document.createElement('button');
    isDoneButton.innerText = 'isDone';

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'delete';

    const p = document.createElement('p');
    p.innerText = item.text;
    li.appendChild(isDoneButton);
    li.appendChild(p);
    li.appendChild(deleteButton);
    ul.appendChild(li)
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