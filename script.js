// Light/Dark Theme
const themeSwitch = document.querySelector('.title > img')
const bodyTag = document.querySelector('body')

// Main Elements
const tasksContainerEl = document.querySelector('.tasks')
const inputTaskEl = document.getElementById('input-task')
const taskEl = document.getElementsByClassName('task')
const deleteTaskBtnEl = document.getElementsByClassName('delete-btn')

// Buttons and countText
const selectAllBtnEl = document.querySelector('.tasks-information > button:first-child')
const clearCompletedEl = document.querySelector('.tasks-information > button:last-child')
const itemsLeftEl = document.querySelector('.tasks-container > p:first-of-type')

// Filters
const filterAllEl = document.getElementById('filter-all')
const filterActiveEl = document.getElementById('filter-active')
const filterCompletedEl = document.getElementById('filter-completed')

let tasksElArray = []
let todoTasksArray = []


/************************* 
Event Listeners
*************************/
window.addEventListener('DOMContentLoaded', getLocalStorage)
themeSwitch.addEventListener('click', switchTheme)

inputTaskEl.addEventListener('keyup', addTodoTask)
selectAllBtnEl.addEventListener('click', selectAllTasks)
clearCompletedEl.addEventListener('click', clearCompleted)

filterAllEl.addEventListener('click', showAll)
filterActiveEl.addEventListener('click', showActive)
filterCompletedEl.addEventListener('click', showCompleted)




/************************* 
Local Storage // ON WINDOW OPEN FUNCTIONS
*************************/
const tasksLocalStorage = JSON.parse(localStorage.getItem('todoTasks'))

// Retrieve tasks from local storage
function getLocalStorage(){
  if(tasksLocalStorage.length !== 0){
    todoTasksArray = tasksLocalStorage
    populateApp()
  }else{
    todoTasksArray = []
  }
}

// Update storage from todoTasksArray
function updateStorage(){
  localStorage.setItem('todoTasks', JSON.stringify(todoTasksArray))
}

// Update array from storage and populate app
function populateApp(){
  for (i = 0; i < todoTasksArray.length; i++){
    tasksContainerEl.innerHTML += `
    <div class="task">
      <button></button>
      <p>${todoTasksArray[i]}</p>
      <div class="button-container">
        <img class='delete-btn' src="misc/images/icon-cross.svg"/>
      </div>
    </div>
    `
  }
  addTaskListeners()
  addDeleteListeners()
  updateTaskCount()
}

/************************* 
App Functionality
 *************************/
// Change theme (Dark <-> Light)
function switchTheme(){
  if(bodyTag.classList[0].indexOf('dark-theme') == -1){
    bodyTag.classList.replace('light-theme', 'dark-theme')
    themeSwitch.src="misc/images/icon-sun.svg"
  }else{
    bodyTag.classList.replace('dark-theme', 'light-theme')
    themeSwitch.src="misc/images/icon-moon.svg"
  }
}

// Dynamically insert task
function addTodoTask(e){
  if(e.key === 'Enter'){
    let inputIsValid = validateInput()
    if(inputIsValid){
      tasksContainerEl.innerHTML += `
      <div class="task">
      <button></button>
      <p>${inputTaskEl.value}</p>
      <div class="button-container">
      <img class='delete-btn' src="misc/images/icon-cross.svg" />
      </div>
      </div>
    `
    addTaskListeners()
    addDeleteListeners()
    updateStorage()
    updateTaskCount()
    }
  }
}
/********* Make sure input is NOT EMPTY and NOT DUPLICATE ******/
function validateInput(){
  let inputNotEmpty = checkEmptyInput()
  let taskIsDuplicate = checkDuplicateTask()
  if(inputNotEmpty && !taskIsDuplicate){
    return true
  }
}
function checkEmptyInput(){
  if(inputTaskEl.value.length !== 0){
    return true
  }
}
function checkDuplicateTask(){
  for (let task of todoTasksArray){
    if(inputTaskEl.value == task){
      return true
    }
  } 
}
/**************************************************************/


