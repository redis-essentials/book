var redis = require('redis');
var client = redis.createClient();

function addVisit(date, user) { // 1 
  var key = 'visits:' + date; // 2 
  client.pfadd(key, user); // 3
}

function count(dates) { // 1
  var keys = []; // 2 
  dates.forEach(function(date, index) { // 3
    keys.push('visits:' + date);
  });
  client.pfcount(keys, function(err, reply) { // 4 
    console.log('Dates', dates.join(', '), 'had', reply, 'visits');
  }); 
}

function aggregateDate(date) { // 1 
  var keys = ['visits:' + date]; // 2 
  for (var i = 0; i < 24; i++) { // 3
    keys.push('visits:' + date + 'T' + i); // 4 
  }
  client.pfmerge(keys, function(err, reply) { // 5 
    console.log('Aggregated date', date);
  }); 
}


var MAX_USERS = 200; // 1
var TOTAL_VISITS = 1000; // 2
for (var i = 0; i < TOTAL_VISITS; i++) { // 3
  var username = 'user_' + Math.floor(1 + Math.random() * MAX_USERS); // 4
  var hour = Math.floor(Math.random() * 24); // 5 
  addVisit('2015-01-01T' + hour, username); // 6
}
count(['2015-01-01T0']); // 7
count(['2015-01-01T5', '2015-01-01T6', '2015-01-01T7']); // 8 
aggregateDate('2015-01-01'); // 9
count(['2015-01-01']); // 10 

client.quit();