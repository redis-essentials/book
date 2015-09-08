var redis = require("redis");
var client = redis.createClient();
if (process.argv.length < 3) { // 1
    console.log("ERROR: You need to specify a data type!"); 
    console.log("$ node using-timeseries.js [string|hash]"); 
    process.exit(1);
}

var dataType = process.argv[2]; // 2
client.flushall(); // 3
var timeseries = require("./timeseries-" + dataType); // 4
var item1Purchases = new timeseries.TimeSeries(client, "purchases:item1"); // 5
var beginTimestamp = 0; // 6
item1Purchases.insert(beginTimestamp); // 7 
item1Purchases.insert(beginTimestamp + 1); // 8 
item1Purchases.insert(beginTimestamp + 1); // 9 
item1Purchases.insert(beginTimestamp + 3); // 10 
item1Purchases.insert(beginTimestamp + 61); // 11

function displayResults(granularityName, results) { // 12 
    console.log("Results from " + granularityName + ":"); 
    console.log("Timestamp \t| Value"); 
    console.log("--------------- | ------");
    for (var i = 0 ; i < results.length; i++) {
        console.log('\t' + results[i].timestamp + '\t| ' + results[i].value);
    }
    console.log();
}


item1Purchases.fetch("1sec", beginTimestamp, beginTimestamp + 4, displayResults); // 13
item1Purchases.fetch("1min", beginTimestamp, beginTimestamp + 120, displayResults); // 14
   
client.quit();