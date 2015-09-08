var redis = require("redis");
var client = redis.createClient();
var queue = require("./queue"); // 1
var logsQueue = new queue.Queue("logs", client); // 2

function logMessages() { // 3 
	logsQueue.pop(function(err, replies) { // 4
		var queueName = replies[0];
		var message = replies[1];
		console.log("[consumer] Got log: " + message); // 5
		logsQueue.size(function(err, size) { // 6 
			console.log(size + " logs left");
		});
		logMessages(); // 7 
	});
}
logMessages(); // 8