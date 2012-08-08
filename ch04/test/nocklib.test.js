'use strict';

var assert = require('assert')
  , db = require('../lib/db')
  , nocklib = require('../lib/nocklib')
  , should = require('should');

var exchangeData = {};

suite('nocklib', function() {

    test('addStock should add a stock and return the price', function(done) {
        
        db.find('users', {}, 1, function(err, users) {
            nocklib.addStock(users[0]._id, 'GOOG', function(err, price) {
                console.log(price);
                db.findOne('users', {_id: users[0]._id}, function(err, user) {
                    console.log(user);
                    done();
                });
                
            });
        });

        
    }); 
    
    test('getStockPrice should retrieve a stock price', function(done) {
        nocklib.getStockPrice('AAPL', function(err, price) {
            done();
        });
        
    }); 

});
    
    