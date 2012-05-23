'use strict';

var assert = require('assert');
var exchange = require('../engine/exchange');
var should = require('should');

suite('orderBook', function() {
    
    var exchangeData = {};
    var BUY = exchange.BUY;
    var SELL = exchange.SELL;
    
    test('buy should add a BUY nockmarket order', function(done) {
        exchangeData = exchange.buy(10.5, 1000, exchangeData);
        exchangeData.buys.volumes['10.5'].should.eql(1000);
        done();    
    }); 

    test('buy should add a SELL nockmarket order', function(done) {
        exchangeData = exchange.sell(11, 750, exchangeData);
        exchangeData.sells.volumes['11'].should.eql(750);
        done();      
    });     

    test('buy should cumulate BUY orders', function(done) {
        exchangeData = exchange.buy(10.5, 500, exchangeData);
        exchangeData.buys.volumes['10.5'].should.eql(1500);
        done();      
    });  
   
    test('buy should produce trades', function(done) {
        exchangeData = exchange.buy(11, 400, exchangeData);
        exchangeData.trades[0].price.should.eql(11);
        exchangeData.trades[0].volume.should.eql(400);
        exchangeData[SELL].volumes['11'].should.eql(350);
        should.not.exist(exchangeData[BUY].volumes['11']);
        done();      
    }); 
    
    test('buy should add multiple levels of prices', function(done) {
        exchangeData = exchange.buy(10, 900, exchangeData);
        exchangeData.buys.volumes['10'].should.eql(900);     
        exchangeData = exchange.buy(9.5, 800, exchangeData);
        exchangeData.buys.volumes['9.5'].should.eql(800);          
        done(); 
        
    }); 
    
    test('sell should produce multiple', function(done) {
        exchangeData = exchange.sell(5, 1600, exchangeData);
        console.log(exchangeData);
        exchangeData.trades[0].price.should.eql(10.5);
        exchangeData.trades[1].price.should.eql(10);
        done();      
    });     
    

});