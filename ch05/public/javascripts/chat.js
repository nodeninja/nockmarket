var socket = io.connect('http://localhost');
var joinedChat = false;
$(document).ready(function() {
    $('#chat-tab').click(function() {
        if (!joinedChat) {
            joinedChat = true;
            socket.emit('joined', {});
        }
    });
}); 


/**
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});*/