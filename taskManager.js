var serverStatusList = {
}
const TASK_DURATION = 3000;
const MAX_SERVERS = 10;
const ALERT_DURATION = 5000;
var taskQueue = [];
var pendingTasks = 0;
var serversToRemove = 0;


function alert(message){

    var alert = document.createElement('div');
    var existingAlert = document.querySelector('.alert-error');
    var cardTitle = document.querySelector('.card-title');
    alert.setAttribute("class","alert-error");
    var alertText = document.createElement('span');
    alertText.innerHTML = "<strong>"+message+"</strong>";
    alert.appendChild(alertText);
    if(!existingAlert){
        cardTitle.parentNode.insertBefore(alert, cardTitle.nextSibling);
    }
    else{
        existingAlert.parentNode.insertBefore(alert, existingAlert.nextSibling);
    }
    
    
   
    setTimeout(function(){
        alert.parentElement.removeChild(alert);
    },ALERT_DURATION);
}
//Checks server status - returns first available server
function checkServerAvailability(){
    var serverIsAvailable = false;
    var availableServerID = '';
    //Traverse through server list and return next available server
    for (const [serverNumber, status] of Object.entries(serverStatusList)) {
        //debugger;
        if(!status) {
            console.log('First available server - '+serverNumber);
            serverIsAvailable = true;
            availableServerID = serverNumber;
            return parseInt(availableServerID,10);
            
        }
        // else if(status){
        //     console.log('Next available server - '+parseInt(parseInt(serverNumber,10)+parseInt(1,10),10));
        //     return parseInt(serverNumber,10)+parseInt(1,10);
        // }
        else{
            serverIsAvailable = false;
        }
    }

    return (serverIsAvailable)? parseInt(availableServerID,10):"unavailable";
    
}

function createTaskProgressBar(serverListContainer, availableServerNumber=null, i=null){
    
    var taskProgressBar = document.createElement('progress');
    taskProgressBar.setAttribute("class","task-progress-bar");
    taskProgressBar.setAttribute("id","task-progress-bar-"+i);
    taskProgressBar.setAttribute("max",TASK_DURATION);
    taskProgressBar.setAttribute("value","0");
    
   

    
    serverListContainer.querySelector('#server-'+availableServerNumber).appendChild(taskProgressBar);
    toggleServer(availableServerNumber, true);

    //Allocate task only if server is available
    let progressBarValue = 0;
    var taskProgressBarIntervalID = setInterval(function(){
        //console.log(progressBarValue);
        
        //debugger;
        taskProgressBar.setAttribute("value",progressBarValue);
        progressBarValue+=1000;

        //debugger;
        if(progressBarValue >= TASK_DURATION){
            taskProgressBar.setAttribute("value",TASK_DURATION);
                    
            clearInterval(taskProgressBarIntervalID);
            toggleServer(availableServerNumber, false);
            console.log('Pending tasks'+pendingTasks);
            setTimeout(function(){

                taskProgressBar.parentNode.removeChild(taskProgressBar);
                document.querySelector('.task-counter div').innerHTML = pendingTasks;
               
                if(serversToRemove>0){
                    for(let i=1;i<=serversToRemove;i++, serversToRemove--){
                        
                        var serverBoxToRemove = serverListContainer.lastElementChild;
                        var serverIDToRemove = serverListContainer.lastElementChild.id.substr(-1);
                        delete serverStatusList[serverIDToRemove];
                        serverBoxToRemove.parentNode.removeChild(serverBoxToRemove);
                    }
                }
                if(pendingTasks==0){
                    //Always keep 1 server active - delete 2 to N servers
                    // var serverBox = serverListContainer.firstElementChild.nextElementSibling;
                
                
                    // if(serverBox) {
                    //     var serverToRemove = serverBox.id.substr(-1);
                    //     serverBox.parentNode.removeChild(serverBox);
                    //     delete serverStatusList[serverToRemove];
                    //     console.log(serverStatusList);

                    // }
                    
                }
                else{
                    //debugger;
                    availableServerNumber = checkServerAvailability();
                    if(Number.isInteger(availableServerNumber)){
                        runPendingTasks(availableServerNumber);
                    }
                    
                }
                //console.log(serverStatusList);
            },2000);
    
        }
    },1000)
}

//Creates individual server boxes
function createServerBox(currentServerID){
    var serverListContainer = document.querySelector('.server-list-container');
    var newServerBox = document.createElement('div');
    var serverNumber = document.createElement('span');
    var newServerBoxInner = document.createElement('div');
    serverNumber.innerHTML = currentServerID;
    newServerBoxInner.setAttribute("class","server-box");

    newServerBox.setAttribute("class","server-box-container");
    newServerBox.setAttribute("id","server-"+currentServerID);

    newServerBox.appendChild(newServerBoxInner);

    newServerBoxInner.appendChild(serverNumber)
    serverListContainer.appendChild(newServerBox);
}


function runPendingTasks(addedServerID){
    var serverListContainer = document.querySelector('.server-list-container');
    var taskListContainer = document.querySelector('.task-list-container');
    if(pendingTasks>0){
        var lastTask = taskListContainer.lastElementChild;
        //debugger;
        console.log('Checking pending tasks -'+pendingTasks);
        createTaskProgressBar(serverListContainer, addedServerID);
        pendingTasks--;
        taskListContainer.removeChild(lastTask);

    }
}

