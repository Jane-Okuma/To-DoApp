
//Open Add Task by RHS
function openAddTask(){
    document.getElementById("modal-content").style.display ="block";
    document.getElementById("modal-content").style.width = "30%";
    document.getElementById("display").style.marginRight = "30%";
}

//Close Add Task
function closeAddTask(){
    document.getElementById("modal-content").style.display = "none";
    document.getElementById("modal-content").style.width = "0";
    document.getElementById("display").style.marginRight = "0";
    document.getElementById("displayDetails").style.display = "none";
    document.getElementById("displayDetails").style.width = "0%";
    document.getElementById("display").style.marginRight = "0";
}

//Open View Task Details: viewDetails function takes the task's ID as a parameter.
function viewDetails(taskID){
    document.getElementById("displayDetails").style.display = "block";
    document.getElementById("displayDetails").style.width = "30%";
    document.getElementById("display").style.marginRight = "30%";

    //Get the task information from local storage using its ID and displays it in a form.
    var tasks = JSON.parse(localStorage.getItem(key)) || [];
    const taskbyID = tasks.find(t => t.Id == taskID);
    document.getElementById("title2").value = taskbyID.Title;
    document.getElementById("description2").value = taskbyID.Description;
    document.getElementById("startDate2").value = taskbyID.Startdate;
    document.getElementById("endDate2").value = taskbyID.Enddate;
    var statusRadio = document.querySelectorAll('input[name="status2"]');
    for(radio of statusRadio){
        if(radio.value == taskbyID.Status){
            radio.checked = true;
        }
    }
    var priorityRadio = document.querySelectorAll('input[name="prioritySpec2"]');
    for(radio of priorityRadio){
        if(radio.value == taskbyID.Priority){
            radio.checked = true;
        }
    }

    // Handles OnClick event for the buttons in the form
    document.getElementById("delete").addEventListener('click', async function(event){
        event.preventDefault();
        const confirmDeletion = await toDeleteTask();
        if(confirmDeletion){
            deleteTask(taskID);
            loadTasks();
            closeViewDetails();
        }
    })

    document.getElementById("saveChanges").addEventListener('click', async function(event){
        event.preventDefault();
        const confirmUpdate = await toUpdateTask();
        if(confirmUpdate){
            updateTask(taskID);
            loadTasks();
            closeViewDetails();
        }
    })
}

//This function closes the ViewDetails side-form after an action ahs been completed or the close button is clicked
function closeViewDetails(){
    document.getElementById("displayDetails").style.display = "none";
    document.getElementById("displayDetails").style.width = "0";
    document.getElementById("display").style.marginRight = "0";
}



//Create Task class
class TaskItem{
    constructor(Id, Title, Description, Startdate, Enddate, Priority, Status){ 
        this.Id = Id;
        this.Title = Title;
        this.Description = Description;
        this.Startdate = Startdate;
        this.Enddate = Enddate;
        this.Priority = Priority;
        this.Status = Status;
    }
}

//Manage Ids via local storage
var key2 = "id";
function manageIDs(){
    var ids = JSON.parse(localStorage.getItem(key2))||[];
    var nextID = ids.length + 1
    ids.push(nextID);
    localStorage.setItem(key2, JSON.stringify(ids));
    return nextID;
}
//Store Created Tasks in Local Storage
var key = "Tasks"
function AddTask(item){
    var task = JSON.parse(localStorage.getItem(key)) || [];
    
    if(item.Title == ""){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Fill in title field",
            text: "Enter a task title to proceed!",
            showConfirmButton: false,
            timer: 1200
        });
    }
    else if(item.Enddate < item.Startdate){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Date Error",
            text: "End date cannot be later than start date",
            showConfirmButton: false,
            timer: 1200
        });
    }
    else{
        task.push(item);
      
        localStorage.setItem(key, JSON.stringify(task));
        closeAddTask();
    }
    
}

