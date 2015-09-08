var redis = require("redis");
var client = redis.createClient();
if (process.argv.length < 3) {
  console.log("ERROR: You need to specify a data type!");
  console.log("$ node using-timeseries.js [sorted-set|hyperloglog]");
  process.exit(1);
}

var dataType = process.argv[2];
client.flushall();
var timeseries = require("./timeseries-" + dataType);
var concurrentPlays = new timeseries.TimeSeries(client, "concurrentplays");
var beginTimestamp = 0;

concurrentPlays.insert(beginTimestamp, "user:max");
concurrentPlays.insert(beginTimestamp, "user:max");
concurrentPlays.insert(beginTimestamp + 1, "user:hugo");
concurrentPlays.insert(beginTimestamp + 1, "user:renata");
concurrentPlays.insert(beginTimestamp + 3, "user:hugo");
concurrentPlays.insert(beginTimestamp + 61, "user:kc");

function displayResults(granularityName, results) {
  console.log("Results from " + granularityName + ":");
  console.log("Timestamp \t| Value");
  console.log("--------------- | ------");
  for (var i = 0 ; i < results.length; i++) {
    console.log('\t' + results[i].timestamp + '\t| ' + results[i].value); 
  }
  console.log();
}

concurrentPlays.fetch("1sec", beginTimestamp, beginTimestamp + 4, displayResults);
concurrentPlays.fetch("1min", beginTimestamp, beginTimestamp + 120, displayResults);
client.quit();