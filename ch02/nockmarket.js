'use strict';

var exchangeData = {}
  , exchange = require('./lib/exchange')
  , nocklib = require('./lib/nocklib')
  , stocks = ['NOCK1'] 
  , timeFloor = 500
  , timeRange = 1000;

function submitRandomOrder() {

  var order = nocklib.generateRandomOrder(exchangeData); 
  console.log('order', order);
  if (order.type == exchange.BUY)
    exchangeData = exchange.buy(order.price, order.volume, exchangeData);
  else  
    exchangeData = exchange.sell(order.price, order.volume, exchangeData);  
    
  var pause = Math.floor(Math.random() * timeRange) + timeFloor;
  setTimeout(submitRandomOrder, pause);
  console.log(exchange.getDisplay(exchangeData)); 
}
 
submitRandomOrder();