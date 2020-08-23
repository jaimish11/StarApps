/**
 * Parent file that handles server and task management
 */

//Global config and tracking variables
let serverStatusList = {}
const TASK_DURATION = 20000;
const MAX_SERVERS = 10;
const ALERT_DURATION = 5000;
let pendingTasks = 0;
let serversToRemove = 0;


/**
 * 
 * Alert function for warning popups
 * @param {String} message 
 */
function alert(message) {

    //Create element and add to DOM
    let alert = document.createElement('div');
    let existingAlert = document.querySelector('.alert-error');
    let cardTitle = document.querySelector('.card-title');
    alert.setAttribute("class", "alert-error");
    let alertText = document.createElement('span');
    alertText.innerHTML = "<strong>" + message + "</strong>";
    alert.appendChild(alertText);

    //If a previous alert exists, add the new alert as a sibling; else add as a sibling to card title
    if (!existingAlert) {
        cardTitle.parentNode.insertBefore(alert, cardTitle.nextSibling);
    }
    else {
        existingAlert.parentNode.insertBefore(alert, existingAlert.nextSibling);
    }

    //Alert to dissappear after ALERT_DURATION seconds
    setTimeout(function () {
        alert.parentElement.removeChild(alert);
    }, ALERT_DURATION);
}

/**
 * Checks first server availability
 * @returns {Number} - first available server or -1 if no server is available
 */
function checkServerAvailability() {
    let serverIsAvailable = false;
    let availableServerID = -1;

    //Traverse through server list and return first available server
    for (const [serverNumber, status] of Object.entries(serverStatusList)) {
        if (!status) {
            serverIsAvailable = true;
            availableServerID = serverNumber;
            return parseInt(availableServerID, 10);

        }
    }

    //If a server is available, return its ID, else return -1
    return (serverIsAvailable) ? parseInt(availableServerID, 10) : -1;

}



/**
 * 
 * Creates task and assigns to available server
 * @param {Object} serverListContainer 
 * @param {Number} availableServerNumber 
 * @param {Number} i 
 */
function createTaskProgressBar(serverListContainer, availableServerNumber = null, i = null) {

    //Add task to DOM
    let taskProgressBar = document.createElement('progress');
    taskProgressBar.setAttribute("class", "task-progress-bar");
    if(createTaskProgressBar.caller.name == "runPendingTasks"){
        taskProgressBar.setAttribute("id", "task-progress-bar-" + availableServerNumber);
    }else{
        taskProgressBar.setAttribute("id", "task-progress-bar-" + i);
    }
    
    taskProgressBar.setAttribute("max", TASK_DURATION);
    taskProgressBar.setAttribute("value", "0");

    serverListContainer.querySelector('#server-' + availableServerNumber + " span").innerHTML = "Busy";
    serverListContainer.querySelector('#server-' + availableServerNumber).appendChild(taskProgressBar);
    document.querySelector('.task .task-counter').innerHTML = "(" + pendingTasks + " pending tasks)";

    if(availableServerNumber > 0)   serverStatusList[availableServerNumber] = true;
    

    //Initialise progress bar
    let progressBarValue = 0;
    let taskProgressBarIntervalID = setInterval(function () {
        taskProgressBar.setAttribute("value", progressBarValue);
        progressBarValue += 1000;

        //Check if progress bar has completed
        if (progressBarValue >= TASK_DURATION) {
            taskProgressBar.setAttribute("value", TASK_DURATION);
            clearInterval(taskProgressBarIntervalID);

            setTimeout(function () {

                taskProgressBar.parentNode.removeChild(taskProgressBar);

                if(availableServerNumber > 0)   serverStatusList[availableServerNumber] = false;
                
                serverListContainer.querySelector('#server-' + availableServerNumber + " span").innerHTML = "Idle";

                //If remove a server has been clicked, remove servers after they become idle
                if (serversToRemove > 0) {

                    for (let i = 1; i <= serversToRemove; i++, serversToRemove--) {
                        let serverToRemove = checkServerAvailability();
                        let serverBoxToRemove = serverListContainer.querySelector('#server-' + serverToRemove);
                        
                        if (Object.keys(serverStatusList).length > 1) {

                            serverBoxToRemove.parentNode.removeChild(serverBoxToRemove);
                            if(serverToRemove>0)    delete serverStatusList[serverToRemove];
                            
                        }
                        else {
                            document.querySelector('.remove-server-btn').disabled = true
                            document.querySelector('.remove-server-btn').className += " disabled";
                        }

                    }
                }


                //If pending tasks exist, run them
                if (pendingTasks != 0) {
                    availableServerNumber = checkServerAvailability();
                    
                    if (availableServerNumber > 0) {
                        runPendingTasks(availableServerNumber);
                    }
                }
            }, 2000);

        }
    }, 1000)
}

