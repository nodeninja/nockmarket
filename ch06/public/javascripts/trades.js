socket.on('trade', function (data) {
    //console.log(data);
}); 
(function ($) {
/**
    // Our main app view for runners and prices and alerts
    // Takes a collection as a parameter
    var TraderView = Backbone.View.extend({

        initialize: function() {
            this.render();
        },

        rowTemplate: _.template($('#alert-header-template').html()),

        render: function() {

            var out = '';
            var self = this;

           // log($('#traderApp').html.length);
            $('#container').html('');
            $('#traderApp').html(this.alertHeaderTemplate() + this.runnerHeaderTemplate());
           // $('#alerts tbody').append('<tr><td>27/04/2011</td><td>10:34:21</td><td> Price Move</td><td>Black Caviar has moved 5% in the last 2 minutes</td><tr>');

            // Make table sortable
            $("#uisort tbody").sortable().disableSelection();
            $('#uisort').hide();

            $('#uisort').fadeOut(400, function() {
               // log('faded out');

                $('#uisort tbody').html('');
                var sorted = self.model.sortBy(function(horse) {return parseInt(horse.toJSON().barrier)});

                _.each(sorted, (function (item) {
                    //log('bitem');
                    //log(item);
                    var rowView = new RunnerView({model: item});
                    $('#uisort tbody').append(rowView.render().el);
                }));

                $('#uisort').removeClass('hidden');
                $('#uisort').fadeIn(400);
                // debugging
                //log(document.body.parentNode.outerHTML);
            });


        }

    });
*/
})(jQuery);