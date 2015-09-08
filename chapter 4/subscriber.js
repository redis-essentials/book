var os = require("os"); // 1
var redis = require("redis");
var client = redis.createClient();

var COMMANDS = {}; // 2

COMMANDS.DATE = function() { // 3
  var now = new Date();
  console.log("DATE " + now.toISOString());
};

COMMANDS.PING = function() { // 4
  console.log("PONG");
};

COMMANDS.HOSTNAME = function() { // 5
  console.log("HOSTNAME " + os.hostname());
};

client.on("message", function(channel, commandName) { // 6
  if (COMMANDS.hasOwnProperty(commandName)) { // 7
    var commandFunction = COMMANDS[commandName]; // 8
    commandFunction(); // 9
  } else { // 10
    console.log("Unknown command: " + commandName);
  }
});
client.subscribe("global", process.argv[2]); // 11