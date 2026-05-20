function getFiltered(){
    let tasks=getTasks();
    const searchTerm=document.querySelector('.top_search input[type="search"]').value.trim().toLowerCase();
    if (searchTerm){
        tasks=tasks.filter(task=> {
            return task.title.toLowerCase().includes(searchTerm) || 
                (task.description && task.description.toLowerCase().includes(searchTerm)) ||
                (task.category && task.category.toLowerCase().includes(searchTerm))});
    }
    const activeBtn=document.querySelector('.topbar_filters button.active')
    if (activeBtn){
        const statusText=activeBtn.textContent.trim();
        if(statusText==='Активные'){
            tasks=tasks.filter(task=> !task.completed);
        } else if (statusText==='Завершённые'){
            tasks=tasks.filter(task=>task.completed);
        } 
    }
    const prioritySels=document.querySelector('.topbar_filters select:not(.sort-select)');
    const priorityValue=prioritySels.value
    if(priorityValue && priorityValue!=='Все приоритеты'){
        tasks=tasks.filter(task=>task.priority===priorityValue)
    }
    const sortSelect=document.querySelector('.topbar_filters select.sort-select');
    if (sortSelect){
        tasks=sortTasks(tasks, sortSelect.value);
    }
    return tasks;
}
function sortTasks(tasks, sortValue){
    const priorityMap ={ 'Высокий': 3, 'Средний': 2, 'Низкий': 1 };
    switch (sortValue){
        case 'По дедлайну (сначала ближайшие)':
            return tasks.sort((a,b)=>{
                const dataA=a.deadline ? new Date(a.deadline): new Date('9999-12-31');
                const dateB=b.deadline ?new Date(b.deadline): new Date('9999-12-31');
                return dataA-dateB;
            });
        case 'По дедлайну (сначала дальние)':
            return tasks.sort((a,b)=>{
                const dateA=a.deadline ? new Date(a.deadline): new Date('9999-12-31');
                const dateB = b.deadline ? new Date(b.deadline) : new Date('9999-12-31');
                return dateB-dateA;
            });
        case 'По приоритету (высокий → низкий)':
            return tasks.sort((a,b)=>priorityMap[b.priority]-priorityMap[a.priority]);
        case 'По приоритету (низкий → высокий)':
            return tasks.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
        case 'По дате добавления (новые → старые)':
            return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'По дате добавления (старые → новые)':
            return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        default:
            return tasks;
    }
}
function getDeadlineClass(task){
    if (task.completed || !task.deadline) return '';
    const now=new Date();
    const deadlineDate=new Date(task.deadline);
    const different= deadlineDate-now;
    const diffHours=(deadlineDate-now)/(1000*60*60);
    if (diffHours<0){
        return 'deadline-red';
    } else if (diffHours<=24){
        return 'deadline-yellow';
    } else return 'deadline-green';
}
function renderTasks(){
    const render=document.querySelector('.content');
    const tasks=getFiltered();
    render.innerHTML='';
    if (tasks.length===0) {
        render.innerHTML= '<p class="empty-state">Нет задач</p>';
        return;
    } else{
        const html= tasks.map(task=>`
            <article class="task-card ${getDeadlineClass(task)}" data-id="${task.id}">
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
    initFormValidation();
    const statusBut=document.querySelectorAll('.topbar_filters button');
    statusBut.forEach(button => {
        button.addEventListener('click', function(event){
            statusBut.forEach(btn=>btn.classList.remove('active'));
            event.target.classList.add('active');
            renderTasks();
        });
    });
    const selPrior=document.querySelector('.topbar_filters select:not(.sort-select)')
    if(selPrior) selPrior.addEventListener('change', renderTasks);
    const selCat=document.querySelector('.topbar_filters select.sort-select');
    if(selCat)selCat.addEventListener('change', renderTasks);
    const selSearch=document.querySelector('.top_search input[type="search"]');
    if (selSearch) selSearch.addEventListener('input', renderTasks);
    renderTasks();
}
function handleFormSubmit(event){
    event.preventDefault()
    if (!validateForm()) return;
    const form=event.target;
    const formData=new FormData(form)
        const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        deadline: formData.get('deadline'),
        category: formData.get('category')
    };
    addTask(taskData);
    closeTaskForm();
    renderTasks();
    
}