$(document).ready(function() {

    socket.emit('requestData', {});

    var StockModel = Backbone.Model.extend({
    });

    var StockCollection = Backbone.Collection.extend({
        model: StockModel,
    });
    var StockView = Backbone.View.extend({
        initialize: function() {
            var self = this;
            self.render();
        },


        render: function() {
            // console.log('render', window.stockCollection.models);
            // $('.stock-data').html('<tr><td>1</td></tr>');
            for (var i=0; i<window.stockCollection.models.length; i++) {
                            console.log('here');
                var data = window.stockCollection.models[i];
                var rowView = new StockRowView({model: data});
                $('.stock-data').append(rowView.render().el);
            }
        }
    });

    var StockRowView = Backbone.View.extend({

        tagName: 'tr',

        render: function() {
            var template = $('#trade-template').html();
            var htmlString = Mustache.to_html(template, this.model.toJSON());
            $(this.el).html(htmlString);
            return this;
        }

    });

    socket.on('initExchangeData', function (data) {
        window.stockCollection = new StockCollection();
        for (var stock in data.exchangeData) {
            data.exchangeData[stock].stock = stock;
            var stockModel = new StockModel(data.exchangeData[stock]);
            window.stockCollection.push(stockModel);
        }

        new StockView();
    });

});

