import json
import tornado.gen
import tornado.web
import security
import input_schema
import logging
import sockjs.tornado
import tornado.ioloop
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


class Response(object):
    def __init__(self, conn, message):
        super(Response, self).__init__()
        self.conn = connection
        self.sid = message.get("sid", None)
        self.rid = message.get("rid", None)
        self.token = message.get("token", None)

    def respond(self, message):
        if self.sid:
            message["sid"] = self.sid
        if self.token:
            message["token"] = self.token
        if self.rid:
            message["rid"] = self.rid
            
        self.conn.send_json(message)
    

class BaseConnection(sockjs.tornado.SockJSConnection):
    def __init__(self, *args, **kwargs):
        super(BaseConnection, self).__init__(*args, **kwargs)
        self.validator = None
        self.actions = {}
        self.loops = []
        self.actions = {}
        self.protocols = []

    def add_protocol(protocol):
        actions = protocol.get_actions()
        for action in actions:
            if action in self.actions:
                raise ProtocolConflictError(action)
                self.actions[action] = (protocol, actions[action])

    def on_open(self, info):
        logging.info("SockJs open %s", str(info))
        self._on_open(info)
        
    def _on_open(self, info):
        pass

    def on_close(self):
        logging.debug("close connection loops:%d", len(self.loops)) 
        for protocol in self.protocols:
            protocol.close()

        self.protocols = []
        self._on_close()

    def _on_close(self):
        pass

    def parse(self, message):
        try:
            msg = json.loads(message)
        except Exception as e:
            raise MessageParseError(e.args, message)
        return msg
        
    def dispatch_message(self, message):
        try:
            action = msg["action"]
        except KeyError as e:
            logging.error("VALIDATE ERROR: NO ACTION !!")
            raise InvalidMessageSchemaError(e.args, action)

        try:
            protocol, method = self.actions[action]
        except KeyError as e:
            raise UnsupportedActionError(e.args, action)
        
        protocol.validate(msg)
        return method,msg

    def on_message(self, data):
        try:
            message = self.parse_message(data)
            method = self.dispatch_message(message)
            response = Response(self, message)
            method(response, message)
        except MessageParseError as e:
            logging.error("%s -- %s", "SOCKJS PARSE ERROR", str(e))
            self.respond_error("INVALID_FORMAT", message)
        except input_schema.ValidationError as e:
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
            logging.error("%s -- %s", "RUNTIME ERROR", str(e))
            
    def write_json(self, data):
        msg = json.dumps(data)
        self.send(msg)
