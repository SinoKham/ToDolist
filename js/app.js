document.addEventListener('DOMContentLoaded', ()=>{
    fetchUserProfile();
    renderTasks();
    document.querySelector('.content').addEventListener('click', handleTaskClick);
})