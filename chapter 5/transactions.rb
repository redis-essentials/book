require 'redis'
@redis = Redis.new(:host => "127.0.0.1", :port => 6379)

@redis.multi do |multi|
  multi.set "transaction:key", "A string in a transactional block"
  multi.incr "transaction:counter"
end

@redis.get "transaction:key"
# => "A string in a transactional block"