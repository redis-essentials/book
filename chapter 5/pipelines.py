import redis
client = redis.StrictRedis(host='localhost', port=6379)

pipeline = client.pipeline(transaction=False)
pipeline.sadd("cards:suit", "hearts")
pipeline.sadd("cards:suit", "spades")
pipeline.sadd("cards:suit", "diamonds")
pipeline.sadd("cards:suit", "clubs")
pipeline.smembers("cards:suit")
result = pipeline.execute()
# [0, 0, 0, 0, set(['hearts', 'clubs', 'spades', 'diamonds'])]

with client.pipeline() as pipe:
    pipe.scard("cards:suit")
    result = pipe.execute()
    # [4]
