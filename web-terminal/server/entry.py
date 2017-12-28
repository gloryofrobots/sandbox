
import handler
import conn
import tornado.gen
import tornado.web
import security
import logging


class Connection(conn.BaseConnection):
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
            "PING":self.on_ping,
        }

    @tornado.gen.coroutine
    def on_ping(self, msg):
        logging.info("ping %s", msg)
        self.respond_empty("PONG", {"sid":msg["data"]["sid"]})


