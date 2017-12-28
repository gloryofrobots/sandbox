import sys
import logging
import tornado.options
import tornado.ioloop
import tornado.web
import tornado.gen

import register
import entry
import sockjs.tornado

def create_connection(*args, **kwargs):
    return entry.Connection(*args, **kwargs)
    

def main(config):
    # initialize file logging
    if config.DEBUG:
        tornado.options.options['logging'] = "debug"

    if config.LOG_FILE is not None:
        tornado.options.options['log_file_prefix'] = config.LOG_FILE
        tornado.options.parse_command_line()

    router = sockjs.tornado.SockJSRouter(entry.Connection, '/entry', dict(config=config))
    # router = sockjs.tornado.SockJSRouter(create_connection, '/entry', dict(config=config))
    app = tornado.web.Application(router.urls,
        debug=config.DEBUG,
        config=config
    )

    app.listen(config.PORT)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    import config
    main(config)
