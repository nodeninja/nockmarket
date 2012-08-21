'use strict';

var connect = require('connect')
  , cookie = require('cookie')
  , crypto = require('crypto')
  , db = require('./db')
  , exchange = require('./exchange')
  , express = require('express')  
  , http = require('http')  
  , MemoryStore = express.session.MemoryStore  
  , ObjectID = require('mongodb').ObjectID  
  , parseCookie = require('connect').utils.parseCookie
  , priceFloor = 35
  , priceRange = 10
  , volFloor = 80
  , volRange = 40;

var sessionStore = new MemoryStore();

module.exports = {

  addStock: function(uid, stock, callback) {  
      
    function doCallback() {
          counter++;
          if (counter == 2) {
              callback(null, price);
          }
      }            
      var counter = 0;

      var price;
      
      module.exports.getStockPrices([stock], function(err, retrieved) {   
          price = retrieved[0];
          doCallback();
      });      
      db.push('users', uid, {portfolio: stock}, doCallback);       
      
  },

  authenticate: function(username, password, callback) {
      
      db.findOne('users', {username: username}, function(err, user) {
        if (user && (user.password === encryptPassword(password)))
            callback(err, user._id);
        else
            callback(err, null);
      }); 
  }, 
    
  createSocket: function(app) {
    var io = require('socket.io').listen(app);  
    io.configure(function (){
      io.set('authorization', function (handshakeData, callback) {
        if (handshakeData.headers.cookie) {
            handshakeData.cookie = cookie.parse(decodeURIComponent(handshakeData.headers.cookie));
            handshakeData.sessionID = handshakeData.cookie['express.sid'];
            sessionStore.get(handshakeData.sessionID, function (err, session) {
                if (err || !session) {
                    return callback(null, false);
                } else {
                    handshakeData.session = session;
                    console.log('session data', session);
                }
            });    
        }
        else {
          return callback(null, false);    
        }
        callback(null, true); // error first callback style 
      });
    });    
    io.sockets.on('connection', function (socket) {
      socket.emit('news', { hello: 'world' });
      socket.on('joined', function (data) {
        console.log('joined to');
      });
    });   
  },
    
  createUser: function(username, email, password, callback) {
      
    var user = {username: username
                , email: email
                , password: encryptPassword(password)};
    db.insertOne('users', user, callback);     
  },
  
  ensureAuthenticated: function (req, res, next) {
    if (req.session._id) {
      return next();
    }
    res.redirect('/');
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
  },

  getSessionStore: function() {
      return sessionStore;
  },

  getStockPrices: function(stocks, callback) {
    var stockList = '';
    stocks.forEach(function(stock) {
        stockList += stock + ',';
    });
    
    var options = {  
      host: 'download.finance.yahoo.com',  
      port: 80,
      path: '/d/quotes.csv?s=' + stockList + '&f=sl1c1d1&e=.csv'
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
          var tokens = data.split('\r\n');
          var prices = [];
          tokens.forEach(function(line) {
              var price = line.split(",")[1];
              if (price)
                prices.push(price);
          });
          
        callback(null, prices);
      });  
    });  
    
  },
  
  getUserById: function(id, callback) {
    db.findOne('users', {_id: new ObjectID(id)}, callback);
  },     
  

   getUser: function(username, callback) {
    db.findOne('users', {username: username}, callback);
  }, 
 
     
}

function encryptPassword(plainText) {
    return crypto.createHash('md5').update(plainText).digest('hex');
}
