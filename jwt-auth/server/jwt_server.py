import sys
import logging
import tornado.options
import tornado.ioloop
import tornado.web
import tornado.gen
import motor.motor_tornado

import register
import auth
import echo
import sockjs.tornado


def main(config):
    # initialize file logging
    if config.DEBUG:
        tornado.options.options['logging'] = "debug"

    if config.LOG_FILE is not None:
        tornado.options.options['log_file_prefix'] = config.LOG_FILE
        tornado.options.parse_command_line()

    client = motor.motor_tornado.MotorClient(config.MONGODB_HOST)
    client.drop_database("jwtauth")
    db = client.jwtauth
    users = db.users

    echo_router = sockjs.tornado.SockJSRouter(echo.TimeEchoConnection, '/time_echo')

    routes = [
        (r"/register", register.RegisterHandler),
        (r"/auth", auth.AuthHandler),
        (r"/echo", echo.EchoHandler),
    ]

    routes += echo_router.urls

    app = tornado.web.Application(routes,
        debug=config.DEBUG,
        db=db,
        config=config
    )

    app.listen(config.PORT)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    import config
    main(config)
