//Disable add task button for tasks > 99
var taskInput = document.getElementById('task-input');
var addTaskBtn = document.querySelector('.add-task-btn');
if (taskInput.value > 99 || taskInput.value == ""){
    addTaskBtn.disabled = true;
    addTaskBtn.className+=" disabled";
}
taskInput.addEventListener('keyup',function(){
    console.log(taskInput.value);
    console.log(taskInput.value>99);
    if(taskInput.value==""){
        console.log('Value null');
        addTaskBtn.disabled = true;
        addTaskBtn.className+=" disabled"
    }
    else if(taskInput.value != "" && taskInput.value <= 99){
        console.log('Value less than 99');
        addTaskBtn.disabled = false;
        addTaskBtn.classList.remove("disabled");
    }
    else if(taskInput.value != "" && taskInput.value > 99){
        console.log('Value more than 99');
        addTaskBtn.disabled = true;
        addTaskBtn.className+=" disabled";
    }
        
});