var redis = require('redis');
var options = { // 1
  "no_ready_check": true,
};
var client = redis.createClient(22121, 'localhost', options); // 2
var alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]; // 3
alphabet.forEach(function(letter) { // 4
  client.set(letter, letter); // 5
});
client.quit(); // 6
