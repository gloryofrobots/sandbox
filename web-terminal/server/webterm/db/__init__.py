from .db import DB, DBConfigurationError
from webterm.db import postgresql 

class TYPE:
    POSGTRESQL = "postgresql"

DATABASES = {}
DATABASES[TYPE.POSGTRESQL] = postgresql

def create_db(config, ioloop):
    try:
        dbtype = DATABASES[config.DB_TYPE]
    except KeyError:
        raise DBConfigurationError("Unsupported database type %s" % config.DB_TYPE)
        
    
    conn = dbtype.create_connection(config, ioloop)
    return DB(config.DB_TYPE, conn)


# def init_database_from_module_globals(component_name, db, module):
#     mapper = None

#     try:
#         mapper = module["MAPPERS"][db.dbtype]
#     except KeyError:
#         raise ConfigurationError("Unsupported database type", db.dbtype)
#     except AttributeError:
#         raise ConfigurationError("You must define variable MAPPERS in your component database module ", db.dbtype)

#     db.add_mapper(component_name, mapper)