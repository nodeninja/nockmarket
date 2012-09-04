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
        defaults: {
            visible: true
        },

        setVisible: function(visible) {
            this.set({visible: visible});
        }
    });
    
    var PortfolioCollection = Backbone.Collection.extend({
        
        model: PortfolioModel,
        
        url: '/portfolio',
    });
    
    var PortfolioView = Backbone.View.extend({

        el: 'body', 
        
        events: {
            'click .add-filter': 'filter'
        },
        
        filter: function() {
            var filterString = $('#filter').val();
            var data = window.portfolioCollection.models;
            for (var i=0; i<data.length; i++) {
                if (data[i].toJSON().stock.toLowerCase().indexOf(filterString.toLowerCase()) == -1) {
                   // console.log(data[i].toJSON().stock);
                    data[i].setVisible(false);
                }
                else
                    data[i].setVisible(true);
            }            
           // alert(filterString);
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

            for (var i=0; i<window.portfolioCollection.models.length; i++) {
                var data = window.portfolioCollection.models[i];
               // console.log(11, data.toJSON());
                var rowView = new RowView({model: data});
              //  rowView.render();
               // console.log(rowView.render().el);
               $('.stock-list').append(rowView.render().el);  
                
            }
        }

    });
    
    var RowView = Backbone.View.extend({

        tagName: 'tr', 

        initialize: function() {
            _.bindAll(this, 'toggle');
            this.model.bind('change', this.toggle);
        },
        
        toggle: function() {
            if (!this.model.toJSON().visible)
                $(this.el).hide();
            else
                $(this.el).show();
        },
        
        render: function() {
            console.log('rdring');
            var template = _.template("<td><%=stock%></td><td><%=price%></td>");
            //$('.stock-list').append(template(this.model.toJSON()));  
            $(this.el).html(template(this.model.toJSON()));
            return this;
        }

    });    

    new PortfolioView();

});

