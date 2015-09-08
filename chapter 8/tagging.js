var util = require("util");
var crypto = require("crypto");
var Partitioning = require("partitioning");

function ConsistentHashingPartitioning(clients, vnodes) {
  this._vnodes = vnodes || 256;
  this._ring = {};
  this._setUpRing(clients);
}

util.inherits(ConsistentHashingPartitioning, Partitioning);

ConsistentHashingPartitioning.prototype._getClient = function(key) {
  var ringHashes = Object.keys(this._ring);
  var keyHash = this._hashFunction(key);
  ringHashes.sort();
  for (var i = 0 ; i < ringHashes.length ; i++) {
    var ringHash = ringHashes[i];
    if (ringHash >= keyHash) {
      return this._ring[ringHash];
    }
  }
  // fallback to the start of the ring
  return this._ring[ringHashes[0]];
};

/*
This is the only function that was changed when compared to consistenthashing.js
*/
ConsistentHashingPartitioning.prototype._hashFunction = function(str) {
  var stringToHash;
  // match string like "foo{bar}"
  var tagRegex = /.+\{(.+)\}/; // 1
  var regexValues = tagRegex.exec(str); // 2
  if (regexValues === null) { // 3
    stringToHash = str;
  } else { // 4
    stringToHash = regexValues[1];
  }
  return crypto.createHash('md5').update(stringToHash).digest('hex'); // 5
};


ConsistentHashingPartitioning.prototype._setUpRing = function(clients) {
  for (var i = 0 ; i < clients.length; i++) {
    this.addClient(clients[i]);
  }
};

ConsistentHashingPartitioning.prototype.addClient = function(client) {
  for (var i = 0 ; i < this._vnodes ; i++) {
    var hash = this._hashFunction(client.address + ":" + i);
    this._ring[hash] = client;
  }
};

ConsistentHashingPartitioning.prototype.removeClient = function(client) {
  for (var i = 0 ; i < this._vnodes ; i++) {
    var hash = this._hashFunction(client.address + ":" + i);
    delete this._ring[hash];
  }
};
