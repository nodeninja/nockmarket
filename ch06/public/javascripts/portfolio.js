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

    var PortfolioModel = Backbone.Model.extend({
    });
    
    var PortfolioCollection = Backbone.Collection.extend({
        
        model: PortfolioModel,
        
        url: '/portfolio',
    });
    
    var PortfolioView = Backbone.View.extend({

        el: 'body', 
        
        events: {
            'click .add-filter': 'done'
        },
        
        done: function() {
            alert('clicked');
        },

        initialize: function() {
            window.portfolioCollection = new PortfolioCollection();
            var self = this;
            window.portfolioCollection.fetch({
                success: function() {
                    self.render();
                },

                error: function() {
                    console.log('Error fetching data for portfolio');
                }
            });
        },
        
        render: function() {
            var template = _.template("<tr><td><%=stock%></td><td><%=price%></td></tr>");
            var stocks = window.portfolioCollection.models[0].attributes.portfolio;
            var prices = window.portfolioCollection.models[0].attributes.prices;
            for (var i=0; i<stocks.length; i++) {
                var data = {stock: stocks[i], price: prices[i]};
                $('.stock-list').append(template(data));
            }
        }

    });
    
    var RowView = Backbone.View.extend({

        tagName: 'tr', 

        initialize: function() {

        },
        
        render: function() {
            
        }

    });    

    new PortfolioView();

});

