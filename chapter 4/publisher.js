var redis = require("redis");
var client = redis.createClient();

var channel = process.argv[2]; // 1
var command = process.argv[3]; // 2

client.publish(channel, command); // 3

client.quit();
