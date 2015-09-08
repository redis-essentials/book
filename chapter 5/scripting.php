<?php
require 'vendor/autoload.php';
Predis\Autoloader::register();
$client = new Predis\Client(array('host' => '127.0.0.1',
                                  'port' => 6379),
                            array('prefix' => 'php:'));

class MultiplyValue extends Predis\Command\ScriptCommand {
    public function getKeysCount() {
      return 1;
    }

    public function getScript() {
        $lua = <<<LUASCRIPT
            local value = redis.call('GET', KEYS[1])
            value = tonumber(value)
            local newvalue = value * ARGV[1]
            redis.call('SET', KEYS[1], newvalue)
            return newvalue
LUASCRIPT;
        return $lua;
     }
}

$client->getProfile()->defineCommand('multiply', 'MultiplyValue');
$client->set("mynumber", 4);
$client->multiply("mynumber", 2);
#8

?>