//Adds server to DOM
function addServer(firstime=false){
    //Get most recent server
    //var addedServerID = '';
    console.log(Object.keys(serverStatusList));
    console.log(serverStatusList);
    //addedServerID = (firstime)?Object.keys(serverStatusList).length+1:Object.keys(serverStatusList).length;
    var addedServerID = Object.keys(serverStatusList).length+1;
    console.log('Added server ID '+addedServerID);

    (firstime)?document.querySelector('.remove-server-btn').disabled = true:document.querySelector('.remove-server-btn').disabled = false;
    (firstime)?document.querySelector('.remove-server-btn').className+=" disabled":document.querySelector('.remove-server-btn').classList.remove("disabled");

    //A maximum of 10 servers can be added
    if(addedServerID<=MAX_SERVERS){
        createServerBox(addedServerID);
        serverStatusList[addedServerID] = false;
        runPendingTasks(addedServerID);
        

    }
    if(addedServerID == "10"){
        alert("ERROR! You cannot add more than 10 servers");


        document.querySelector('.add-server-btn').disabled = true
        document.querySelector('.add-server-btn').className+=" disabled"; 
    }

}

function removeServer(){
    var serverListContainer = document.querySelector('.server-list-container');
    var lastServerBox = serverListContainer.lastElementChild;
    var serverIsBusy = (lastServerBox.childNodes.length == 2)?true:false;
    var lastServerID = serverListContainer.lastElementChild.id.substr(-1);
    serversToRemove++;
    //debugger;
    //Remove server if idle (do not remove if server to remove is #1)
    if(!serverIsBusy && lastServerID != "1"){
        document.querySelector('.add-server-btn').disabled = false;  
        document.querySelector('.add-server-btn').classList.remove("disabled");
        lastServerBox.parentNode.removeChild(lastServerBox);
        delete serverStatusList[lastServerID];
    }
    if(lastServerID == "2" || lastServerID == "1"){
        document.querySelector('.add-server-btn').disabled = false;  
        document.querySelector('.add-server-btn').classList.remove("disabled");
        document.querySelector('.remove-server-btn').disabled = true  
        document.querySelector('.remove-server-btn').className+=" disabled";
    }


}

//Get status of given server number
function getServerStatus(serverNumber){
    return serverStatusList[serverNumber];
}

//Print of all servers
function displayServerStatusList(){
    for (const [serverNumber, status] of Object.entries(serverStatusList)) {
        //console.log(`${serverNumber}: ${status}`);
    }
}

function getFromQueue(element){
    var fetchedElement = '';
    for(let i=0;i<taskQueue.length;i++){
        if(taskQueue[i] === element){
            fetchedElement = element;
        }
    }
    return fetchedElement;
}

//Toggles server based on status
function toggleServer(serverNumber, status){
    serverStatusList[serverNumber] = status;
}


function deleteTask(task){
    var taskProgressBar = document.querySelector('#task-progress-bar-'+task);
    var taskListContainer = document.querySelector('.task-list-container');
    if(taskProgressBar.parentNode.parentNode.isSameNode(taskListContainer)){
        var taskToRemove = document.querySelector('#task-'+task)
        taskProgressBar.parentNode.parentNode.removeChild(taskToRemove);
    }
}

//Creates task progress bar
function createTask(serverListContainer, noOfTasks, addedServerID){
    
    pendingTasks += parseInt(noOfTasks,10);
    if(pendingTasks <= 99){
        var taskCounterDiv = document.querySelector('.task-counter div');
        taskCounterDiv.innerHTML = pendingTasks;
        console.log('Created task --- now pending'+pendingTasks);
        for(let i=1;i<=noOfTasks;i++){  
            //debugger;
       
            //Server availability check
            //debugger;
            var availableServerNumber = checkServerAvailability();
            //debugger;
        
            if(Number.isInteger(availableServerNumber)){
            
                //debugger;
                pendingTasks--;
                console.log('Server is available --- Pending taks '+pendingTasks);
                createTaskProgressBar(serverListContainer, availableServerNumber, addedServerID, i);
            
            

            }
            else{
                
                //No server available, add tasks to queue
                //Task container (for bar and delete button)
                var taskContainer = document.createElement('div');
                taskContainer.setAttribute("class", "task-bar-container")
                taskContainer.setAttribute("id", "task-"+i);

                //Actual task progress bar
                var taskProgressBar = document.createElement('progress');
                taskProgressBar.setAttribute("class","task-progress-bar");
                taskProgressBar.setAttribute("id","task-progress-bar-"+i);
                taskProgressBar.setAttribute("max",TASK_DURATION);
                taskProgressBar.setAttribute("value","0");

                //Delete button
                var deleteTaskBtn = document.createElement('button');
                deleteTaskBtn.setAttribute("class","delete-task-btn");
                deleteTaskBtn.setAttribute("id","delete-btn-"+i);
                deleteTaskBtn.setAttribute("onclick", "deleteTask("+i+");");

                //Delete icon
                var deleteIcon = document.createElement("img");
                deleteIcon.setAttribute("src","./assets/icons/delete.svg");
                deleteIcon.setAttribute("class","delete");

                deleteTaskBtn.appendChild(deleteIcon);

                var taskListContainer = document.querySelector('.task-list-container');
                taskContainer.appendChild(taskProgressBar);
                taskContainer.appendChild(deleteTaskBtn);
                taskListContainer.appendChild(taskContainer);
                
            

            }
   
        }
    }
    else{
        alert("ERROR! You cannot have more than 99 pending tasks");
    }
    

   
   
}


//Adds task to DOM
function addTask(){
    var addedServerID = Object.keys(serverStatusList).length;
    var noOfTasks = document.getElementById('task-input').value;
    var serverListContainer = document.querySelector('.server-list-container');
    createTask(serverListContainer, noOfTasks, addedServerID);
    
}

addServer(true);



