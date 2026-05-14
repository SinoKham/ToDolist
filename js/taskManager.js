const STORAGE_KEY='sinodo-tasks';
function getTasks(){
    const tasks=localStorage.getItem(STORAGE_KEY)
    if (tasks){
        return JSON.parse(tasks)
    }
    else{
        return []
    }
}
function saveTasks(tasks){
    const taskdata=JSON.stringify(tasks)
    localStorage.setItem(STORAGE_KEY, taskdata)
}
function addTask(taskdata){
    const tasks=getTasks()
    const id=Date.now().toString()+Math.random().toString(36)
    const newTask={
        id: id,
        title: taskdata.title,
        description: taskdata.description || '',
        priority: taskdata.priority,
        deadline: taskdata.deadline,
        category: taskdata.category || 'Без категории',
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask)
    saveTasks(tasks)
}
function updateTask(id, changes){
    const tasks=getTasks()
    const task=tasks.find(task=>task.id===id)
    if (task){
        Object.assign(task, changes)
    }
    saveTasks(tasks)
}
function deleteTask(id){
    const tasks=getTasks()
    const delTask=tasks.filter(task=>task.id!==id)
    saveTasks(delTask)
}