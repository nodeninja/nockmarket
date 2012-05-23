'use strict';

var $ = require('jquery')
    , BinaryHeap = require('./BinaryHeap');
    
var BUY = "buys", SELL = "sells";

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

module.exports = {
    
    buy: function(price, volume, exchangeData) {
        return module.exports.order("buys", price, volume, exchangeData);
    },
    
    BUY: BUY,

    sell: function(price, volume, exchangeData) {
        return module.exports.order("sells", price, volume, exchangeData);
    },
    
    SELL: SELL,
    
    order: function(orderType, price, volume, exchangeData) {

        // Init
        var clonedExchange = createExchange(exchangeData);
        var priceString = price.toString();  
        var orderBook = clonedExchange[orderType];
            
        var oldVolume = orderBook.volumes[priceString];
        
        // Was there a trade? This occurs when a buy order matches with a sell 
        // order or vice versa
        var trade = false;
  
        if (BUY == orderType && 
            clonedExchange[SELL].prices.size() > 0 && 
            price >= clonedExchange[SELL].prices.peek()) {                
            trade = true;
        }
        else if (SELL == orderType && 
            clonedExchange[BUY].prices.size() > 0 && 
            price <= clonedExchange[BUY].prices.peek()) {                
            trade = true;
        }
        
        // A trade means several things
        // 1. The existing order is not added to the book
        // 2. Matching orders on the other side of the book are wiped out
        // 3. Trades are returned in an array
       
        var remainingVolume = volume;
        var storePrice = true;
        if (trade) {
            
            var opposingBook = clonedExchange[BUY]
            if (orderType == BUY)
                opposingBook = clonedExchange[SELL]
                
            while (remainingVolume > 0) {
                var bestOpposingPrice = opposingBook.prices.peek();
                var bestOpposingVolume = opposingBook.volumes[bestOpposingPrice];
                    console.log(bestOpposingPrice, bestOpposingVolume, remainingVolume, priceString, 11111111111);
                    // The order does not wipe out any price levels
                    if (bestOpposingVolume > remainingVolume) {
                        clonedExchange.trades.push({price: bestOpposingPrice, volume: remainingVolume});
                        opposingBook.volumes[bestOpposingPrice] = opposingBook.volumes[bestOpposingPrice] - remainingVolume; 
                        remainingVolume = 0;  
                        storePrice = false;
                    }
                    // The order has wiped out the entire other side
                    else {                        
                        clonedExchange.trades.push({price: bestOpposingPrice, volume: opposingBook.volumes[bestOpposingPrice]});
                        remainingVolume = remainingVolume - opposingBook.volumes[bestOpposingPrice];
                        // Pop the best price from the heap
                        opposingBook.prices.pop();
                        delete opposingBook.volumes[bestOpposingPrice];
                      //  console.log(opposingBook, bestOpposingPrice, 9999, remainingVolume, opposingBook.volumes[bestOpposingPrice]);
                    }
            }
        }

        
        // We only need to store prices if they are new otherwise we get 
        // duplicate prices
        if (!oldVolume && storePrice) clonedExchange[orderType].prices.push(price);

        var newVolume = remainingVolume;
        
        // Add to existing volume
        if (oldVolume) newVolume += oldVolume;
        if (newVolume > 0)
            orderBook.volumes[priceString] = newVolume;
        return clonedExchange;
        
    }
    
}
