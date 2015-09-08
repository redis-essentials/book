import redis
client = redis.StrictRedis(host='localhost', port=6379)

lua_script = """
   local value = redis.call('GET', KEYS[1])
   value = tonumber(value)
   local newvalue = value * ARGV[1]
   redis.call('SET', KEYS[1], newvalue)
   return newvalue
"""

client.set('python:value', 30)
client.eval(lua_script, 1, "python:value", 3)
# 90

client.set('python:value', 30)
sha = client.script_load(lua_script)
client.evalsha(sha, 1, 'python:value', 3)
# 90

client.set('python:value', 30)
multiply = client.register_script(lua_script)
multiply(keys=['python:value'], args=[3])
# 90
