function validateField(name, value){
    if (name==='title'){
        if (value.trim()===''){
            return 'Название обязательно';
        }
    }
    if (name==='priority'){
        if(value.trim().length===0){
            return 'Выберите приоритет';
        }
    }
    if (name==='deadline'){
        if (value.trim()!==''&&isNaN(new Date(value).getTime())) {
            return 'Некорректная дата';
        }
        if (value.length!==0 && new Date(value)<= new Date()){
            return 'Дедлайн должен быть в будущем';
        }
    }
    return '';
}
function validateForm(){
    const form=document.querySelector("#task-form")
    const formData=new FormData(form);
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    let isValid=true;
    for (let [name, value] of formData.entries()){
        const errorMsg=validateField(name, value)
        if (errorMsg){
            isValid=false;
            const errorSpan = form.querySelector('.error-message[data-error="' + name + '"]');
            if (errorSpan) errorSpan.textContent = errorMsg;
            const field = form.querySelector('[name="' + name + '"]');
            if (field) field.classList.add('error');
        }
    }
    return isValid;
}
function initFormValidation() {
    const form = document.getElementById('task-form');
    if (!form) return;
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', function(event) {
            const name = event.target.name;   
            const value = event.target.value;
            const errorMsg = validateField(name, value);
            const errorSpan = form.querySelector(`.error-message[data-error="${name}"]`);
            const fieldElement = form.querySelector(`[name="${name}"]`);
            if (errorMsg) {
                if (errorSpan) errorSpan.textContent = errorMsg;
                if (fieldElement) fieldElement.classList.add('error');
            } else {
                if (errorSpan) errorSpan.textContent = '';
                if (fieldElement) fieldElement.classList.remove('error');
            }
        });
    });
}