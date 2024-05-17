const socket = io();
const btnEnviar = document.getElementById('btnEnviar');
const p = document.createElement('p');
const messageList = document.getElementById('messageList');
const message = document.getElementById('message');
const chatBox = document.getElementById('chatBox');
const btnUserConfirm = document.getElementById('btnUserConfirm');
const userNameBox = document.getElementById('userNameBox');
const user = document.getElementById('user');
const userName = document.getElementById('userName');

btnUserConfirm.addEventListener('click', () => {
    if(user.value.trim() === '') 
        user.focus()
    else{
        userName.value = user.value;
        userName.innerHTML = `Bienvenido, ${userName.value}!`;
        chatBox.style.display = 'block';
        userNameBox.style.display = 'none';
    }
})

btnEnviar.addEventListener('click', () => {
    if(message.value.trim() === ''){
        message.focus();
    }
    else{

        p.innerHTML += `${userName.value} dice: ${message.value}</br>`;
        messageList.appendChild(p);
        socket.emit('message', {message: message.value, userName: userName.value});
        message.value = '';
    }
})

socket.on('messagesDB', (data) => {
    console.log("desde socket" + data);
})