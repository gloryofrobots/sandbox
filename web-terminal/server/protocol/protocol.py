import json
import tornado.gen
import tornado.web
import security
import logging
import sockjs.tornado
import tornado.ioloop
import input_schema
import output_schema
import config


class Protocol(object):
    def __init__(self):
        self.validator = input_schema.create_validator(self._schemas())
        self.actions = self._actions()
        self.protocol = output_schema.Schema
        self.loops = []

    def _actions(self):
        raise RuntimeError("Abstract method")

    def _schemas(self):
        raise RuntimeError("Abstract method")

    def add_loop(self, cb, interval):
        # tornado.ioloop.IOLoop.current().spawn_callback(self.echo_loop)
        loop = tornado.ioloop.PeriodicCallback(cb, interval)
        loop.start()
        self.loops.append(loop)
        return loop

    def validate(msg):
        self.validator.validate(msg)

    def remove_loop(self, loop):
        self.loops.remove(loop)
        loop.stop()

    def close(self):
        logging.debug("close protocol loops:%d", len(self.loops)) 
        for loop in self.loops:
            loop.stop()
        self.loops = []
        self._on_close()

    def _on_close(self):
        pass

