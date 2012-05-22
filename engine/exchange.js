'use strict';

var $ = require('jquery')
    , BinaryHeap = require('./BinaryHeap');

var BUY = "BUY";
var SELL = "SELL";

module.exports = {
    
    add: function(orderType, price, volume, exchangeData) {
        
        var priceString = price.toString();
        
        // Clone to avoid side effects
        var clonedBuyVolumes = {};
        var clonedSellVolumes = {};
        if (exchangeData.clonedBuyVolumes)
            clonedBuyVolumes = $.extend({}, exchangeData.clonedBuyVolumes); 
        if (exchangeData.clonedSellVolumes)
            clonedSellVolumes = $.extend({}, exchangeData.clonedSellVolumes);         
            
        var oldVolume;
        if (BUY === orderType)
            oldVolume = clonedBuyVolumes[priceString];
        else
            oldVolume = clonedBuyVolumes[priceString];
        
        // Store order prices
        var clonedBuys = cloneOrCreate(exchangeData.buys);            
        var clonedSells = cloneOrCreate(exchangeData.sells);          
        
        // We only need to store prices if they are new otherwise we get 
        // duplicate prices
        if (!oldVolume) {            
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
            clonedSells.size() > 0 && 
            price >= Math.abs(clonedSells.peek())) {                
            trade = true;
        }
        else if (SELL === orderType && 
                    clonedBuys.size() > 0 && 
                    price <= clonedBuys.peek()) {
            trade = true;
        }
        
        var trades = [];
        // A trade means several things
        // 1. The existing order is not added to the book
        // 2. Matching orders on the other side of the book are wiped out
        // 3. Trades are returned in an array
        if (trade) {
            var remainingVolume = volume;
            while (remainingVolume > 0) {
                if (BUY === orderType) {
                    var bestSellPrice = Math.abs(clonedSells.peek());
                    var bestSellVolume = clonedVolumes['-' + priceString];
                    console.log(bestSellPrice, bestSellVolume);
                    // The order does not wipe out any price levels
                    if (bestSellVolume > remainingVolume) {
                        trades.push({price: bestSellPrice, volume: remainingVolume});
                        remainingVolume = 0;
                        console.log(clonedVolumes[priceString]);
                        clonedVolumes[priceString] = clonedVolumes[priceString] - remainingVolume;  
                    }
                }
             
            }
        }

        var newVolume = volume;
        
        // Add to existing volume
        if (oldVolume) newVolume += oldVolume;
        clonedVolumes[priceString] = newVolume;
        
        return {volumes: clonedVolumes, buys: clonedBuys, sells: clonedSells, trades: trades};
        
    },

    BUY: BUY,
    SELL: SELL
}

function cloneOrCreate(prices) {
    if (prices)
        return $.extend({}, prices); 
    else
        return createBinaryHeap();    
}

function createBinaryHeap() {
    return new BinaryHeap(function(x){return x;});
}
