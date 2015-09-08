import redis # 1
import ssl # 2

pool = redis.ConnectionPool(
    connection_class=redis.SSLConnection,
    host='0.0.0.0',
    port=6666,
    ssl_ca_certs='private.pem',
    ssl_cert_reqs=ssl.CERT_REQUIRED) # 3
r = redis.StrictRedis(connection_pool=pool) # 4

print(r.ping()) # 5
