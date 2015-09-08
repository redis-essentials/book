function Partitioning(clients) { // 1
  this.clients = clients;
}

Partitioning.prototype = {
  _getClient: function(key) { // 2
    throw "Subclass should implement _getClient() method";
  },
  set: function(key, value) { // 3
    var client = this._getClient(key); // 4
    client.set.apply(client, arguments); // 5
  },
  get: function(key) { // 6
    var client = this._getClient(key);
    client.get.apply(client, arguments);
  }
};

module.exports = Partitioning; // 7
