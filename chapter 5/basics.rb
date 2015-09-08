require 'redis'
@redis = Redis.new(:host => "127.0.0.1", :port => 6379)

@redis.set "string:my_key", "Hello World"
@redis.get "string:my_key"
# => "Hello World"
@redis.incr "string:counter"
@redis.mget ["string:my_key", "string:counter"]
# => ["Hello World", "1"]

@redis.rpush "list:my_list", ["item1", "item2"]
@redis.lpop "list:my_list"
# => "item1"

@redis.hset "set:redis_book", "title", "Redis Essentials"
@redis.hgetall "set:redis_book"
# => {"title"=>"Redis Essentials"}

@redis.sadd "set:users", ["alice", "bob"]
@redis.smembers "set:users"
# => ["bob", "alice"]

@redis.zadd "sorted_set:programmers", 1940, "Alan Kay"
@redis.zadd "sorted_set:programmers", 1912, "Alan Turing"
@redis.zrange "sorted_set:programmers", 0, -1, :withscores => true
# => [["Alan Turing", 1912.0], ["Alan Kay", 1940.0]]
