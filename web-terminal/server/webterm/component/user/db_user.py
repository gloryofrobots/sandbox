from webterm.db import db

class Mapper(db.DBMapper):
    QUERY_GET_USER_BY_CREDENTIALS = ""
    QUERY_GET_USERS = ""

    @tornado.gen.coroutine
    def get_user_by_credentials(self, username, password):
        query = self.QUERY_GET_USER_BY_CREDENTIALS
        result = yield self.conn.fetchone(query, (username, password))
        self._return(result)

    @tornado.gen.coroutine
    def get_users(self):
        query = self.QUERY_GET_USERS
        result = yield self.conn.fetchone(query, [])
        self._return(result)

class MapperPG(Mapper):
    QUERY_GET_USER_BY_CREDENTIALS = "SELECT * FROM USERS WHERE USERNAME = %s and PASSWORD = %s"
    QUERY_GET_USERS = "SELECT * FROM USERS"


def init_database(component_name, db):
    db.add_mapper(component_name, Mapper)
