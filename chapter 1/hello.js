var redis = require("redis"); // 1
var client = redis.createClient(); // 2
client.set("my_key", "Hello World using Node.js and Redis"); // 3 
client.get("my_key", redis.print); // 4
client.quit(); // 5