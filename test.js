const similarity = require('compute-cosine-similarity');

var x = [0, 0, 0, 0, 0],
  y = [1, 1, 1, 0, 0];

var s = similarity(x, y);

console.log(s);
