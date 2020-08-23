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
    if(taskInput.value > 99){
        let highTaskWarning = document.createElement('div');
        highTaskWarning.setAttribute("class","alert-warning");
        highTaskWarning.innerHTML="You cannot add more than 99 tasks.";
        let cardSubtitle = document.querySelector('.task .card-subtitle');
        cardSubtitle.parentNode.insertBefore(highTaskWarning, cardSubtitle.nextSibling);
    }
}

//Dynamic button toggling based on entered value
taskInput.addEventListener('keyup',function(){
    if(taskInput.value=="" || taskInput.value < 1 ){
        addTaskBtn.disabled = true;
        addTaskBtn.className+=" disabled";
        let highTaskWarning = document.querySelector('.alert-warning');
        if(!highTaskWarning){
            let newHighTaskWarning = document.createElement('div');
            newHighTaskWarning.setAttribute("class","alert-warning");
            newHighTaskWarning.innerHTML="You must enter atleast 1 task.";
            let cardSubtitle = document.querySelector('.task .card-subtitle');
            cardSubtitle.parentNode.insertBefore(newHighTaskWarning, cardSubtitle.nextSibling);
        }


    }
    else if(taskInput.value != "" && taskInput.value <= 99){
        addTaskBtn.disabled = false;
        addTaskBtn.classList.remove("disabled");
        let highTaskWarning = document.querySelector('.alert-warning');
        if(highTaskWarning){
            highTaskWarning.parentNode.removeChild(highTaskWarning);
        }

    }
    else if(taskInput.value != "" && taskInput.value > 99){
        let highTaskWarning = document.querySelector('.alert-warning');
        if(!highTaskWarning){
            let newHighTaskWarning = document.createElement('div');
            newHighTaskWarning.setAttribute("class","alert-warning");
            newHighTaskWarning.innerHTML="You cannot add more than 99 tasks.";
            let cardSubtitle = document.querySelector('.task .card-subtitle');
            cardSubtitle.parentNode.insertBefore(newHighTaskWarning, cardSubtitle.nextSibling);
        }
        
        addTaskBtn.disabled = true;
        addTaskBtn.className+=" disabled";
    }
        
});
