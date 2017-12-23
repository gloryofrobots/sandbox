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
import message_schema


def validate_json_payload(fn):
    def wrapper(self, json_args, *args):
        self.validator.validate(json_args)
        return fn(self, json_args, *args)

    return wrapper


def parse_json_payload(fn):
    def wrapper(self, *args):
        if not self.request.headers["Content-Type"].startswith("application/json"):
            json_args = None
        else:
            json_args = json.loads(self.request.body)

        return fn(self, json_args, *args)

    return wrapper


def write_json_headers(fn):
    def wrapper(self, *args):
        self.set_header('Content-Type', 'application/json')
        return fn(self, *args)
    return wrapper


class RegisterHandler(tornado.web.RequestHandler):
    __SCHEMAS = [{
            "action": "REGISTER",
            "schema": {
                "password": {"type": "string", "blank": False},
                "username": {"type": "string", }
            }
        }
    ]

    def initialize(self, config):
        self.config = config
        self.validator = message_schema.create_validator(self.__SCHEMAS)

    def get_config(self):
        return self.settings["config"]

    def set_default_headers(self):
        config = self.get_config()
        self.set_header("Access-Control-Allow-Origin", config.CORS_DOMAINS)
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header("Access-Control-Allow-Headers",
                        "Origin, X-Requested-With, Content-Type, Accept");

    def options(self):
        # no body
        # self.set_status(200)
        # self.finish()
        pass

    def get_storage(self):
        db = self.settings["db"]
        return db

    def get_users_collection(self):
        return self.get_storage().users

    def get_json_payload(self):
        if not self.request.headers["Content-Type"].startswith("application/json"):
            return None

        return json.loads(self.request.body)

    def write_json(self, payload):
        json_str = json.dumps(payload)
        self.write(json_str)

    def respond_empty(self, action):
        self.respond(action, None)

    def respond_status(self, action, status):
        self.respond(action, dict(status=status))

    def respond_error(self, action, error):
        self.respond("ERROR", dict(action=action, error=error))

    def respond(self, action, data):
        if data == None:
            self.write_json(dict(action=action))
        else:
            self.write_json(dict(action=action, data=data))
        
    @parse_json_payload
    @validate_json_payload
    @write_json_headers
    @tornado.gen.coroutine
    def post(self, msg):
        users = self.get_users_collection()
        data = msg["data"]
        existed = yield users.find_one(dict(username=data["username"]))
        if existed is not None:
            self.respond_error("REGISTER", "User with given credentials has been already registered")
            
        else:
            users.insert_one(data)
            self.respond_empty("REGISTER_SUCCESS")
        self.finish()


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
        (r"/register", RegisterHandler, dict(config=config)),
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
