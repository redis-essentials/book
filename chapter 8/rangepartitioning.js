var util = require("util"); // 1
var Partitioning = require("partitioning"); // 2

function RangePartitioning(clients) { // 3
  Partitioning.call(this, clients); // 4
}

util.inherits(RangePartitioning, Partitioning); // 5

RangePartitioning.prototype._getClient = function(key) { // 6
  var possibleValues = '0123456789abcdefghijklmnopqrstuvwxyz'; // 7
  var rangeSize = possibleValues.length / this.clients.length; // 8
  for (var i = 0, clientIndex = 0 ; i < possibleValues.length ; i += rangeSize, clientIndex++) { // 9
    var range = possibleValues.slice(i, i + rangeSize); // 10

    if (range.indexOf(key[0].toLowerCase()) != -1) { // 11
      return this.clients[clientIndex]; // 12
    }
  }
  // if key does not start with 0 to 9 neither A to Z,
  // fall back to always using the first client
  return this.clients[0]; // 13
};
