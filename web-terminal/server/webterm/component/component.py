import json
import tornado.gen
import tornado.web
import logging
import tornado.ioloop
import webterm.request_schema
import webterm.security
from webterm.component.error import (
    InvalidConfigurationError, InvalidActionError)

DEFAULT_DATA = {}


class ResponseSchema(object):
    def __init__(self, route):
        super(Controller, self).__init__()
        self.route = route

    def create(self, action, payload=DEFAULT_DATA):
        route = "/".join([self.route, action])
        return dict(action=route, data=payload)

    def Error(self, error_type, message):
        return self.create("ERROR", {"type": error_type, "message": message})


class Controller(object):

    def __init__(self, options):
        super(Controller, self).__init__(options)
        try:
            self.route = options["route"]
            self.options = options
            self.config = options["config"]
            self.db = options["db"]
            self.schema = options["response_schema"]
            self.request_schema = options["request_schema"]
        except KeyError as e:
            raise InvalidConfigurationError(
                "Controller demands param %s" % e.args)

        self.validator = webterm.request_schema.create_validator(
            self.request_schema)
        self.loops = []

        self.actions = self._actions()
        for action in self.request_schema:
            if action not in self.actions:
                raise InvalidConfigurationError("Action %s not set" % action)

    @tornado.gen.coroutine
    def dispatch(self, action, response, message):
        try:
            handler = self.actions[action]
        except KeyError:
            raise InvalidActionError(action)
        result = yield handler(action)
        raise tornado.gen.Result(result)

    def _actions(self):
        raise RuntimeError("Abstract method")

    def add_loop(self, cb, interval):
        # tornado.ioloop.IOLoop.current().spawn_callback(self.echo_loop)
        loop = tornado.ioloop.PeriodicCallback(cb, interval)
        loop.start()
        self.loops.append(loop)
        return loop

    def validate(self, msg):
        self.validator.validate(msg)

    def remove_loop(self, loop):
        self.loops.remove(loop)
        loop.stop()

    def close(self):
        logging.debug("close controller loops:%d", len(self.loops))
        for loop in self.loops:
            loop.stop()
        self.loops = []
        self._on_close()

    def _on_close(self):
        pass


def install_controller(connection, route, controller_type,
                       request_schema, response_schema, db, config):
    pass
