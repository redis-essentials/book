import redis
client = redis.StrictRedis(host='localhost', port=6379)

with client.pipeline(transaction=True) as transaction:
   transaction.set('transaction:key', 'A string in a transactional block')
   transaction.incr('transaction:counter')
   transaction.get('transaction:key')
   result = transaction.execute()
   # [True, 2, 'A string in a transactional block']
