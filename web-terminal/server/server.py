import sys
import logging
import tornado.options
import tornado.ioloop
import tornado.web
import sockjs.tornado

######################################################


def make_connection(*args, **kwargs):
    from webterm.controller import (basic, )
    import webterm.connection
    controllers = [
        basic.PingController()
    ]

    connection = webterm.connection.Connection(*args, **kwargs)
    for controller in controllers:
        connection.add_controller(controller)

    return connection


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
    router = sockjs.tornado.SockJSRouter(
        make_connection, '/entry', dict(config=config))

    application = tornado.web.Application(router.urls,
                                          debug=config.DEBUG,
                                          config=config
                                          )

    application.listen(config.PORT)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    import config
    main(config)
