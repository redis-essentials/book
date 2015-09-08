var redis = require("redis");
var client = redis.createClient();

var luaScript = 'return "Lua script using EVALSHA"';
client.script("load", luaScript, function(err, reply) {
  var scriptId = reply;

  client.evalsha(scriptId, 0, function(err, reply) {
    console.log(reply);
    client.quit();
  })
});
