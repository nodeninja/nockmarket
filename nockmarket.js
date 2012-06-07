'use strict';

var nocklib = require('./lib/nocklib')
  , stocks = ['NOCK1'];

var exchangeData = {}
  , exchange = require('./lib/exchange')
  , timeFloor = 500
  , timeRange = 1000

function submitRandomOrder() {

  var order = nocklib.generateRandomOrder(exchangeData);
  console.log(order);
  console.log(exchange.getDisplay(exchangeData));  
  if (order.type == exchange.BUY)
    exchangeData = exchange.buy(order.price, order.volume, exchangeData);
  else  
    exchangeData = exchange.sell(order.price, order.volume, exchangeData);  

  if (exchangeData.trades && exchangeData.trades[0] && (!exchangeData.trades[0].price || isNaN(exchangeData.trades[0].price)))
    process.exit(0)
  
  var pause = Math.floor(Math.random() * timeRange) + timeFloor;
  setTimeout(submitRandomOrder, pause);
  
}

 
submitRandomOrder();