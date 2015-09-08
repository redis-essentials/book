<?php
require 'vendor/autoload.php';
Predis\Autoloader::register();
$client = new Predis\Client(array('host' => '127.0.0.1',
'port' => 6379), array('prefix' =>'php:'));

$client->set("string:my_key", "Hello World");
$client->get("string:my_key");
# "Hello World"
$client->incr("string:counter");
$client->mget(array("string:my_key", "string:counter"));
# array('Hello World', '2')

$client->rpush("list:my_list", "item1", "item2");
$client->lpop("list:my_list");
# 'item1'

$client->hset("set:redis_book", "title", "Redis Essentials");
$client->hgetall("set:redis_book");
# array('title' => 'Redis Essentials')

$client->sadd("set:users", "alice", "bob");
$client->smembers("set:users");
# array('bob', 'alice')

$client->zadd("sorted_set:programmers", 1940, "Alan Kay");
$client->zadd("sorted_set:programmers", 1912, "Alan Turing");
$client->zrange("sorted_set:programmers", 0, -1, "withscores");
# array('Alan Turing' => 1912, 'Alan Kay' => 1940)

?>