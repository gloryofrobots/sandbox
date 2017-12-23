import sys
import json
import hashlib
import concurrent.futures
import bson.binary
import copy
import logging
import tornado.options 
import tornado.ioloop
import tornado.web
import tornado.gen
import motor.motor_tornado

def parse_json_payload(fn):
    def wrapper(self, *args):
        if not self.request.headers["Content-Type"].startswith("application/json"):
            json_args = None
        else:
            json_args = json.loads(self.request.body)

        return fn(self, json_args, *args)

    return wrapper


class RegisterHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print "setting headers!!!"
        self.set_header("Access-Control-Allow-Origin", "*")
        # self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    def options(self):
        # no body
        # self.set_status(200)
        # self.finish()
        pass

    def get_storage(self):
        db = self.settings["db"]
        return db

    def get_users_collection():
        return get_storage().users
    
    def initialize(self, config):
        self.config = config

    def get_json_payload():
        if not self.request.headers["Content-Type"].startswith("application/json"):
            return None

        return json.loads(self.request.body)

    @parse_json_payload
    @tornado.gen.coroutine
    def post(self, json_args):
        self.set_header("Content-Type", "text/plain")
        self.write("ECHO -- %s" % str(json_args))
        # username = self.get_body_argument("username")
        # email = self.get_body_argument("email")
        # password = self.get_body_argument("password")
        
        # self.write("You wrote %s %s %s" % (username, email, password))


def main(config):
    # initialize file logging
    if config.DEBUG:
        tornado.options.options['logging'] = "debug"

    if config.LOG_FILE is not None:
        tornado.options.options['log_file_prefix'] = config.LOG_FILE
        tornado.options.parse_command_line()

    client = motor.motor_tornado.MotorClient(config.MONGODB_HOST)
    # client.drop_database("identicons")
    db = client.jwtauth

    app = tornado.web.Application([
        (r"/register", RegisterHandler, dict(config=config)),
    ],
        debug=config.DEBUG,
        db=db)
    
    app.listen(config.PORT)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    import config
    main(config)
