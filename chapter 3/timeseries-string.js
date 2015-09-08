function TimeSeries(client, namespace) { // 1 
  this.namespace = namespace; // 2 
  this.client = client; // 3
  this.units = { // 4
     second: 1,
     minute: 60,
     hour: 60 * 60,
     day: 24 * 60 * 60
  };
  this.granularities = { // 5
    '1sec' : { name: '1sec', ttl: this.units.hour * 2, duration: this.units.second },// 6
    '1min' : { name: '1min', ttl: this.units.day * 7, duration: this.units.minute },// 7
    '1hour': { name: '1hour', ttl: this.units.day * 60 , duration: this.units.hour },// 8
    '1day' : { name: '1day', ttl: null, duration: this.units.day } // 9 };
  };
}

TimeSeries.prototype.insert = function(timestampInSeconds) { // 1 
  for (var granularityName in this.granularities) { // 2
    var granularity = this.granularities[granularityName]; // 3
    var key = this._getKeyName(granularity, timestampInSeconds); // 4 
    this.client.incr(key); // 5
    if (granularity.ttl !== null) { // 6
      this.client.expire(key, granularity.ttl); // 7 
    }
  }
};


TimeSeries.prototype._getKeyName = function(granularity, timestampInSeconds) { // 1
  var roundedTimestamp = this._getRoundedTimestamp(timestampInSeconds, granularity.duration); // 2
  return [this.namespace, granularity.name, roundedTimestamp]. join(':'); // 3
};

TimeSeries.prototype._getRoundedTimestamp = function(timestampInSeconds, precision) { // 1
  return Math.floor(timestampInSeconds/precision) * precision; // 2 
};


TimeSeries.prototype.fetch = function(granularityName, beginTimestamp, endTimestamp, onComplete) { // 1
  var granularity = this.granularities[granularityName]; // 2
  var begin = this._getRoundedTimestamp(beginTimestamp, granularity. duration); // 3
  var end = this._getRoundedTimestamp(endTimestamp, granularity. duration); // 4
  var keys = []; // 5
  for (var timestamp = begin; timestamp <= end; timestamp += granularity.duration) { // 6
    var key = this._getKeyName(granularity, timestamp); // 7
    keys.push(key); // 8 
  }
  this.client.mget(keys, function(err, replies) { // 9 
    var results = []; // 10
    for (var i = 0 ; i < replies.length ; i++) { // 11
      var timestamp = beginTimestamp + i * granularity.duration; // 12 
      var value = parseInt(replies[i], 10) || 0; // 13 
      results.push({timestamp: timestamp , value: value}); // 14
    }
    onComplete(granularityName, results); // 15 
  });
};

exports.TimeSeries = TimeSeries; // 16