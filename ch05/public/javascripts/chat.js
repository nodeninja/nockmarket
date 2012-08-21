var socket = io.connect('http://localhost');
var joinedChat = false;
$(document).ready(function() {
    $('#chat-tab').click(function() {
        if (!joinedChat) {
            joinedChat = true;
            socket.emit('joined', {});
        }
    });
    $('#send-chat').click(function() {
        socket.emit('clientchat', {message: $('#input01').val()});
    });   
}); 
socket.on('chat', function (data) {
    $('#textarea').prepend(data.message);
});