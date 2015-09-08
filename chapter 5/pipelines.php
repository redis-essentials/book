<?php
require 'vendor/autoload.php';
Predis\Autoloader::register();
$client = new Predis\Client(array('host' => '127.0.0.1',
                                  'port' => 6379),
                            array('prefix' => 'php:'));
# fluent interface
$client->pipeline()
       ->sadd("cards:suits", 'hearts')
       ->sadd("cards:suits", 'spades')
       ->sadd("cards:suits", 'diamonds')
       ->sadd("cards:suits", 'clubs')
       ->smembers("cards:suits")
       ->execute();
# array(1,1,1,1, array('diamonds', 'hearts', 'clubs', 'spades'))

# anonymous function
$client->pipeline(function ($pipe) {
    $pipe->scard("cards:suits");
    $pipe->smembers("cards:suits");
});
# array(4, array('diamonds', 'hearts', 'clubs', 'spades'))

?>