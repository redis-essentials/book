var redis = require("redis");
var client = redis.createClient();

function transfer(from, to, value, callback) { // 1
  client.get(from, function(err, balance) { // 2
    var multi = client.multi(); // 3
    multi.decrby(from, value); // 4
    multi.incrby(to, value); // 5
    if (balance >= value) { // 6
      multi.exec(function(err, reply) { // 7
        callback(null, reply[0]); // 8
      });
    } else {
      multi.discard(); // 9
      callback(new Error("Insufficient funds"), null); // 10
    }
  });
}



client.mset("max:checkings", 100, "hugo:checkings", 100, function(err, reply) { // 1
  console.log("Max checkings: 100");
  console.log("Hugo checkings: 100");
  transfer("max:checkings", "hugo:checkings", 40, function(err, balance) { // 2
    if (err) {
      console.log(err);
    } else {
      console.log("Transferred 40 from Max to Hugo")
      console.log("Max balance:", balance);
    }
    client.quit();
  });
});

