var watch = require('node-watch');
var resolve = require('path').resolve;

var path = resolve(process.cwd(), './config');
console.log('watching ', path);

watch(path, function(filename) {
  console.log(filename, ' changed.');
});
