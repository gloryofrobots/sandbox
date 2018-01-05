
import webterm.db
import webterm.component
import webterm.security
import zmq.eventloop.future 
import zmq.eventloop.ioloop
zmq.eventloop.ioloop.install()

class Context(object):
    def __init__(self, config, db, response_schema, auth, zmq_context):
        super(Context, self).__init__()
        self.config = config
        self.db = db
        self.response_schema = response_schema
        self.auth = auth
        self.zmq_context = zmq_context

    def destroy(self):
        self.zmq_context.term()


def create_context(components, config, ioloop):
    db = webterm.db.create_db(config, ioloop)

    auth = webterm.security.Auth(config.JWT_SECRET, config.JWT_ALGO, config.JWT_DURATION)

    zmq_context = zmq.eventloop.future.Context.instance()

    schemas = webterm.component.component.ResponseSchemas()

    for (route, component) in components:
        if hasattr(component, "init_response_schema"):
            component.init_response_schema(route, schemas)
        else:
            logging.info("Component %s doesnt provide response schema", route)

        if hasattr(component, "init_database"):
            component.init_database(db)

    ctx = Context(config, db, schemas, auth, zmq_context)
    return ctx