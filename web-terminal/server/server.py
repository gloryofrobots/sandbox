import sys
import logging
import tornado.options
import tornado.ioloop
import tornado.web
import sockjs.tornado
import webterm.db

######################################################


def make_connection(config, db):
    def _constructor(*args, **kwargs):
        import webterm.connection
        from webterm.component import component

        from webterm.component.error import error

        from webterm.component.user import user
        from webterm.component.basic import basic

        schemas = component.ResponseSchemaCollection()

        error.init_component("ERROR", config, schemas, db)

        components = [("BASIC", basic), ("USER", user)]
        for (route, component) in components:
            component.init_component(route, config, schemas, db)

        response_schema = schemas.pack()

        connection = webterm.connection.Connection(
            response_schema, *args, **kwargs)

        for (route, component) in components:
            controller = component.create_controller(
                route, config, response_schema, db)

            connection.add_controller(controller)

        return connection
    return _constructor

######################################################
######################################################
######################################################


def main(config):
    # initialize file logging
    if config.DEBUG:
        tornado.options.options['logging'] = "debug"

    if config.LOG_FILE is not None:
        tornado.options.options['log_file_prefix'] = config.LOG_FILE
        # this will enable logging options
        tornado.options.parse_command_line()
    # print protocol.base.PingProtocol
    db = webterm.db.create_db(config, tornado.ioloop.IOLoop.current())
    make_connection(config, db)
    router = sockjs.tornado.SockJSRouter(
        make_connection(config, db), '/entry')

    application = tornado.web.Application(router.urls,
                                          debug=config.DEBUG,
                                          config=config,
                                          db=db
                                          )

    application.listen(config.PORT)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    import config
    main(config)
