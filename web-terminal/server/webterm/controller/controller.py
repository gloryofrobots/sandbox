import json
import tornado.gen
import tornado.web
import logging
import sockjs.tornado
import tornado.ioloop
from webterm import (input_schema, output_schema, security)



class Controller(object):
    def __init__(self):
        self.validator = input_schema.create_validator(self.get_schemas())
        self.protocol = output_schema.Schema
        self.loops = []

    def get_actions(self):
        raise RuntimeError("Abstract method")

    def get_schemas(self):
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
