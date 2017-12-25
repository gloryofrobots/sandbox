import json
import tornado.gen
import tornado.web
import security
import logging
import sockjs.tornado
import tornado.ioloop
import message_schema
import config

class MessageParseError(Exception):
    pass

class InvalidMessageSchemaError(Exception):
    pass

class UnsupportedActionError(Exception):
    pass

# must be used only on actions
def jwtauth(fn):
    def wrapper(self, token, msg, *args):
        cfg = config
        payload = security.decode_payload(
            token,
            cfg.JWT_SECRET,
            cfg.JWT_ALGO,
        )

        return fn (self, payload, msg, *args)
    return wrapper

class BaseConnection(sockjs.tornado.SockJSConnection):
    def __init__(self, *args, **kwargs):
        super(BaseConnection, self).__init__(*args, **kwargs)
        self.validator = None
        self.actions = {}
        self.loops = []
        
    def on_open(self, info):
        logging.info("SockJs open %s", str(info))
        self.validator = message_schema.create_sockjs_validator(self.get_schemas())
        self.actions = self.get_actions()
        self.loops = []
        self._on_open(info)
        
    def _on_open(self, info):
        pass

    def add_loop(self, cb, interval):
        # tornado.ioloop.IOLoop.current().spawn_callback(self.echo_loop)
        loop = tornado.ioloop.PeriodicCallback(cb, interval)
        loop.start()
        self.loops.append(loop)

    def remove_loop(self, loop):
        self.loops.remove(loop)
        loop.stop()

    def on_close(self):
        logging.debug("close connection loops:%d", len(self.loops)) 
        for loop in self.loops:
            loop.stop()
        self.loops = []
        self._on_close()

    def _on_close(self):
        pass

    def dispatch_message(self, message):
        method = None
        try:
            msg = json.loads(message)
        except Exception as e:
            raise MessageParseError(e.args, message)

        try:
            self.validator.validate(msg)
        except Exception as e:
            logging.error("VALIDATE ERROR:!! %s", type(e))
            raise InvalidMessageSchemaError(e.args, message)

        try:
            action = msg["action"]
            method = self.actions[action]
            method(msg["jwt"], msg["data"])
            logging.info("Action %s handled", action)
        except KeyError as e:
            raise UnsupportedActionError(e.args, action)
        
    def on_message(self, message):
        try:
            self.dispatch_message(message)
        except MessageParseError as e:
            logging.error("%s -- %s", "SOCKJS PARSE ERROR", str(e))
            self.respond_error("INVALID_FORMAT", message)
        except InvalidMessageSchemaError as e:
            logging.error("%s -- %s", "SOCKJS VALIDATE ERROR", str(e))
            self.respond_error("INVALID_SCHEMA", message)
        except UnsupportedActionError as e:
            self.respond_error("INVALID_ACTION", message)
            logging.error("%s -- %s", "SOCKJS DISPACTH ERROR", str(e))
        except security.SessionExpiredError as e:
            self.respond_error("ERROR", "SESSION_TERMINATED", message)
        except security.UnauthorizedAccessError as e:
            self.respond_error("ERROR", "UNAUTHORIZED_ACCESS", message)
        except Exception as e:
            self.respond_error("INVALID_ACTION", message)
            logging.error("%s -- %s", "SOCKJS DISPACTH ERROR", str(e))
            
    def send_json(self, data):
        msg = json.dumps(data)
        self.send(msg)

    def respond(self, action, data):
        if data == None:
            self.send_json(dict(action=action))
        else:
            self.send_json(dict(action=action, data=data))

    def respond_empty(self, action):
        self.respond(action, None)

    def respond_error(self, code, message):
        self.respond("ERROR", dict(code=code, msg=message))

    def terminate_session(self):
        self.respond_empty("SESSION_TERMINATED")


