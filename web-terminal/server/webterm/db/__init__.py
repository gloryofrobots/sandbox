from .db import DB

def create_db(config, ioloop):
    if config.DB_TYPE != "postgresql":
        raise Exception("Only postgresql db supported!")

    import webterm.db.postgresql as db_impl
    import webterm.db
    conn = db_impl.create_connection(config, ioloop)
    return webterm.db.DB(conn)