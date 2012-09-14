$(document).ready(function() {

    var ids = {};
    $.get('/templates/trade-table.ejs', function(storedTemplate) {
        
        var loaded = false;
        socket.emit('requestData', {});
    
        var StockModel = Backbone.Model.extend({            
            updatePrices: function(deltas) {
                this.set({deltas: deltas});
            }              
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
                for (var i=0; i<window.stockCollection.models.length; i++) {
                    var data = window.stockCollection.models[i];
                    var rowView = new StockRowView({model: data});
                    $('.stock-data').append(rowView.render().el);
                }
            }
        });
    
        var StockRowView = Backbone.View.extend({
    
            tagName: 'tr',
            
            initialize: function() {
                _.bindAll(this, 'setPrices');
                this.model.bind('change', this.setPrices);
            },            
    
            render: function() {
                var template = _.template(storedTemplate);      
                var htmlString = template(this.model.toJSON());
                $(this.el).html(htmlString);
                return this;
            },

            setPrices: function() {
                var prices = this.model.toJSON().deltas;
                for (var attr in prices) {
                    var value = prices[attr];
                    if (value > 0) {                        
                        $('#' + prices.st + attr).html(value);
                    }
                }
            }
    
        });
    
        socket.on('initExchangeData', function (data) {
            window.stockCollection = new StockCollection();
            for (var stock in data.exchangeData) {
                var stockModel = new StockModel(data.exchangeData[stock]);
                ids[stock] = stockModel.id;
                stockModel.set({id: data.exchangeData[stock].st});
                window.stockCollection.push(stockModel);
            }
            loaded = true;
            new StockView();
        });
        socket.on('exchangeData', function (deltas) {
            if (loaded) {
                var model = window.stockCollection.get(deltas.st);
                model.updatePrices(deltas);
            }            
        });
    });


});