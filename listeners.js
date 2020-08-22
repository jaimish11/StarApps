/**
 * Supplementary file that validates task inputs
 */

 
//Disable add task button for tasks > 99
var taskInput = document.getElementById('task-input');
var addTaskBtn = document.querySelector('.add-task-btn');

//If unwanted value is in input field on page reload
if (taskInput.value > 99 || taskInput.value == "" || taskInput.value < 1){
    addTaskBtn.disabled = true;
    addTaskBtn.className+=" disabled";
}

//Dynamic button toggling based on entered value
taskInput.addEventListener('keyup',function(){
    if(taskInput.value=="" || taskInput.value < 1 ){
        addTaskBtn.disabled = true;
        addTaskBtn.className+=" disabled"
    }
    else if(taskInput.value != "" && taskInput.value <= 99){
        addTaskBtn.disabled = false;
        addTaskBtn.classList.remove("disabled");

    }
    else if(taskInput.value != "" && taskInput.value > 99){
        addTaskBtn.disabled = true;
        addTaskBtn.className+=" disabled";
    }
        
});
