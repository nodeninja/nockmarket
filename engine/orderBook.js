'use strict';

var $ = require('jquery')
    , BinaryHeap = require('./BinaryHeap');

var BUY = "BUY";
var SELL = "SELL";

module.exports = {
    
    add: function add(orderType, price, volume, exchangeData, callback) {
        
        // Avoid side effects
        var priceString = price.toString();
        if (SELL === orderType) {
            priceString = (-price).toString();
        }
        
        // Clone to avoid side effects
        var clonedVolumes = {};
        if (exchangeData.volumes)
            clonedVolumes = $.extend({}, exchangeData.volumes); 
            
        var oldVolume = clonedVolumes[priceString];

        // Store order prices
        var clonedBuys; 
        if (exchangeData.buys)
            clonedBuys = $.extend({}, exchangeData.buys); 
        else
            clonedBuys = createBinaryHeap();
            
        var clonedSells;
        if (exchangeData.sells)
            clonedSells = $.extend({}, exchangeData.sells); 
        else
            clonedSells = createBinaryHeap();            
        
        // We only need to store prices if they are new otherwise we get 
        // duplicate prices
        if (oldVolume) {            
            if (SELL === orderType) {
                clonedSells.push(-price);
            }
            else {
                clonedBuys.push(price);
            }
        }
        
        // Was there a trade? This occurs when a buy order matches with a sell 
        // order or vice versa
        var trade = false;
        if (BUY === orderType && 
            clonedSells.length > 0 && 
            price >= Math.abs(clonedSells.peek())) {
            trade = true;
        }
        else if (SELL === orderType && 
                    clonedBuys.length > 0 && 
                    price <= clonedBuys.peek()) {
            trade = true;
        }
        
        // A trade means several things
        // 1. The existing order is not added to the book
        // 2. Matching orders on the other side of the book are wiped out
        // 3. Trades are returned in an array
        if (trade) {
            var remainingVolume = volume;
            while (remainingVolume > 0) {
                if (BUY === orderType) {
                    var bestSellPrice = clonedBuys.peek();
                    var bestSellVolume = 0;
                }
            }
        }

        var newVolume = volume;
        
        // Add to existing volume
        if (oldVolume) newVolume += oldVolume;
        clonedVolumes[priceString] = newVolume;
        
        callback(null, {volumes: clonedVolumes, buys: clonedBuys, sells: clonedSells});
        
    },

    BUY: BUY,
    SELL: SELL
}

function createBinaryHeap() {
    return new BinaryHeap(function(x){return x;});
}