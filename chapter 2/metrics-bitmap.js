var redis = require("redis");
var client = redis.createClient({return_buffers: true}); // 1

function storeDailyVisit(date, userId) { // 2
  var key = 'visits:daily:' + date; // 3
  client.setbit(key, userId, 1, function(err, reply) { // 4
    console.log("User", userId, "visited on", date); // 5 
  });
}

function countVisits(date) { // 1
  var key = 'visits:daily:' + date; // 2 
  client.bitcount(key, function(err, reply) { // 3
    console.log(date, "had", reply.toString(), "visits."); // 4 
  });
}

function showUserIdsFromVisit(date) { // 1
  var key = 'visits:daily:' + date; // 2 
  client.get(key, function(err, bitmapValue) { // 3
    var userIds = []; // 4
    var data = bitmapValue.toJSON().data; // 5
    data.forEach(function(byte, byteIndex) { // 6
      for (var bitIndex = 7 ; bitIndex >= 0 ; bitIndex--) { // 7
        var visited = byte >> bitIndex & 1; // 8
        if (visited === 1) { // 9
          var userId = byteIndex * 8 + (7 - bitIndex); // 10 
          userIds.push(userId); // 11
        } 
      }
    });
    console.log("Users " + userIds + " visited on " + date); // 12 
  });
}

storeDailyVisit('2015-01-01', '1');
storeDailyVisit('2015-01-01', '2');
storeDailyVisit('2015-01-01', '10');
storeDailyVisit('2015-01-01', '55');
countVisits('2015-01-01');
showUserIdsFromVisit('2015-01-01');

client.quit();