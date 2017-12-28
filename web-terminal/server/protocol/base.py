import tornado.gen
import tornado.web
import security
import logging
import protocol
import conn

class PingProtocol(protocol.Protocol):
    def _schemas(self):
        return [
            {
                "action": "PING",
                "schema": {
                }
            },
        ]

    def _actions(self):
        return {
            "PING":self.on_ping,
        }

    def on_ping(self, response, msg):
        logging.info("ping %s", msg)
        response.write(self.protocol.Pong())



