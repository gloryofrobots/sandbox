import json
import logging
import message_schema
import tornado.web
import tornado.gen
import security


def jwtauth(fn):
    def wrapper(self, *args):
        auth = self.request.headers.get('Authorization')
        payload = None
        if auth:
            parts = auth.split()

            if parts[0].lower() != 'bearer' or len(parts) != 2:
                self.write_unauthorized("invalid authorization header")
                raise tornado.web.Finish()

            token = parts[1]
            try:
                cfg = self.get_config()
                payload = security.decode_payload(
                    token,
                    cfg.JWT_SECRET,
                    cfg.JWT_ALGO,
                )

            except security.SessionExpiredError as e:
                self.terminate_session()
                raise tornado.web.Finish()
            except Exception as e:
                self.write_unauthorized(e.message)
                raise tornado.web.Finish()
        else:
            self.write_unauthorized("Missing authorization")
            raise tornado.web.Finish()

        return fn (self, payload, *args)
    return wrapper


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


class BaseHandler(tornado.web.RequestHandler):
    def get_schemas(self):
        return []

    def initialize(self):
        self.validator = message_schema.create_validator(self.get_schemas())

    def get_config(self):
        return self.settings["config"]

    def set_default_headers(self):
        config = self.get_config()
        self.set_header("Access-Control-Allow-Origin", config.CORS_DOMAINS)
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header("Access-Control-Allow-Headers",
                        "Authorization, Origin, X-Requested-With, Content-Type, Accept");

    def write_unauthorized(message):
        self.set_status(401)
        self.write(message)

    def options(self):
        # no body
        self.set_status(204)
        self.finish()

    def get_storage(self):
        db = self.settings["db"]
        return db

    def get_users_collection(self):
        return self.get_storage().users

    def write_json(self, payload):
        json_str = json.dumps(payload)
        self.write(json_str)

    def respond_empty(self, action):
        self.respond(action, None)

    def respond_status(self, action, status):
        self.respond(action, dict(status=status))

    def respond_error(self, action, error):
        self.respond("ERROR", dict(action=action, error=error))

    def terminate_session(self):
        self.respond_empty("SESSION_TERMINATED")

    def respond(self, action, data):
        if data == None:
            self.write_json(dict(action=action))
        else:
            self.write_json(dict(action=action, data=data))
        