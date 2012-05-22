'use strict';

var assert = require('assert');
var orderBook = require('../engine/orderBook');
var should = require('should');

suite('orderBook', function() {
    
    var exchangeData = {};
    test('addOrder should add a BUY nockmarket order', function(done) {
        orderBook.add(orderBook.BUY, 10.5, 1000, exchangeData, function(err, newData) {
            should.not.exist(err);
            newData.volumes['10.5'].should.eql(1000);
            exchangeData = newData;
            done();
        });        
    }); 
    
    test('addOrder should add a SELL nockmarket order', function(done) {
        orderBook.add(orderBook.SELL, 11, 750, exchangeData, function(err, newData) {
            should.not.exist(err);
            newData.volumes['-11'].should.eql(750);
            exchangeData = newData;
            done();
        });        
    });     

    test('addOrder should cumulate BUY orders', function(done) {
        orderBook.add(orderBook.BUY, 10.5, 500, exchangeData, function(err, newData) {
            should.not.exist(err);
            newData.volumes['10.5'].should.eql(1500);
            exchangeData = newData;
            while (exchangeData.buys.size() > 0)
                console.log(exchangeData.buys.pop());
            done();
        });        
    });  

});