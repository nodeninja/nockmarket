'use strict';

var crypto = require('crypto')
  , db = require('./db')
  , exchange = require('./exchange')
  , http = require('http')
  , priceFloor = 35
  , priceRange = 10
  , volFloor = 80
  , volRange = 40;

module.exports = {
  
  // Add a stock to a user's portfolio
  addStock: function(uid, stock, callback) {
      
      function doCallback() {
          counter++;
          if (counter == 2) {
              callback(null, price);
          }
      }
      var counter = 0;
      var price;
      
      module.exports.getStockPrice(stock, function(err, retrieved) {
          price = retrieved;
          doCallback();
      });
      
      db.push('users', uid, {portfolio: stock}, doCallback);       
      
  },

  authenticate: function(username, password, callback) {
      
      db.findOne('users', {username: username}, function(err, user) {
        callback(err, user && (user.password === encryptPassword(password)));
      }); 
  },

  createUser: function(username, email, password, callback) {
      
    var user = {username: username
                , email: email
                , password: encryptPassword(password)};
    db.insertOne('users', user, callback);     
  },
  
  getStockPrice: function(stock, callback) {
    var options = {  
      host: 'download.finance.yahoo.com',  
      port: 80,
      path: '/d/quotes.csv?s=' + stock + '&f=sl1c1d1&e=.csv'
    };   
    
    http.get(options, function(res) { 
      var data = '';
      res.on('data', function(chunk) {
        data += chunk.toString();
      })
      .on('error', function(err) { 
        console.err('Error retrieving Yahoo stock prices');
        throw err; 
      })
      .on('end', function() {
        callback(null, data.split(",")[1]);
      });  
    });      
  },

  getUser: function(username, callback) {
    db.findOne('users', {username: username}, callback);
  },
  
  generateRandomOrder: function(exchangeData) {
    var order = {};
    if (Math.random() > 0.5)
      order.type = exchange.BUY
    else
      order.type = exchange.SELL
     
    var buyExists = exchangeData.buys 
                    && exchangeData.buys.prices.peek();
    var sellExists = exchangeData.sells 
                    && exchangeData.sells.prices.peek();
    
    var ran = Math.random();
    if (!buyExists && !sellExists)
      order.price = Math.floor(ran * priceRange) + priceFloor;
    else if (buyExists && sellExists) {
      if (Math.random() > 0.5)
        order.price = exchangeData.buys.prices.peek();
      else
        order.price = exchangeData.sells.prices.peek();
    } else if (buyExists) {
      order.price = exchangeData.buys.prices.peek();
    } else {
      order.price = exchangeData.sells.prices.peek();
    }
  
    var shift = Math.floor(Math.random() * priceRange / 2);
    if (Math.random() > 0.5)
      order.price += shift;
    else
      order.price -= shift;
    order.volume = Math.floor(Math.random() * volRange) + volFloor
    return order;
  }
     
}

function encryptPassword(plainText) {
    return crypto.createHash('md5').update(plainText).digest('hex');
}