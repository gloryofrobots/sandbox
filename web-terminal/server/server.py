import sys
import logging
import tornado.options
import tornado.ioloop
import tornado.web
import sockjs.tornado
import webterm.db
import webterm.connection
import webterm.component

from webterm.component.error import error


######################################################
def init_components(components, config):
    db = webterm.db.create_db(config, tornado.ioloop.IOLoop.current())
    schemas = webterm.component.component.ResponseSchemaCollection()

    error.init_component("ERROR", config, schemas, db)
    for (route, component) in components:
        component.init_component(route, config, schemas, db)

    response_schema = schemas.pack()

    return db, response_schema

def make_connection(components, config, db, response_schema):
    def _constructor(*args, **kwargs):

        connection = webterm.connection.Connection(
            response_schema, *args, **kwargs)

        for (route, component) in components:
            controller = component.create_controller(
                route, config, response_schema, db)

            connection.add_controller(controller)

        return connection
    return _constructor

import tornado.gen
@tornado.gen.coroutine
def test_db(db):
    users = yield db.get_mapper("user").get_users()
    print users
######################################################
######################################################
######################################################

def main(config):
    from webterm.component.user import user
    from webterm.component.basic import basic
    components = [("BASIC", basic), ("USER", user)]

    # initialize file logging
    if config.DEBUG:
        tornado.options.options['logging'] = "debug"

    if config.LOG_FILE is not None:
        tornado.options.options['log_file_prefix'] = config.LOG_FILE
        # this will enable logging options
        tornado.options.parse_command_line()
    # print protocol.base.PingProtocol

    db, response_schema = init_components(components, config)

    tornado.ioloop.IOLoop.current().spawn_callback(test_db, db)

    router = sockjs.tornado.SockJSRouter(
        make_connection(components, config, db, response_schema), '/entry')

    application = tornado.web.Application(router.urls,
                                          debug=config.DEBUG,
                                          config=config,
                                          db=db)

    application.listen(config.PORT)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    import config
    main(config)

