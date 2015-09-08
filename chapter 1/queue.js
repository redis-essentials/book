function Queue(queueName, redisClient) { // 1 
  this.queueName = queueName; // 2 
  this.redisClient = redisClient; // 3 
  this.queueKey = 'queues:' + queueName; // 4 
  // zero means no timeout 
  this.timeout = 0; // 5 
}

Queue.prototype.size = function(callback) { // 1 
  this.redisClient.llen(this.queueKey, callback); // 2
};


Queue.prototype.push = function(data) { // 1 
  this.redisClient.lpush(this.queueKey, data); // 2
};

Queue.prototype.pop = function(callback) { // 1 
  this.redisClient.brpop(this.queueKey, this.timeout, callback); // 2
};

exports.Queue = Queue; // 1