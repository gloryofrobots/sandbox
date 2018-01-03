import momoko
import tornado.gen
from webterm.db import db

class DBConnectionPG(db.DBConnection):
    def __init__(self, conn):
        super(DBConnectionPG, self).__init__()
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
        return self.db.execute(query, args)


def create_connection(config, ioloop):
    if config.DB_TYPE != "postgresql":
        raise Exception("Only postgresql db supported!")

    pool = momoko.Pool(
        dsn=config.DB_DSN,
        size=config.DB_POOL_SIZE,
        ioloop=ioloop,
    )
    connection = DBConnectionPG(pool)
    return connection