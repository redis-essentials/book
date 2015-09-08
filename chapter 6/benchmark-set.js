var redis = require("redis");
var client = redis.createClient();
var MAX_USERS = 100000;
var MAX_DEALS = 12;
var MAX_DEAL_ID = 10000;

for (var i = 0 ; i < MAX_USERS ; i++) {
  var multi = client.multi();
  for (var j = 0 ; j < MAX_DEALS ; j++) {
    multi.sadd("set:user:" + i, MAX_DEAL_ID - j, 1);
  }
  multi.exec();
}

client.quit();
