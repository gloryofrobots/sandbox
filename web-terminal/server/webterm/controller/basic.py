import tornado.gen
import tornado.web
import logging

from webterm.controller import controller


class PingController(controller.Controller):

    def get_schemas(self):
        return [
            {
                "action": "PING",
                "schema": {
                }
            },
        ]

    def get_actions(self):
        return {
            "PING": self.on_ping,
        }

    def on_ping(self, response, msg):
        logging.info("ping %s", msg)
        response.send(self.protocol.Pong())
