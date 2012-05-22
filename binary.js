var BinaryHeap = require('./engine/BinaryHeap');

var heap = new BinaryHeap(function(x){return x;});
var data = [10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5];
for (var i=0; i<data.length; i++) {
    heap.push(data[i]);
}
//heap.remove(2);
while (heap.size() > 0)
  console.log(heap.pop());