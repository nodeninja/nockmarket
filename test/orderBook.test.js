'use strict';

var assert = require('assert');
var orderBook = require('../engine/orderBook');
var should = require('should');

suite('orderBook', function() {
    
    var bookData = {};
    test('addOrder should add a nockmarket order', function(done) {
        orderBook.add(orderBook.BUY, "NOCK1", 10.5, 1000, bookData, function(err, book) {
            should.not.exist(err);
            done();
        });        
    });   

});