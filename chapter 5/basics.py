import redis
client = redis.StrictRedis(host='localhost', port=6379)

client.set("string:my_key", "Hello World")
client.get("string:my_key")
# "Hello World"
client.incr("string:counter")
client.mget(["string:my_key", "string:counter"])
# ['Hello World', '2']

client.rpush("list:my_list", "item1", "item2")
client.lpop("list:my_list")
# 'item1'

client.hset("set:redis_book", "title", "Redis Essentials")
client.hgetall("set:redis_book")
# {'title': 'Redis Essentials'}

client.sadd("set:users", "alice", "bob")
client.smembers("set:users")
# set(['bob', 'alice'])

client.zadd("sorted_set:programmers", 1940, "Alan Kay")
client.zadd("sorted_set:programmers", 1912, "Alan Turing")
client.zrange("sorted_set:programmers", 0, -1, withscores=True)
# [('Alan Turing', 1912.0), ('Alan Kay', 1940.0)]
