var $ = require('jquery');
var myData = {name: 'John'};

function fixName(data) {
    var newData = $.extend({}, data);    
    newData.name = 'Mike';
    return newData;
}

var myData2 = fixName(myData);
console.log(myData2.name);
console.log(myData.name);