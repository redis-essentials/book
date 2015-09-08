import redis
client = redis.StrictRedis(host='localhost', port=6379)

client.lpush('blocking:queue', 'first')
client.lpush('blocking:queue', 'second')

client.blpop(['blocking:queue'], 0)
# ('blocking:queue', 'first')

client.brpop(['blocking:queue'], 0)
# ('blocking:queue', 'second')

client.rpush('blocking:source', 'message')
client.brpoplpush('blocking:source', 'blocking:destination', 0)
# 'message'
