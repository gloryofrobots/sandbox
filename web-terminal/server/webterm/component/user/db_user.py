import webterm.db
import tornado.gen


class Mapper(webterm.db.db.Mapper):
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
        result = yield self.conn.fetchall(query, [])
        self._return(result)


class MapperPostgresql(Mapper):
    QUERY_GET_USER_BY_CREDENTIALS = "SELECT * FROM USERS WHERE USERNAME = %s and PASSWORD = %s"
    QUERY_GET_USERS = "SELECT * FROM USERS"


MAPPERS = {}
MAPPERS[webterm.db.TYPE.POSGTRESQL] = MapperPostgresql


def init_database(component_name, db):
    db.choose_mapper(component_name, MAPPERS)
