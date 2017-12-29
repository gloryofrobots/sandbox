import momoko
import tornado.gen
import query_library
from tornado.gen import Return


class DBMapper(object):

    def __init__(self, db, library):
        super(DBMapper, self).__init__()
        self.db = db
        self.queries = self._fetch_queries(library)

    def _return(result):
        raise Return(result)

    def _fetch_library(self, library):
        # return library.get(self.__class__.__name__)
        raise RuntimeError("Abstract method")

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


class Users(DBMapper):

    @tornado.gen.coroutine
    def get_user_by_credentials(self, username, password):
        query = self.queries.GET_USER_BY_CREDENTIALS_QUERY
        result = yield self.fetchone(query, (username, password))
        self._return(result)

    @tornado.gen.coroutine
    def get_users(self):
        query = self.queries.GET_USERS
        result = yield self.fetchone(query, [])
        self._return(result)

    def _fetch_queries(self, library):
        return library.Users


class DB(object):

    def __init__(self, connection, library):
        super(DBMapper, self).__init__()
        self.connection = connection
        self.Users = Users(connection, library)


def create_db(config, ioloop):
    if config.DB_TYPE != "postgresql":
        raise Exception("Only postgresql db supported!")

    library = query_library.get_library(config.DB_TYPE)
    db = momoko.Pool(
        dsn=config.DB_DSN,
        size=config.DB_POOL_SIZE,
        ioloop=ioloop,
    )
    return DB(db, library)
