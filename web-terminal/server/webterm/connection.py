import json
import tornado.gen
import tornado.web
import webterm.security
import webterm.component.request_schema
import logging
import sockjs.tornado
from webterm.component import component
import traceback


class MessageParseError(Exception):
    pass


class MessageProcessError(Exception):

    def __init__(self, error_type, exception=None):
        super(MessageProcessError, self).__init__(error_type, exception)
        self.error_type = error_type
        self.exception = exception


class InvalidMessageSchemaError(Exception):
    pass


class UnsupportedActionError(Exception):
    pass


class ControllerConflictError(Exception):
    pass


def split_route(action):
    parts = action.split("/")
    if len(parts) < 2:
        raise MessageParseError("Invalid route format")
    root = parts[0]
    action = "/".join(parts[1:])
    return root, action


class Request(object):

    def __init__(self, conn, message):
        super(Request, self).__init__()
        self.conn = conn
        self.message = message
        self.data = message.get("data", {})
        self.route = message.get("route")
        self.root, self.action = split_route(self.route)

        self.sid = message.get("sid", None)
        self.rid = message.get("rid", None)
        self.token = message.get("token", None)
        self.auth_data = None

    def reply(self, message):
        if self.sid is not None:
            message["sid"] = self.sid
        if self.token is not None:
            message["token"] = self.token
        if self.rid is not None:
            message["rid"] = self.rid

        self.conn.write_json(message)

    def set_auth_data(data):
        self.auth_data = data

    def __repr__(self):
        return "<Request %s %s>" % (self.route, self.message)

    def __str__(self):
        return self.__repr__()



class Connection(sockjs.tornado.SockJSConnection):

    def __init__(self, *args, **kwargs):
        super(Connection, self).__init__(*args, **kwargs)
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

    @tornado.gen.coroutine
    def _on_message(self, data):
        logging.info("MESSAGE RECEIVED 2 %s", data)
        try:
            message = self.parse(data)
            request = Request(self, message)
        except MessageParseError as e:
            raise MessageProcessError("INVALID_SCHEMA", e)

        try:
            controller = self.controllers[request.root]
            controller.validate(request)
        except KeyError as e:
            raise MessageProcessError("INVALID_ROUTE", e)
        except webterm.component.request_schema.ValidationError as e:
            raise MessageProcessError("INVALID_SCHEMA",  e)

        try:
            logging.info("DISPATCHING %s", data)
            yield controller.dispatch(request)
        except webterm.security.SessionExpiredError as e:
            raise MessageProcessError("SESSION_TERMINATED", e)
        except webterm.security.UnauthorizedAccessError as e:
            raise MessageProcessError("UNAUTHORIZED_ACCESS", e)
        except webterm.component.component.InvalidActionError as e:
            raise MessageProcessError("INVALID_ACTION", e)

    @tornado.gen.coroutine
    def on_message(self, data):
        logging.info("MESSAGE RECEIVED %s", data)
        try:
            yield self._on_message(data)
        except MessageProcessError as e:
            self.write_error(e.error_type, data, e.exception)
        except Exception as e:
            self.write_error("UNCAUGHT_SERVER_ERROR", data, e)
        # raise tornado.gen.Return(result)

    def write_error(self, error_type, message, exception=None):
        logging.error(
            "CONN ERROR \n\t type: %s \n\t message %s \n\t exception: %s",
            error_type, message, ("%s (%s)" % (exception.__class__.__name__, exception)))

        self.write_json(
            component.ResponseSchema().Error(error_type, message))

    def write_json(self, data):
        msg = json.dumps(data)
        self.send(msg)
