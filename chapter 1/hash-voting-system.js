var redis = require("redis"); // 1
var client = redis.createClient(); // 2

function saveLink(id, author, title, link) { // 3
	client.hmset("link:" + id, "author", author, "title", title, "link", link, "score", 0); // 4
}

function upVote(id) { // 1 
	client.hincrby("link:" + id, "score", 1); // 2
}

function downVote(id) { //3 
	client.hincrby("link:" + id, "score", -1); // 4
}

function showDetails(id) { // 1
	client.hgetall("link:" + id, function(err, replies) { // 2
		console.log("Title:", replies['title']); // 3 
		console.log("Author:", replies['author']); // 3 
		console.log("Link:", replies['link']); // 3 
		console.log("Score:", replies['score']); // 3 
		console.log("--------------------------");
	}); 
}

saveLink(123, "dayvson", "Maxwell Dayvson's Github page", "https://github.com/dayvson");
upVote(123);
upVote(123);
saveLink(456, "hltbra", "Hugo Tavares's Github page", "https://github.com/hltbra");
upVote(456);
upVote(456);
downVote(456);
showDetails(123);
showDetails(456);
client.quit();