//updateTask takes the id of the task as a parameter, uses the id to fetch task info from local storage and manages changes made to info via form
function updateTask(id){
    var tasks = JSON.parse(localStorage.getItem(key)) || [];
    var index = tasks.indexOf(id);
    var title = document.getElementById("title2");
    var decription = document.getElementById("description2");
    var startDate = document.getElementById("startDate2");
    var endDate = document.getElementById("endDate2");

    var taskbyID = tasks.find(t => t.Id == id);
    taskbyID.Title = title.value;
    taskbyID.Description = decription.value;
    taskbyID.Startdate = startDate.value;
    taskbyID.Enddate = endDate.value;
    taskbyID.Status = statusHandler2();
    taskbyID.Priority = priorityHandler2();

    tasks[index] = taskbyID;
    localStorage.setItem(key, JSON.stringify(tasks));

}

//deleteTask function deletes a task via its ID
function deleteTask(id){
    var tasks = JSON.parse(localStorage.getItem(key)) || [];
    var updatedTask = tasks.filter(t => t.Id != id);
    localStorage.setItem(key, JSON.stringify(updatedTask));
}

//this function (statusHandler) queries all radio buttons with the name 'status' and returns the value of the one that is checked.
function statusHandler(){
    var status;
    var statusRadio = document.querySelectorAll('input[name="status"]');

    for(const radio of statusRadio){
        if(radio.checked){
            status = radio.value;
        }
    }
    return status;
}

//this function (statusHandler2) queries all radio buttons with the name 'status2' and returns the value of the one that is checked.
// - for diplayDetails form
function statusHandler2(){
    var status;
    var statusRadio = document.querySelectorAll('input[name="status2"]');

    for(const radio of statusRadio){
        if(radio.checked){
            status = radio.value;
        }
    }
    return status;
}

//this function (priorityHandler) queries all radio buttons with the name 'prioritySpec' and returns the value of the one that is checked.
function priorityHandler(){
    var priority;
    var priorityRadio = document.querySelectorAll('input[name="prioritySpec"]');
    for(const radio of priorityRadio){
        if(radio.checked){
            priority = radio.value;
        }
    }
    return priority;
}

//this function (priorityHandler2) queries all radio buttons with the name 'prioritySpec2' and returns the value of the one that is checked.
// - for displayDetails form
function priorityHandler2(){
    var priority;
    var priorityRadio = document.querySelectorAll('input[name="prioritySpec2"]');
    for(const radio of priorityRadio){
        if(radio.checked){
            priority = radio.value;
        }
    }
    return priority;
}


