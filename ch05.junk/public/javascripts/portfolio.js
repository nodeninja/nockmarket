$(document).ready(function() {
    $('#add-stock').click(function(e) {
        $.ajax({
            type: 'POST'
            , url: '/add-stock/'
            , data: {stock: $('#stock').val()}
        }).done(function(price) {
            $('.stock-list').append('<tr><td>' + $('#stock').val() + '</td><td>' + price + '</td></tr>');
        });
    });
    $('#show-chat').click(function(e) {
       //$('#myTab a[href="#tab3"]').tab('show'); 
       $('#myTab li:eq(2) a').tab('show');
      // $('#tab3').tab('show');
    });
    $('#chat-tab').click(function(e) {
       $('#chatModal').modal({backdrop: true});
    });    
    
});
