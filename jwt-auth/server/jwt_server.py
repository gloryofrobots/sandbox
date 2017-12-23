import sys
import logging
import tornado.options
import tornado.ioloop
import tornado.web
import tornado.gen
import motor.motor_tornado

import register


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

    app = tornado.web.Application([
        (r"/register", register.RegisterHandler, dict(config=config)),
    ],
        debug=config.DEBUG,
        db=db,
        config=config
    )

    app.listen(config.PORT)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    import config
    main(config)
