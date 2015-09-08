require 'redis'
@redis = Redis.new(:host => "127.0.0.1", :port => 6379)

@redis.rpush 'blocking:queue', 'first'
@redis.rpush 'blocking:queue', 'second'

@redis.blpop ['blocking:queue'], 0
# => ["blocking:queue", "first"]

@redis.brpop ['blocking:queue'], 0
# => ["blocking:queue", "second"]

@redis.lpush 'blocking:source', 'message'
@redis.brpoplpush 'blocking:source', 'blocking:destination', 0
# => "message"
