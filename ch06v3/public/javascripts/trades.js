$(document).ready(function() {

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
        
        
        socket.on('initExchangeData', function (data) {
            window.stockCollection = new StockCollection();
            for (var stock in data.exchangeData) {
                var stockModel = new StockModel(data.exchangeData[stock]);
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
        
        var StockView = Backbone.View.extend({
            
            tagName: 'tr',
            
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
    
        var StockRowView = Backbone.View.extend({
    
            tagName: 'tr',       
    
            render: function() {
                var template = _.template(storedTemplate);      
                var htmlString = template(this.model.toJSON());
                $(this.el).html(htmlString);
                return this;
            },
            
            initialize: function() {
                _.bindAll(this, 'setPrices');
                this.model.bind('change', this.setPrices);
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

        
    });

});