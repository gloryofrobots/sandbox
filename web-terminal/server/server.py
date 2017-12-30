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
        from webterm.component.basic import basic
        import webterm.connection
        controllers = [
            basic.create_controller("basic", config, db)
        ]

        connection = webterm.connection.Connection(*args, **kwargs)
        for controller in controllers:
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
