var redis = require("redis");
var client = redis.createClient();

function markDealAsSent(dealId, userId) { // 1 
  client.sadd(dealId, userId); // 2
}

function sendDealIfNotSent(dealId, userId) { // 1 
  client.sismember(dealId, userId, function(err, reply) { // 2
    if (reply) {
      console.log("Deal", dealId, "was already sent to user", userId); // 3 
    } else {
      console.log("Sending", dealId, "to user", userId); // 4 
      // code to send the deal to the user would go here... // 5 
      markDealAsSent(dealId, userId); // 6
    } 
  });
}

function showUsersThatReceivedAllDeals(dealIds) { // 1 
  client.sinter(dealIds, function(err, reply) { // 2
    console.log(reply + " received all of the deals: " + dealIds); // 3 
  });
}

function showUsersThatReceivedAtLeastOneOfTheDeals(dealIds) { // 1 
  client.sunion(dealIds, function(err, reply) { // 2
    console.log(reply + " received at least one of the deals: " + dealIds); // 3
  });
}

markDealAsSent('deal:1', 'user:1');
markDealAsSent('deal:1', 'user:2');
markDealAsSent('deal:2', 'user:1');
markDealAsSent('deal:2', 'user:3');
sendDealIfNotSent('deal:1', 'user:1');
sendDealIfNotSent('deal:1', 'user:2');
sendDealIfNotSent('deal:1', 'user:3');
showUsersThatReceivedAllDeals(["deal:1", "deal:2"]);
showUsersThatReceivedAtLeastOneOfTheDeals(["deal:1", "deal:2"]);

client.quit();