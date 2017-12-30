class Postgresql:

    class Users:
        GET_USER_BY_CREDENTIALS = "SELECT * FROM USERS WHERE USERNAME = %s and PASSWORD = %s"
        GET_USERS = "SELECT * FROM USERS"


_LIBTYPES = dict(postgresql=Postgresql())


def get_library(dbtype):
    return _LIBTYPES[dbtype]
