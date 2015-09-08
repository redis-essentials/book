var redis = require("redis");
var client = redis.createClient();

function LeaderBoard(key) { // 1 
    this.key = key; // 2
}

LeaderBoard.prototype.addUser = function(username, score) { // 1 
    client.zadd([this.key, score, username], function(err, replies) { // 2
        console.log("User", username,"added to the leaderboard!"); // 3 
    });
};

LeaderBoard.prototype.removeUser = function(username) { // 1 
    client.zrem(this.key, username, function(err, replies) { // 2
        console.log("User", username, "removed successfully!"); // 3 
    });
};

LeaderBoard.prototype.getUserScoreAndRank = function(username) { // 1 
    var leaderboardKey = this.key; // 2
    client.zscore(leaderboardKey, username, function(err, zscoreReply) { // 3
        client.zrevrank(leaderboardKey, username, function( err, zrevrankReply) { // 4
            console.log("\nDetails of " + username + ":"); 
            console.log("Score:", zscoreReply + ", Rank: #" + (zrevrankReply + 1)); // 5 
        });
    }); 
};

LeaderBoard.prototype.showTopUsers = function(quantity) { // 1 
    client.zrevrange([this.key, 0, quantity - 1, "WITHSCORES"], function(err, reply) { // 2
        console.log("\nTop", quantity, "users:");
        for (var i = 0, rank = 1 ; i < reply.length ; i += 2, rank++) {// 3 
            console.log("#" + rank, "User: " + reply[i] + ", score:", reply[i + 1]); 
        }
    }); 
};


LeaderBoard.prototype.getUsersAroundUser = function(username, quantity, callback) { // 1
    var leaderboardKey = this.key; // 2
    client.zrevrank(leaderboardKey, username, function(err, zrevrankReply) { // 3
        var startOffset = Math.floor(zrevrankReply - (quantity / 2) + 1); // 4
        if (startOffset < 0) { // 5
            startOffset = 0;
        }
        var endOffset = startOffset + quantity - 1; // 6
        client.zrevrange([leaderboardKey, startOffset, endOffset, "WITHSCORES"], function(err, zrevrangeReply) { // 7
            var users = []; // 8
            for (var i = 0, rank = 1 ; i < zrevrangeReply.length ; i += 2, rank++) { // 9 
                var user = {
                    rank: startOffset + rank,
                    score: zrevrangeReply[i + 1],
                    username: zrevrangeReply[i],
                }; // 10
                users.push(user); // 11 
            }
            callback(users); // 12
        }); 
    });
};

var leaderBoard = new LeaderBoard("game-score");
leaderBoard.addUser("Arthur", 70);
leaderBoard.addUser("KC", 20);
leaderBoard.addUser("Maxwell", 10);
leaderBoard.addUser("Patrik", 30);
leaderBoard.addUser("Ana", 60);
leaderBoard.addUser("Felipe", 40);
leaderBoard.addUser("Renata", 50);
leaderBoard.addUser("Hugo", 80);
leaderBoard.removeUser("Arthur");
leaderBoard.getUserScoreAndRank("Maxwell");
leaderBoard.showTopUsers(3);
leaderBoard.getUsersAroundUser("Felipe", 5, function(users) { // 1 
    console.log("\nUsers around Felipe:"); 
    users.forEach(function(user) {
        console.log("#" + user.rank, "User:", user.username + ", score:", user.score);
    });
    client.quit(); // 2 
});