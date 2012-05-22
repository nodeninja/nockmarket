'use strict';

var assert = require('assert');
var orderBook = require('../engine/orderBook');
var should = require('should');

suite('orderBook', function() {
    
    var exchangeData = {};
    test('add should add a BUY nockmarket order', function(done) {
        exchangeData = orderBook.add(orderBook.BUY, 10.5, 1000, exchangeData);
        exchangeData.volumes['10.5'].should.eql(1000);
        done();    
    }); 
    
    test('add should add a SELL nockmarket order', function(done) {
        exchangeData = orderBook.add(orderBook.SELL, 11, 750, exchangeData);
        exchangeData.volumes['-11'].should.eql(750);
        done();      
    });     

    test('add should cumulate BUY orders', function(done) {
        exchangeData = orderBook.add(orderBook.BUY, 10.5, 500, exchangeData);
        exchangeData.volumes['10.5'].should.eql(1500);
        done();      
    });  
    
    test('add should produce trades', function(done) {
        exchangeData = orderBook.add(orderBook.BUY, 11, 400, exchangeData);
        exchangeData.trades[0].price.should.eql(11);
       // exchangeData.volumes['11'].should.eql(350);
        done();      
    });     

});