$(document).ready(function() {
    $('.uname').blur(function(e) {
        $.ajax({
            type: 'GET'
            , url: '/api/user/' + $('.uname').val()
        }).done(function(found) {
            if (found == '1') {
                $('#imagePlaceHolder').html('<img src="http://nodeninja.github.com/book/chapter02/cross.png">');
                $('.create-button').addClass('disabled').attr('disabled', true);
            }
            else {
                $('#imagePlaceHolder').html('<img src="http://nodeninja.github.com/book/chapter02/tick.png">');
                $('.create-button').removeClass('disabled').attr('disabled', false);                
            }
        });
    });
});
