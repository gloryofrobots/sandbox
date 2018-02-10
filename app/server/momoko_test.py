import momoko
from tornado.ioloop import IOLoop
ioloop = IOLoop.instance()
dsn = 'dbname=webterm user=gloryofrobots password=TOP_SECRET host=localhost port=5432'
conn = momoko.Connection(dsn=dsn)
future = conn.connect()
ioloop.add_future(future, lambda x: ioloop.stop())
ioloop.start()
future.result()  # raises exception on connection error

future = conn.execute("SELECT 1")
ioloop.add_future(future, lambda x: ioloop.stop())
ioloop.start()
cursor = future.result()
rows = cursor.fetchall()
print rows