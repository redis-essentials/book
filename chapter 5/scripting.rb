require 'redis'
@redis = Redis.new(:host => "127.0.0.1", :port => 6379)

lua_script = <<EOS
  local value = redis.call('GET', KEYS[1])
  value = tonumber(value)
  local newvalue = value * ARGV[1]
  redis.call('SET', KEYS[1], newvalue)
  return newvalue
EOS

@redis.set "script:my_value", 30
@redis.eval(lua_script, {
  :keys => ["script:my_value"],
  :argv => [3]
})
# => 90

@redis.set "script:my_value", 30
multiply_script_sha = @redis.script :load, lua_script
@redis.evalsha(multiply_script_sha, {
  :keys => ["script:my_value"],
  :argv => [3]
})
# => 90