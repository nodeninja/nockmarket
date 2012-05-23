'use strict';

var $ = require('jquery')
    , BinaryHeap = require('./BinaryHeap');
    
var BUY = "buys", SELL = "sells";

module.exports = {
    
    buy: function(price, volume, exchangeData) {
        return module.exports.order("buys", price, volume, exchangeData);
    },
    
    BUY: BUY,
    
    order: function(orderType, price, volume, exchangeData) {

        // Init
        var clonedExchange = createExchange(exchangeData);
        var priceString = price.toString();  
        var orderBook = clonedExchange[orderType];
            
        var oldVolume = orderBook.volumes[priceString];
        
        // We only need to store prices if they are new otherwise we get 
        // duplicate prices
        if (!oldVolume) clonedExchange[orderType].prices.push(price);
        
        // Was there a trade? This occurs when a buy order matches with a sell 
        // order or vice versa
        var trade = false;
  
        if (BUY == orderType && 
            clonedExchange[SELL].prices.size() > 0 && 
            price >= Math.abs(clonedExchange[SELL].prices.peek())) {                
            trade = true;
        }
        
        // A trade means several things
        // 1. The existing order is not added to the book
        // 2. Matching orders on the other side of the book are wiped out
        // 3. Trades are returned in an array
       
        var remainingVolume = volume;
        if (trade) {
            
            var opposingBook = clonedExchange[BUY]
            if (orderType == BUY)
                opposingBook = clonedExchange[SELL]
                
            while (remainingVolume > 0) {
                var bestSellPrice = opposingBook.prices.peek();
                var bestSellVolume = opposingBook.volumes[priceString];
                    console.log(bestSellPrice, bestSellVolume, remainingVolume, priceString);
                    // The order does not wipe out any price levels
                    if (bestSellVolume > remainingVolume) {
                        clonedExchange.trades.push({price: bestSellPrice, volume: remainingVolume});
                        opposingBook.volumes[priceString] = opposingBook.volumes[priceString] - remainingVolume; 
                        remainingVolume = 0;                         
                    }
            }
        }

        var newVolume = remainingVolume;
        
        // Add to existing volume
        if (oldVolume) newVolume += oldVolume;
        if (newVolume > 0)
            orderBook.volumes[priceString] = newVolume;
        return clonedExchange;
        
    },
    
    sell: function(price, volume, exchangeData) {
        return module.exports.order("sells", price, volume, exchangeData);
    },
    
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

function createExchange(exchangeData) {
    
    function init(exchange, orderType) {
        if (!exchange[orderType]) {
            exchange[orderType] = {};
            exchange[orderType].volumes = {};
            exchange[orderType].prices = createBinaryHeap();
        }
    }
    
    var cloned = $.extend(true, {}, exchangeData);
    cloned.trades = [];
    init(cloned, BUY);
    init(cloned, SELL);
    return cloned;
    
}
