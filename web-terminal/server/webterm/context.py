
import webterm.db
import webterm.component
import webterm.security


class Context(object):
    def __init__(self, config, db, response_schema, auth):
        super(Context, self).__init__()
        self.config = config
        self.db = db
        self.response_schema = response_schema
        self.auth = auth


def create_context(components, config, ioloop):
    db = webterm.db.create_db(config, ioloop)

    auth = webterm.security.Auth(config.JWT_SECRET, config.JWT_ALGO, config.JWT_DURATION)

    schemas = webterm.component.component.ResponseSchemas()
    for (route, component) in components:
        if hasattr(component, "init_response_schema"):
            component.init_response_schema(route, schemas)
        else:
            logging.info("Component %s doesnt provide response schema", route)

        if hasattr(component, "init_database"):
            component.init_database(db)

    ctx = Context(config, db, schemas, auth)
    return ctx