/******Add Event listeners to dynamically inserted tasks*******/
function addTaskListeners(){
  todoTasksArray = []
  tasksElArray = []
  for (let task of taskEl){
    tasksElArray.push(task)
    todoTasksArray.push(task.children[1].textContent)
    task.addEventListener('click', taskComplete)

    // Show/Hide X button on task-hover
    let deleteBtn = task.children[2].children[0]
    task.addEventListener('mouseover', function(){
      deleteBtn.style.visibility = 'visible'
    })
    task.addEventListener('mouseout', function(){
      deleteBtn.style.visibility= 'hidden'
    })
  }
}
  // Add Event listeners to dynamically inserted tasks > X button
  function addDeleteListeners(){
    for (let deleteBtn of deleteTaskBtnEl){
    deleteBtn.addEventListener('click', deleteTask)
    }
}
/**************************************************************/

/********************Task Completion***************************/
// Task is clicked -- add "checked" class
function taskComplete(e){
  //If parentElement clicked good, else give parent the class 
  if(e.target.classList[0] == 'task'){
    e.target.classList.toggle('checked')
  }else{
    e.target.parentElement.classList.toggle('checked')
  }
  updateTaskCount()
}

// Add "checked" class to all tasks
function selectAllTasks(){
  for(let task of tasksElArray){
    task.classList.toggle('checked')
  }
  updateTaskCount()
}

// Clear all "checked" tasks
function clearCompleted(){
  let arrayLength = tasksElArray.length -1
  for(let i = arrayLength; i >= 0; i--){
    if(tasksElArray[i].classList.contains('checked') == true){
      // Remove the div from tasks elements array
      tasksElArray.splice([i], 1)
      /* Remove the todo tast TEXT from todoTasksArray and use it to update local storage */
      todoTasksArray.splice([i], 1)
      // Remove the element itself from the DOM
      taskEl[i].remove()
    }
  }
  updateStorage()
  updateTaskCount()
}
/***************************************************************/

/*********************Task Deletion*****************************/
// When Element is MOUSEDOVER, show Delete (X) Button
function showDeleteBtn(e){
  for(let deleteBtn of deleteTaskBtnEl){
    deleteBtn.addEventListener('mouseover', function(){
      deleteBtn.style.visibility = 'visible'
    })
    deleteBtn.addEventListener('mouseout', function(){
      deleteBtn.style.visibility= 'hidden'
    })
  }
}

// When Delete (X) is CLICKED
function deleteTask(e){
  // Get the text content of parentElement of delete-btn clicked
  let taskText = e.target.parentElement.parentElement.children[1].textContent
  for (let i = 0; i < todoTasksArray.length; i++){
    if(taskText == todoTasksArray[i]){
      todoTasksArray.splice([i], 1)
      tasksElArray.splice([i], 1)
      e.target.parentElement.parentElement.remove()
    }
  }
  updateStorage()
  updateTaskCount()
}
/***************************************************************/

// Display how many tasks remaining ("x Items Left")
function updateTaskCount(){
  let num = tasksElArray.length
  for(let task of tasksElArray){
    if(task.classList.contains('checked')){
      num--
    }
  }
  // Item( s )
  if(num !== 1){
  itemsLeftEl.textContent = `${num} Items left`
  }else{
    itemsLeftEl.textContent = `${num} Item left`
  }
}


/************************* 
Filters
*************************/
// Show All tasks
function showAll(){
  for(let task of taskEl){
    task.style.display = 'flex'
  }
}

// Show Active tasks
function showActive(){
  // Reset first
  showAll()
  // Then filter
  for(let task of taskEl){
    if(task.classList.contains('checked')){
      task.style.display = 'none'
    }
  }
}

// Show Completed tasks

function showCompleted(){
  // Reset first
  showAll()
  // Then filter
  for(let task of taskEl){
    if(!task.classList.contains('checked')){
      task.style.display = 'none'
    }
  }
}








/************************* 
Event Listeners
*************************/
/************************* 
Event Listeners
*************************/