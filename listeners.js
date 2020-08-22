//Disable add task button for tasks > 99
var taskInput = document.getElementById('task-input');
if (taskInput.value > "99"){
    document.querySelector('.add-task-btn').disabled = true;
    document.querySelector('.add-task-btn').className+=" disabled";
}
taskInput.addEventListener('keyup',function(){
    
    (taskInput.value > "99")?document.querySelector('.add-task-btn').disabled = true:document.querySelector('.add-task-btn').disabled = false;
    (taskInput.value > "99")?document.querySelector('.add-task-btn').className+=" disabled":document.querySelector('.add-task-btn').classList.remove("disabled");
        
});