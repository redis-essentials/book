var redis = require("redis");
var client = redis.createClient();

client.set("mykey", "myvalue"); // 1

var luaScript = 'return redis.call("GET", KEYS[1])'; // 2
client.eval(luaScript, 1, "mykey", function(err, reply) { // 3
  console.log(reply); // 4
  client.quit();
});