/**
 * Creates server box and adds to DOM
 * @param {Number} currentServerID 
 */
function createServerBox(currentServerID) {
    let serverListContainer = document.querySelector('.server-list-container');
    let newServerBox = document.createElement('div');
    let serverNumber = document.createElement('span');
    let newServerBoxInner = document.createElement('div');
    serverNumber.innerHTML = 'Idle';
    newServerBoxInner.setAttribute("class", "server-box");

    newServerBox.setAttribute("class", "server-box-container");
    newServerBox.setAttribute("id", "server-" + currentServerID);

    newServerBox.appendChild(newServerBoxInner);

    newServerBoxInner.appendChild(serverNumber)
    serverListContainer.appendChild(newServerBox);
}


/**
 * If pending tasks exist, allocate them to a server and run them
 * @param {Number} addedServerID 
 */
function runPendingTasks(addedServerID) {
    let serverListContainer = document.querySelector('.server-list-container');
    let taskListContainer = document.querySelector('.task-list-container');
    if (pendingTasks > 0) {
        let lastTask = taskListContainer.lastElementChild;
        createTaskProgressBar(serverListContainer, addedServerID);
        pendingTasks--;
        document.querySelector('.task .task-counter').innerHTML = "(" + pendingTasks + " pending tasks)";
        if (lastTask) taskListContainer.removeChild(lastTask);

    }
}


/**
 * Server initialisation function
 * @param {Boolean} firstime 
 */
function addServer(firstime = false) {

    let numberOfServers = Object.keys(serverStatusList).length;
    let addedServerID = '';
    if(firstime)    addedServerID = numberOfServers + 1;
    else{
        addedServerID = parseInt(Object.keys(serverStatusList)[numberOfServers-1],10)+1;
    }
    
    //If function is being called for the first time, disable remove a server button, as there needs to be a minimum of 1 server
    (firstime) ? document.querySelector('.remove-server-btn').disabled = true : document.querySelector('.remove-server-btn').disabled = false;
    (firstime) ? document.querySelector('.remove-server-btn').className += " disabled" : document.querySelector('.remove-server-btn').classList.remove("disabled");


    //A maximum of 10 servers can be added
    if (addedServerID <= MAX_SERVERS) {
        createServerBox(addedServerID);
        if(addedServerID>0){
            serverStatusList[addedServerID] = false;
        }
        runPendingTasks(addedServerID);
    }

    //Trigger alert popup and disable add a server button if more than 10 servers are added
    if (addedServerID == MAX_SERVERS) {
        alert("You cannot add more than 10 servers");
        document.querySelector('.add-server-btn').disabled = true
        document.querySelector('.add-server-btn').className += " disabled";
    }

}

/**
 * Removes a server if it is idle
 */
function removeServer() {
    let serverListContainer = document.querySelector('.server-list-container');
    let lastServerBox = serverListContainer.lastElementChild;
    let serverIsBusy = (lastServerBox.childNodes.length == 2) ? true : false;
    let lastServerID = serverListContainer.lastElementChild.id.split('-')[1];
    serversToRemove++;

    //Remove server if idle (do not remove if server to remove is #1)
    if (!serverIsBusy && Object.keys(serverStatusList).length > 1) {
        document.querySelector('.add-server-btn').disabled = false;
        document.querySelector('.add-server-btn').classList.remove("disabled");
        lastServerBox.parentNode.removeChild(lastServerBox);
        if(lastServerID > 0)    delete serverStatusList[lastServerID];
        
    }
    if(lastServerID == "2"){
        document.querySelector('.remove-server-btn').disabled = true;
        document.querySelector('.remove-server-btn').classList.add("disabled");
    }

}


