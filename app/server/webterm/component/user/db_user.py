import webterm.db
import tornado.gen


class Mapper(webterm.db.db.Mapper):
    QUERY_GET_USER_BY_CREDENTIALS = ""
    QUERY_GET_USER_BY_USERNAME = ""
    QUERY_GET_USER_BY_ID = ""
    QUERY_GET_USERS = ""
    QUERY_INSERT_USER = ""

    @tornado.gen.coroutine
    def insert_user(self, username, password):
        query = self.QUERY_INSERT_USER
        result = yield self.conn.execute(query, (username, password))
        self._return(result)

    @tornado.gen.coroutine
    def get_user_by_id(self, user_id):
        query = self.QUERY_GET_USER_BY_ID
        result = yield self.conn.fetchone(query, [user_id])
        self._return(result)

    @tornado.gen.coroutine
    def get_user_by_username(self, username):
        query = self.QUERY_GET_USER_BY_USERNAME
        result = yield self.conn.fetchone(query, [username])
        self._return(result)

    @tornado.gen.coroutine
    def get_user_by_credentials(self, username, password):
        query = self.QUERY_GET_USER_BY_CREDENTIALS
        result = yield self.conn.fetchone(query, (username, password))
        self._return(result)

    @tornado.gen.coroutine
    def get_users(self):
        query = self.QUERY_GET_USERS
        result = yield self.conn.fetchall(query, [])
        self._return(result)


class MapperPostgresql(Mapper):
    QUERY_GET_USER_BY_CREDENTIALS = "SELECT * FROM USERS WHERE USERNAME = %s and PASSWORD = %s"
    QUERY_GET_USER_BY_USERNAME = "SELECT * FROM USERS WHERE USERNAME = %s"
    QUERY_GET_USERS = "SELECT * FROM USERS"
    QUERY_GET_USER_BY_ID = "SELECT * FROM USERS WHERE id = %s"
    QUERY_INSERT_USER = "INSERT INTO USERS (username, password) values (%s, %s)"


MAPPERS = {}
MAPPERS[webterm.db.TYPE.POSGTRESQL] = MapperPostgresql


def init_database(component_name, db):
    db.choose_mapper(component_name, MAPPERS)