//Retrieve task items from local storage and handles dynamic display
const displayTable = document.getElementById("taskTable");
const keepRow = document.getElementById("add").outerHTML;
//loadTasks function displaysin a table the tasks stored in local storage
function loadTasks(){
    const tasks =  JSON.parse(localStorage.getItem(key)) || [];
    console.log(tasks);
    displayTable.innerHTML = keepRow;
    for(let i = 0; i < tasks.length; i++) {
        //Handles creation of checkbox in new row
        console.log(tasks.length);
        const newRow = document.createElement("tr");
        const data1 = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.id = "taskList_"+tasks[i].Id;
        checkbox.type ="checkbox";
        checkbox.name = "taskCheckbox";
        checkbox.value = tasks[i].Id;
       
        data1.appendChild(checkbox);

        //Handles creation of label containing task title in the same row
        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.id = "taskListLabel_"+tasks[i].Id;
        label.textContent = tasks[i].Title;
        label.className = "taskListLabel";

        data1.appendChild(label);

        //Creates a break element
        if(tasks[i].Enddate != ""){
            const Break = document.createElement("br");
        data1.appendChild(Break);
        
        //Creates a calendar icon on a new line in the same row, same column as checkbox and task name 
        const calendarIcon = document.createElement("i");
        calendarIcon.className = "fa-solid fa-calendar-week";
        calendarIcon.id = "calendar";
        calendarIcon.style.cursor = "pointer";
        data1.appendChild(calendarIcon);
        
        //Creates a span element containing task's due date. Same row, same column as calendar icon
        const subData1 = document.createElement("span");
        subData1.textContent = (tasks[i].Enddate).slice(0, -6);
        subData1.id = "dueDate";
        data1.appendChild(subData1);
        }

        //Handles the creation of elements that contain priority name and colored square. Name and color depend on priority level 
        // - (High priority - Red, Medium Priority - Orange, Low priority - Yellow, Optional - Green)
        const Priority = tasks[i].Priority;

        if(Priority == "high"){
            const squareIcon = document.createElement("i");
            squareIcon.className = "fa-solid fa-square";
            squareIcon.id = "prioritySquare";
            squareIcon.style.color = "#ff0000";
            data1.appendChild(squareIcon);

            const priorityName = document.createElement("span");
            priorityName.textContent = "High";
            priorityName.id = "priorityName";
            data1.appendChild(priorityName);
        }
        else if(Priority == "medium"){
            const squareIcon = document.createElement("i");
            squareIcon.className = "fa-solid fa-square";
            squareIcon.id = "prioritySquare";
            squareIcon.style.color = "#ffa500";
            data1.appendChild(squareIcon);

            const priorityName = document.createElement("span");
            priorityName.textContent = "Medium";
            priorityName.id = "priorityName";
            data1.appendChild(priorityName);
        }
        else if(Priority == "low"){
            const squareIcon = document.createElement("i");
            squareIcon.className = "fa-solid fa-square";
            squareIcon.id = "prioritySquare";
            squareIcon.style.color = "#ffff00";
            data1.appendChild(squareIcon);

            const priorityName = document.createElement("span");
            priorityName.textContent = "Low";
            priorityName.id = "priorityName";
            data1.appendChild(priorityName);
        }
        else if(Priority == "optional"){
            const squareIcon = document.createElement("i");
            squareIcon.className = "fa-solid fa-square";
            squareIcon.id = "prioritySquare";
            squareIcon.style.color = "#008000";
            data1.appendChild(squareIcon);

            const priorityName = document.createElement("span");
            priorityName.textContent = "Optional";
            priorityName.id = "priorityName";
            data1.appendChild(priorityName);
        }

        newRow.appendChild(data1);
        
        //Creates an element containing a caret right icon
        const data3 = document.createElement("td");
        const iconHolder = document.createElement("i");
        iconHolder.className = "fa-solid fa-caret-right fa-lg";
        iconHolder.id = "caret-right";
        iconHolder.style.cursor = "pointer";
        iconHolder.dataset.taskID = tasks[i].Id;
        //Calls viewDetails function when caret right icon is clicked
        iconHolder.onclick = function(){
            const taskID = this.dataset.taskID;
            viewDetails(taskID);
        };
        data3.appendChild(iconHolder);
        newRow.appendChild(data3);
        displayTable.appendChild(newRow);

        //Handles display of table content when checkbox is checked and status is marked as completed
        const check = document.getElementById("taskList_"+tasks[i].Id);
        const lab = document.getElementById("taskListLabel_"+tasks[i].Id);
        if(tasks[i].Status != "" && tasks[i].Status == "Completed"){
            lab.style.textDecoration = "line-through";
            check.checked = true;
            check.disabled = true;
            document.getElementById("taskListLabel_"+tasks[i].Id).style.color = "#757575";
        }
        check.addEventListener('change', function () {
            if (this.checked) {
                tasks[i].Status = "Completed";
                lab.style.textDecoration = "line-through";
                check.disabled = true;
                document.getElementById("taskListLabel_"+tasks[i].Id).style.color = "#757575";
            } else {
                tasks[i].Status = "";
                lab.style.textDecoration = "none";
            }
            localStorage.setItem(key, JSON.stringify(tasks));
        });

    };

}

//Confirm task creation
async function toCreateTask(){
    const result = await Swal.fire({
        title: "Are you sure you want to create this task?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: `No, Cancel`
    });
    return result.isConfirmed;
}

//Confirm task Deletion
async function  toDeleteTask() {
    const result = await Swal.fire({
        title: "Are you sure you want to delete this task?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: `No, Cancel`
    });
    return result.isConfirmed;
}

//Confirm Task Update
async function  toUpdateTask() {
    const result = await Swal.fire({
        title: "Are you sure you want to save changes made to this task?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: `No, Cancel`
    });
    return result.isConfirmed;
}

//On submission of form
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('submit').addEventListener('click', async function(event){
        event.preventDefault();
        
        const Id = manageIDs();
        const title = document.getElementById("title").value;
        const decription = document.getElementById("description").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const priority = priorityHandler();
        const status = statusHandler();
        const newTask = new TaskItem(Id, title, decription, startDate, endDate, priority, status);
        const confirmCreate = await toCreateTask();
        if(confirmCreate){
            AddTask(newTask);
            loadTasks();
        }
        

        
    })
})
loadTasks();