var redis = require("redis");
var client = redis.createClient();
var queue = require("./queue"); // 1
var logsQueue = new queue.Queue("logs", client); // 2 
var MAX = 5;
for (var i = 0 ; i < MAX ; i++) { // 3
	logsQueue.push("Hello world #" + i); // 4 
}
console.log("Created " + MAX + " logs"); // 5 
client.quit();