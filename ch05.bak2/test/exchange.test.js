'use strict';

var assert = require('assert')
  , exchange = require('../lib/exchange')
  , nocklib = require('../lib/nocklib')
  , should = require('should')
  ,  $ = require('jquery');

var exchangeData = {};

suite('exchange', function() {    
 
    test('buy should add a BUY nockmarket order', function(done) {
        exchangeData = exchange.buy(40, 100, exchangeData);
        exchangeData.buys.volumes[40].should.eql(100);
        done();    
    }); 

    test('sell should add a SELL nockmarket order', function(done) {
        exchangeData = exchange.sell(41, 200, exchangeData);
        exchangeData.sells.volumes[41].should.eql(200);
        done();      
    });  


    test('sell should produce trades', function(done) {
        exchangeData = exchange.sell(40, 75, exchangeData);
        exchangeData.trades[0].price.should.eql(40);
        exchangeData.trades[0].volume.should.eql(75);
        exchangeData.buys.volumes[40].should.eql(25);
        exchangeData.sells.volumes[41].should.eql(200);
        done();      
    });    

    test('buy should cumulate BUY orders', function(done) {
        exchangeData = exchange.buy(40, 75, exchangeData);
        exchangeData.buys.volumes[40].should.eql(100);
        exchangeData = exchange.buy(39, 7, exchangeData);
        exchangeData.buys.volumes[39].should.eql(7);
        done();      
    });  
    
    test('sell should cumulate SELL orders', function(done) {
        exchangeData = exchange.sell(42, 250, exchangeData);
        exchangeData.sells.volumes[42].should.eql(250);
        done();        
    });    
     
    test('buy should produce trades', function(done) {
        exchangeData = exchange.buy(41, 25, exchangeData);
        exchangeData.trades[0].price.should.eql(41);
        exchangeData.trades[0].volume.should.eql(25);
        done();      
    });  
    
          
    test('sell should produce trades', function(done) {
        exchangeData = exchange.sell(40, 1, exchangeData);
        exchangeData.trades[0].price.should.eql(40);
       // console.log(exchangeData);
        done();      
    });  
    
    test('buy should handle wiping of order book', function(done) {
      exchangeData = {}
      exchangeData = exchange.buy(36, 104, exchangeData);
      exchangeData = exchange.sell(32, 119, exchangeData);
      exchangeData.trades[0].price.should.eql(36);
      exchangeData.trades.length.should.eql(1);
      done();      
    });   
	test('buys should sometimes not produce trades', function(done) {
		exchangeData = {};
		exchangeData = exchange.buy(40, 109, exchangeData);
		exchangeData = exchange.sell(37, 109, exchangeData);
		exchangeData = exchange.sell(39, 119, exchangeData);
		exchangeData = exchange.sell(40, 108, exchangeData);
		exchangeData = exchange.buy(37, 98, exchangeData);
		done();
	});
	

    test('trade volumes and prices should never be null', function(done) {
    	
  		function submitRandomOrder() {
  	  
  		  // order
  		  var ord = nocklib.generateRandomOrder(exchangeData); 
        if (ord.type == exchange.BUY)
          exchangeData = exchange.buy(ord.price, ord.volume, exchangeData);
        else  
          exchangeData = exchange.sell(ord.price, ord.volume, exchangeData);	
        return ord;
  		} 
      
      var before = {};

      for (var h=0; h<100; h++) {
        
        exchangeData = {};
        var audit = [];
        for (var i=0; i<100; i++) {
          before = $.extend(true, {}, exchangeData);
          var order = submitRandomOrder();
          audit.push(order);
          if (exchangeData.trades && exchangeData.trades.length > 0) {
            for (var j=0; j<exchangeData.trades.length; j++) {
              should.exist(exchangeData.trades[j].price);
              should.exist(exchangeData.trades[j].volume);
            }
          }
        }
          
      }
      
      done();
    
    });   
           
          
});



suite('nocklib', function() {

    test('generateRandomOrder should generate a random order', function(done) {
        var order = nocklib.generateRandomOrder(exchangeData);
        should.exist(order.type);
        should.exist(order.price);
        should.exist(order.volume);
        done();
    }); 

});
    
    