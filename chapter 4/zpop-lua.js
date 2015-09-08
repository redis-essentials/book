var redis = require("redis");
var client = redis.createClient();

client.zadd("presidents", 1732, "George Washington");
client.zadd("presidents", 1809, "Abraham Lincoln");
client.zadd("presidents", 1858, "Theodore Roosevelt");

var luaScript = [
  'local elements = redis.call("ZRANGE", KEYS[1], 0, 0)',
  'redis.call("ZREM", KEYS[1], elements[1])',
  'return elements[1]'
].join('\n'); // 1

client.eval(luaScript, 1, "presidents", function(err, reply) { // 2
  console.log("The first president in the group is:", reply);
  client.quit();
});