/**
 * Deletes task if it is still pending i.e still in the pending queue.
 * @param {Number} task 
 */
function deleteTask(task) {
    let taskProgressBar = document.querySelector('.task #task-progress-bar-' + task);
    let taskListContainer = document.querySelector('.task-list-container');
    if (taskProgressBar.parentNode.parentNode.isSameNode(taskListContainer)) {
        pendingTasks--;
        let taskToRemove = document.querySelector('#task-' + task)
        taskProgressBar.parentNode.parentNode.removeChild(taskToRemove);
        document.querySelector('.task .task-counter').innerHTML = "(" + pendingTasks + " pending tasks)";
    }
}

/**
 * 
 * Task initialisation function
 * @param {Object} serverListContainer 
 * @param {Number} noOfTasks 
 * @param {Number} addedServerID 
 */
function createTask(serverListContainer, noOfTasks, addedServerID) {

    pendingTasks += parseInt(noOfTasks, 10);
    if (pendingTasks > 99) {

        //Cannot have more than 99 pending tasks (added constraint from developer's end to avoid excessive clutter and overload)
        //Update pending tasks to always be <= 99
        pendingTasks = pendingTasks - (pendingTasks - 99);
        alert("You cannot have more than 99 pending tasks.");
    }
    if (pendingTasks <= 99) {
        for (let i = 1; i <= noOfTasks; i++) {
            let availableServerNumber = checkServerAvailability();

            //if a server is available, allocate a task to it
            if (availableServerNumber >= 1) {
                pendingTasks--;
                let taskCounterDiv = document.querySelector('.task .task-counter');
                if (taskCounterDiv) {
                    taskCounterDiv.innerHTML = "(" + pendingTasks + " pending tasks)";
                }
                else {
                    let newTaskCounterDiv = document.createElement('h2');
                    newTaskCounterDiv.setAttribute("class", "task-counter");
                    newTaskCounterDiv.innerHTML = "(" + pendingTasks + " pending tasks)";
                    document.querySelector('.task .card-subtitle').appendChild(newTaskCounterDiv);
                }

                createTaskProgressBar(serverListContainer, availableServerNumber, addedServerID, i);



            }
            else {

                document.querySelector('.task .task-counter').innerHTML = "(" + pendingTasks + " pending tasks)";

                //No server available, add tasks to queue
                let taskContainer = document.createElement('div');
                taskContainer.setAttribute("class", "task-bar-container")
                taskContainer.setAttribute("id", "task-" + i);

                //Actual task progress bar
                let taskProgressBar = document.createElement('progress');
                taskProgressBar.setAttribute("class", "task-progress-bar");
                taskProgressBar.setAttribute("id", "task-progress-bar-" + i);
                taskProgressBar.setAttribute("max", TASK_DURATION);
                taskProgressBar.setAttribute("value", "0");

                //Delete button
                let deleteTaskBtn = document.createElement('button');
                deleteTaskBtn.setAttribute("class", "delete-task-btn");
                deleteTaskBtn.setAttribute("id", "delete-btn-" + i);
                deleteTaskBtn.setAttribute("onclick", "deleteTask(" + i + ");");

                //Delete icon
                let deleteIcon = document.createElement("img");
                deleteIcon.setAttribute("src", "./assets/icons/delete.svg");
                deleteIcon.setAttribute("class", "delete");

                deleteTaskBtn.appendChild(deleteIcon);

                let taskListContainer = document.querySelector('.task-list-container');
                taskContainer.appendChild(taskProgressBar);
                taskContainer.appendChild(deleteTaskBtn);
                taskListContainer.appendChild(taskContainer);

            }

        }
    }
}


/**
 * Task initialisation function linked to input field on frontend
 */
function addTask() {
    let addedServerID = Object.keys(serverStatusList).length;
    let noOfTasks = document.getElementById('task-input').value;
    let serverListContainer = document.querySelector('.server-list-container');
    createTask(serverListContainer, noOfTasks, addedServerID);

}

//1 server is always present
addServer(true);



