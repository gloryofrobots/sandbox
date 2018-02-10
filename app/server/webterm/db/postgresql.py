import momoko
import tornado.gen
from webterm.db import db
import logging
import psycopg2
class Connection(db.Connection):
    def __init__(self, conn):
        super(Connection, self).__init__()
        self.conn = conn

    @tornado.gen.coroutine
    def fetchall(self, query, args):
        cursor = yield self._execute(query, args)

        rows = cursor.fetchall()
        self._return(rows)

    @tornado.gen.coroutine
    def fetchone(self, query, args):
        cursor = yield self._execute(query, args)

        result = cursor.fetchone()
        self._return(result)

    @tornado.gen.coroutine
    def execute(self, query, args):
        result = yield self._execute(query, args)
        self._return(result)

    def _execute(self, query, args):
        logging.info("EXECUTING %s %s", query, args)

        return self.conn.execute(query, args)


def create_connection(config, ioloop):
    pool = momoko.Pool(
        dsn=config.DB_DSN,
        size=config.DB_POOL_SIZE,
        ioloop=ioloop,
        cursor_factory=psycopg2.extras.DictCursor,
    )
    future = pool.connect()
    ioloop.add_future(future, lambda f: ioloop.stop())
    ioloop.start()
    future.result()  # raises exception on connection error
    connection = Connection(pool)
    return connection