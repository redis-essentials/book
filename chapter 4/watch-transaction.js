var redis = require("redis");
var client = redis.createClient();

function zpop(key, callback) { // 1
  client.watch(key, function(watchErr, watchReply) { // 2
    client.zrange(key, 0, 0, function(zrangeErr, zrangeReply) { // 3
      var multi = client.multi(); // 4
      multi.zrem(key, zrangeReply); // 5
      multi.exec(function(transactionErr, transactionReply) { // 6
        if (transactionReply) {
          callback(zrangeReply[0]); // 7
        } else {
          zpop(key, callback); // 8
        }
      });
    });
  });
}

client.zadd("presidents", 1732, "George Washington");
client.zadd("presidents", 1809, "Abraham Lincoln");
client.zadd("presidents", 1858, "Theodore Roosevelt");

zpop("presidents", function(member) {
  console.log("The first president in the group is:", member);
  client.quit();
});
