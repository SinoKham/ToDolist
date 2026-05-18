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
function openTaskForm(){
    document.getElementById('overlay').style.display = 'block';
    const container=document.querySelector('#task-form-container')
    container.style.display='block';
    const form=container.querySelector('#task-form');
    form.reset();
    const errors=container.querySelectorAll('.error-message');
    errors.forEach(error=>error.textContent='');
}

function closeTaskForm(){
    document.getElementById('overlay').style.display = 'none';
    const container=document.querySelector('#task-form-container')
    container.style.display='none';
    const form=container.querySelector('#task-form');
    form.reset();
    const errors=container.querySelectorAll('.error-message');
    errors.forEach(error=>error.textContent='');
}
function initUI(){
    document.querySelector('.content').addEventListener('click', handleTaskClick);
    const addBtn=document.querySelector('.topbar_actions button');
    if (addBtn) addBtn.addEventListener('click', openTaskForm);
    const fab=document.querySelector('.fab');
    if (fab) fab.addEventListener('click', openTaskForm);
    const cancelBtn=document.querySelector('#task-form button[type="button"]');
    if (cancelBtn) cancelBtn.addEventListener('click', closeTaskForm);
    const form=document.querySelector('#task-form');
    if (form){
        form.addEventListener('submit', handleFormSubmit);
    }
}
function handleFormSubmit(event){
    event.preventDefault()
    const form=event.target;
    const formData=new FormData(form)
        const title=formData.get('title');
        const description = formData.get('description');
        const priority = formData.get('priority');
        const deadline = formData.get('deadline');
        const category = formData.get('category');
    const taskData={
        title: title,
        description: description,
        priority: priority,
        deadline: deadline,
        category: category
    };
    addTask(taskData);
    closeTaskForm();
    renderTasks();
}