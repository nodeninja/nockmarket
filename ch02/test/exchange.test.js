'use strict';

var assert = require('assert')
  , exchange = require('../lib/exchange')
  , nocklib = require('../lib/nocklib')
  , should = require('should');

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
    
    