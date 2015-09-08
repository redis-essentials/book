var util = require("util");
var crypto = require('crypto'); // 1
var Partitioning = require("partitioning");

function HashPartitioning(clients) {
  Partitioning.call(this, clients);
}

util.inherits(HashPartitioning, Partitioning);

HashPartitioning.prototype._getClient = function(key) { // 2
  var index = this._hashFunction(key) % this.clients.length;// 3
  return this.clients[index]; // 4
};

HashPartitioning.prototype._hashFunction = function(str) { // 5
  var hash = crypto.createHash('md5').update(str).digest('hex'); // 6
  return parseInt(hash, 16); // 7
};
