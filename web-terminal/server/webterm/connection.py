import json
import tornado.gen
import tornado.web
from webterm import (security, input_schema)
import logging
import sockjs.tornado
import output_schema


class MessageParseError(Exception):
    pass


class InvalidMessageSchemaError(Exception):
    pass


class UnsupportedActionError(Exception):
    pass


class ControllerConflictError(Exception):
    pass


# must be used only on actions
def jwtauth(fn):
    def wrapper(self, token, msg, *args):
        # payload = security.decode_payload(
        #     token,
        #     cfg.JWT_SECRET,
        #     cfg.JWT_ALGO,
        # )
        pass
        # return fn(self, payload, msg, *args)
    return wrapper


class Response(object):

    def __init__(self, conn, message):
        super(Response, self).__init__()
        self.conn = conn
        self.sid = message.get("sid", None)
        self.rid = message.get("rid", None)
        self.token = message.get("token", None)
        logging.info("message %s %s", message, self.sid)

    def send(self, message):
        if self.sid is not None:
            message["sid"] = self.sid
        if self.token is not None:
            message["token"] = self.token
        if self.rid is not None:
            message["rid"] = self.rid

        self.conn.write_json(message)


class Connection(sockjs.tornado.SockJSConnection):

    def __init__(self, *args, **kwargs):
        super(Connection, self).__init__(*args, **kwargs)
        self.validator = None
        self.actions = {}
        self.loops = []
        self.actions = {}
        self.controllers = []

    def add_controller(self, controller):
        actions = controller.get_actions()
        for action in actions:
            if action in self.actions:
                raise ControllerConflictError(action)

            self.actions[action] = (controller, actions[action])

    def on_open(self, info):
        logging.info("SockJs open %s", str(info))
        self._on_open(info)

    def _on_open(self, info):
        pass

    def on_close(self):
        logging.debug("close connection loops:%d", len(self.loops))
        for controller in self.controllers:
            controller.close()

        self.controllers = []
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
            action = message["action"]
        except KeyError as e:
            logging.error("VALIDATE ERROR: NO ACTION !!")
            raise InvalidMessageSchemaError(e.args, action)

        try:
            controller, method = self.actions[action]
        except KeyError as e:
            raise UnsupportedActionError(e.args, action)

        controller.validate(message)
        return method

    def on_message(self, data):
        try:
            message = self.parse(data)
            method = self.dispatch_message(message)
            response = Response(self, message)
            method(response, message)
        except MessageParseError as e:
            logging.error("%s -- %s", "SOCKJS PARSE ERROR", str(e))
            self.write_error("INVALID_FORMAT", message)
        except input_schema.ValidationError as e:
            logging.error("%s -- %s", "SOCKJS VALIDATE ERROR", str(e))
            self.write_error("INVALID_SCHEMA", message)
        except UnsupportedActionError as e:
            self.write_error("INVALID_ACTION", message)
            logging.error("%s -- %s", "SOCKJS DISPACTH ERROR", str(e))
        except security.SessionExpiredError as e:
            self.write_error("SESSION_TERMINATED", message)
        except security.UnauthorizedAccessError as e:
            self.write_error("UNAUTHORIZED_ACCESS", message)
        # except Exception as e:
        #     self.write_error("INVALID_ACTION", message)
        #     logging.error("%s -- %s", "RUNTIME ERROR", str(e))

    def write_error(self, error_type, message):
        self.write_json(output_schema.Schema.Error(error_type, message))

    def write_json(self, data):
        msg = json.dumps(data)
        self.send(msg)
