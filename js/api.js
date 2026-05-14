async function fetchUserProfile()
{
    const container=document.getElementById('user-profile');
    container.innerHTML='<div class="loader"></div>';
    try{
    const response=await fetch('https://randomuser.me/api/');
    if (!response.ok){
        throw new Error('Ошибка сети./n404');
    }
    const data=await response.json();
    const user=data.results[0];
    const fullName=user.name.first+' '+user.name.last;
    const avatarUrl=user.picture.medium;
    container.innerHTML=`<img src="${avatarUrl}" alt="${fullName}"><span class="user-name">${fullName}</span>`;
    } catch(error){
        container.innerHTML='<span class="error">Не удалось загрузить профиль</span>'
    }
}