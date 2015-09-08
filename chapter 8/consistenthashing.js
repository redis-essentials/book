var util = require("util");
var crypto = require("crypto");
var Partitioning = require("partitioning");

function ConsistentHashingPartitioning(clients, vnodes) { // 1
  this._vnodes = vnodes || 256; // 2
  this._ring = {}; // 3
  this._setUpRing(clients); // 4
}

util.inherits(ConsistentHashingPartitioning, Partitioning); // 5

ConsistentHashingPartitioning.prototype._getClient = function(key) { // 6
  var ringHashes = Object.keys(this._ring); // 7
  var keyHash = this._hashFunction(key); // 8
  ringHashes.sort(); // 9
  for (var i = 0 ; i < ringHashes.length ; i++) { // 10
    var ringHash = ringHashes[i]; // 11
    if (ringHash >= keyHash) { // 12
      return this._ring[ringHash]; // 13
    }
  }
  // fallback to the start of the ring
  return this._ring[ringHashes[0]]; // 14
};

ConsistentHashingPartitioning.prototype._hashFunction = function(str) { // 15
  return crypto.createHash('md5').update(str).digest('hex');
};

ConsistentHashingPartitioning.prototype._setUpRing = function(clients) { // 16
  for (var i = 0 ; i < clients.length; i++) {
    this.addClient(clients[i]);
  }
};

ConsistentHashingPartitioning.prototype.addClient = function(client) { // 17
  for (var i = 0 ; i < this._vnodes ; i++) { // 18
    var hash = this._hashFunction(client.address + ":" + i); // 19
    this._ring[hash] = client; // 20
  }
};

ConsistentHashingPartitioning.prototype.removeClient = function(client) { // 21
  for (var i = 0 ; i < this._vnodes ; i++) {
    var hash = this._hashFunction(client.address + ":" + i);
    delete this._ring[hash];
  }
};
