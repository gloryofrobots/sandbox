import json
import tornado.gen
import tornado.web
from webterm import (security, request_schema)
import logging
import sockjs.tornado
import response_protocol
import webterm.component.component


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
        self.controllers = {}

    def add_controller(self, controller):
        if controller.route in self.controllers:
            raise ControllerConflictError(controller.route)

        self.controllers[controller.route] = controller

    def on_open(self, info):
        logging.info("SockJs open %s", str(info))
        self._on_open(info)

    def _on_open(self, info):
        pass

    def on_close(self):
        logging.debug("close connection loops:%d", len(self.loops))
        for controller in self.controllers.values():
            controller.close()

        self.controllers = {}
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

    def split_action(self, action):
        parts = action.split("/")
        if len(parts) < 2:
            raise MessageParseError("Invalid route format")
        controller = parts[0]
        controller_action = "/".join(parts[1:])
        return controller, controller_action

    @tornado.get.coroutine
    def on_message(self, data):
        try:
            message = self.parse(data)
        except MessageParseError as e:
            logging.error("%s -- %s", "SOCKJS PARSE ERROR", str(e))
            self.write_error("INVALID_FORMAT", message)

        try:
            action = message["action"]
        except KeyError as e:
            logging.error("VALIDATE ERROR: NO ACTION !!")
            self.write_error("INVALID_SCHEMA", message)

        try:
            controller_name, controller_action = self.split_action(action)
        except MessageParseError as e:
            logging.error("VALIDATE ERROR:  INVALID ROUTE !!")
            self.write_error("INVALID_SCHEMA", message)

        try:
            controller = self.controllers[controller_name]
        except KeyError as e:
            logging.error("UNKNOWN CONTROLLER", controller_name)
            self.write_error("INVALID_ROUTE", message)

        response = Response(self, message)

        try:
            yield controller.dispatch(controller_action, response, message)
        except security.SessionExpiredError as e:
            self.write_error("SESSION_TERMINATED", message)
        except security.UnauthorizedAccessError as e:
            self.write_error("UNAUTHORIZED_ACCESS", message)
        except webterm.component.component.InvalidActionError as e:
            self.write_error("INVALID_ACTION", message)
        # except Exception as e:
        #     self.write_error("Server Error", message)
        #     logging.error("%s -- %s", "RUNTIME ERROR", str(e))

    def write_error(self, error_type, message):
        self.write_json(response_protocol.Protocol().Error(error_type, message))

    def write_json(self, data):
        msg = json.dumps(data)
        self.send(msg)
