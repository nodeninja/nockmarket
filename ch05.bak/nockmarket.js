'use strict';

var db = require('./lib/db')
  , exchangeData = {}
  , exch = require('./lib/exchange')
  , express = require('express')
  , nocklib = require('./lib/nocklib')
  , nockroutes = require('./routes/nockroutes.js')  
  , stocks = ['NOCK1'] 
  , timeFloor = 500
  , timeRange = 1000
  , _ = require('underscore');

function submitRandomOrder() {
  
  // order
  var ord = nocklib.generateRandomOrder(exchangeData); 
  //console.log('order', ord);
  if (ord.type == exch.BUY)
    exchangeData = exch.buy(ord.price, ord.volume, exchangeData);
  else  
    exchangeData = exch.sell(ord.price, ord.volume, exchangeData);  

  db.insertOne('transactions', ord, function(err, order) {
    if (exchangeData.trades) {
      var trades = exchangeData.trades.map(function(trade) {
        trade.init = (ord.type == exch.BUY) ? 'b' : 's';
        return trade;
      });
      nocklib.sendTrades(trades);
      db.insert('transactions', trades, function(err, trades) {
        pauseThenTrade();
      });
    }
    else
      pauseThenTrade();
    
  });
    
  function pauseThenTrade() { 
    var pause = Math.floor(Math.random() * timeRange) + timeFloor;
    setTimeout(submitRandomOrder, pause);
    //console.log(exch.getDisplay(exchangeData));      
  }

}

var app = express.createServer();
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'secretpasswordforsessions'
                            , key: 'express.sid'
                            , store: nocklib.getSessionStore()}));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public')); 

});
app.set('view options', {
    layout:false
});

app.get('/', nockroutes.getIndex); 
app.get('/api/user/:username', nockroutes.getUser);
app.get('/portfolio', nocklib.ensureAuthenticated, nockroutes.portfolio);
app.post('/add-stock', nockroutes.addStock);  
app.post('/signin', nockroutes.signin);
app.post('/signup', nockroutes.signup);

app.get('/api/trades', function(req, res) {
	db.find('transactions'
			, {init: {$exists: true}}
			, 100, function(err, trades) {
		if (err) {
			console.error(err);
			return;
		}
		var json = [];
		var lastTime = 0;
		// Highstock expects an array of arrays. Each 
		// subarray of form [time, price]
		trades.reverse().forEach(function(trade) {
			var date = new Date(parseInt(trade._id
								.toString()
								.substring(0,8), 16)*1000);
			var dataPoint = [date.getTime(), trade.price];
			if (date - lastTime > 1000)
				json.push(dataPoint);
			lastTime = date;
		});

		res.json(json);
	});
});
db.open(function() {	
    nocklib.createSocket(app);
	app.listen(3000); 
  	submitRandomOrder();  
});

	