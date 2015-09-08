require 'redis'
@redis = Redis.new(:host => "127.0.0.1", :port => 6379)

result = @redis.pipelined do
  @redis.sadd "cards:suits", "hearts"
  @redis.sadd "cards:suits", "spades"
  @redis.sadd "cards:suits", "diamonds"
  @redis.sadd "cards:suits", "clubs"
  @redis.smembers "cards:suits"
end
# => [false, false, false, false, ["diamonds", "spades", "clubs", "hearts"]]



require 'redis'
@redis = Redis.new(:host => "127.0.0.1", :port => 6379)

@redis.pipelined do
  @redis.set "message", "hello world"
  @message = @redis.get "message"
end

@message.value
# => "hello world"