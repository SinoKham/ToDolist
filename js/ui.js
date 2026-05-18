function renderTasks(){
    const render=document.querySelector('.content');
    const tasks=getTasks();
    render.innerHTML='';
    if (tasks.length===0) {
        render.innerHTML= '<p class="empty-state">Нет задач</p>';
        return;
    } else{
        const html= tasks.map(task=>`
            <article class="task-card" data-id="${task.id}">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <h3>${task.title}</h3>
                    ${task.description ? `<p>${task.description}</p>` : ''}
                    <span class="tag">${task.category || 'Без категории'}</span>
                    <time>${task.deadline || ''}</time>
                </div>
                <span class="priority ${task.priority}"></span>
                <img src="" alt="avatar">
                <button class="delete-btn">Удалить</button>
            </article>
            `).join('')
        render.innerHTML=html;
    }
}
function handleTaskClick(event){
    const taskCard=event.target.closest('.task-card');
    if (!taskCard) return;
    const taskId=taskCard.dataset.id;
    if (event.target.closest('.delete-btn')){
        deleteTask(taskId);
        renderTasks();
        return;
    }    
    if (event.target.type==='checkbox'){
        updateTask(taskId, { completed: event.target.checked});
        renderTasks();
    }
}