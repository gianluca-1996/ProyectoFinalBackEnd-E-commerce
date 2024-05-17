const socket = io();
const btnEnviar = document.getElementById('btnEnviar');
const p = document.createElement('p');
const messageList = document.getElementById('messageList');
const message = document.getElementById('message');
const chatBox = document.getElementById('chatBox');
const btnUserConfirm = document.getElementById('btnUserConfirm');
const btnExit = document.getElementById('btnExit');
const userNameBox = document.getElementById('userNameBox');
const user = document.getElementById('user');
const userName = document.getElementById('userName');
const messagesFromDb = [];


btnUserConfirm.addEventListener('click', () => {
    if(user.value.trim() === '') 
        user.focus()
    else{
        messagesFromDb.forEach(element => {
            const mesgeFromDb = document.createElement('p');
            mesgeFromDb.innerHTML = `<strong>${element.user}</strong>: ${element.message}`;
            messageList.appendChild(mesgeFromDb);
        })
        userName.value = user.value;
        userName.innerHTML = `Bienvenido, ${userName.value}!`;
        chatBox.style.display = 'block';
        userNameBox.style.display = 'none';
    }
})

btnExit.addEventListener('click', () => { location.reload() });

btnEnviar.addEventListener('click', () => {
    if(message.value.trim() === ''){
        message.focus();
    }
    else{
        p.innerHTML = `<strong>${userName.value}</strong>: ${message.value}</br>`;
        messageList.appendChild(p);
        socket.emit('message', {message: message.value, userName: userName.value});
        message.value = '';
    }
})

socket.on('messagesDB', (data) => {
    data.forEach(element => {
        messagesFromDb.push(element);
    });
})