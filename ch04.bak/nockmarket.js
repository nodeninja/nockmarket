'use strict';

var db = require('./lib/db')
  , exchangeData = {}
  , exch = require('./lib/exchange')
  , express = require('express')
  , nocklib = require('./lib/nocklib')
  , stocks = ['NOCK1'] 
  , timeFloor = 500
  , timeRange = 1000
  , _ = require('underscore');

function submitRandomOrder() {
  
  // order
  var ord = nocklib.generateRandomOrder(exchangeData); 
  console.log('order', ord);
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
    console.log(exch.getDisplay(exchangeData));      
  }

}

var app = express.createServer();
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'secretpasswordforsessions'}));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public')); 

});
app.set('view options', {
    layout:false
});

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/api/user/:username', function(req, res) {
    nocklib.getUser(req.params.username, function(err, user) {
        console.log(user);
        if (user)
            res.send('1');
        else
            res.send('0');
    });
});

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

app.get('/portfolio', function(req, res) {
    
    nocklib.getUserById(req.session._id, function(err, user) {
        nocklib.getMultiStockPrice(user.portfolio, function(err, prices) {
            res.render('portfolio', {portfolio: user.portfolio, prices: prices});
        });
         
    });
   
});

app.post('/add-stock', function(req, res) {
    if (req.xhr) {    
        nocklib.addStock(req.session._id, req.body.stock, function(err, price) {
            res.send(price);
        });
    }
    
});

app.post('/signin', function(req, res) {
    nocklib.authenticate(req.body.username
                        , req.body.password, function(err, id) {
        if (id) {    
            req.session._id = id;
            res.redirect('/portfolio');
        }
        else
            res.redirect('/');
    });    
});
app.post('/signup', function(req, res) {
    nocklib.createUser(req.body.username
                        , req.body.email
                        , req.body.password, function(err, user) {
        console.log(user);
        res.redirect('/portfolio');
    });
    
});

db.open(function() {	
	app.listen(3000); 
  //	submitRandomOrder();  
});

	