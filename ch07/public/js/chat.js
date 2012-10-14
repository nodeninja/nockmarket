var socket = io.connect(window.location.hostname);
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
    if (data.username) {
        $('#users').append('<span class="label label-success" id="username-' + data.username + '">'  + data.username + '</span>');
    }
    if (data.users) {
        var userHtml = '';
        for (var i=0; i<data.users.length; i++) {
            userHtml += '<span class="label label-success id="username-' + data.username + '">'  + data.users[i] + '</span>';
        }
        $('#users').html(userHtml);
    }
    
});
socket.on('disconnect', function (data) {
    $('#username-' + data.username).remove();
});    
