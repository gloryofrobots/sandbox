import tornado.gen
import tornado.web
import logging
import tornado.ioloop
import webterm.component.request_schema
import webterm.security
from webterm.component.exception import (
    ConfigurationError, InvalidActionError)

from webterm.collection import Collection

######################################################
######################################################
######################################################


class ResponseSchemaCollection(Collection):
    def __init__(self):
        super(ResponseSchemaCollection, self).__init__("ResponseSchema")


class ResponseSchema(object):

    def __init__(self, root=""):
        super(ResponseSchema, self).__init__()
        self.root = root

    def create(self, action, payload=None, root=""):
        if root == "":
            root = self.root

        if payload is None:
            payload = {}

        route = "/".join([root, action])
        return dict(route=route, data=payload)


######################################################
######################################################
######################################################


class Controller(object):

    def __init__(self, **options):
        super(Controller, self).__init__()
        try:
            self.options = options
            self.route = options["route"]
            self.config = options["config"]
            self.schemas = options["response_schemas"]
            self.name = options["name"]
        except KeyError as e:
            raise ConfigurationError(
                "Missing Controller param %s" % e.args)

        if "db" in options:
            self.db = options["db"]
            self.mapper = self.db.get_mapper(self.name)

        try:
            self.schema = getattr(self.schemas, self.name)
        except KeyError as e:
            raise ConfigurationError(
                "Response schema for Controller "
                " component is undefined  %s" % e.args)

        self.request_schema = self._declare_request_schema()
        self.validator = webterm.component.request_schema.create_validator(
            self.request_schema)

        self.loops = []

        ######################################
        ######################################

        actions = self._declare_actions()
        if actions is not None:
            self.actions = actions
        else:
            self.actions = {}
            for action_schema in self.request_schema:
                action_name = action_schema["action"]
                handler_name = self.create_handler_name(action_name)
                try:
                    self.actions[action_name] = getattr(self, handler_name)
                except AttributeError as e:
                    raise ConfigurationError("Specify handler %s "
                                             "for action %s or provide "
                                             "custom _declare_actions method" % (handler_name, action_name))
        self._on_init()

    def _on_init(self):
        pass

    def create_handler_name(self, action):
        action_name = action.replace("/", "_").lower()
        return "on_message_%s" % action_name

    def _declare_request_schema(self):
        try:
            return getattr(self, "_REQUEST_SCHEMA")
        except AttributeError:
            raise ConfigurationError("You need to create _REQUEST_SCHEMA "
                                     " property in your class,  "
                                     "or implement your own "
                                     " _declare_request_schema method")

    def _declare_actions(self):
        pass

    def validate(self, request):
        self.validator.validate(request.action, request.message)

    @tornado.gen.coroutine
    def dispatch(self, request):
        try:
            handler = self.actions[request.action]
        except KeyError:
            raise InvalidActionError(request.action)
        result = yield handler(request)
        raise tornado.gen.Return(result)

    def add_loop(self, cb, interval):
        # tornado.ioloop.IOLoop.current().spawn_callback(self.echo_loop)
        loop = tornado.ioloop.PeriodicCallback(cb, interval)
        loop.start()
        self.loops.append(loop)
        return loop

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
