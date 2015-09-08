<?php
require 'vendor/autoload.php';
Predis\Autoloader::register();
$client = new Predis\Client(array('host' => '127.0.0.1',
                                  'port' => 6379),
                            array('prefix' => 'php:'));

$client->lpush('blocking:queue', 'first');
$client->lpush('blocking:queue', 'second');

$client->blpop(['blocking:queue'], 0);
# array('php:blocking:queue', 'second')

$client->brpop(['blocking:queue'], 0);
# array('php:blocking:queue', 'first')

$client->rpush('blocking:source', 'message');
$client->brpoplpush('blocking:source', 'blocking:destination', 0);
# 'message'

?>