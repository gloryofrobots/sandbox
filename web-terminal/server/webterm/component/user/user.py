
import tornado.gen
import tornado.web
import logging

from webterm.component import component


class ResponseSchema(component.ResponseSchema):

    def Users(self):
        return self.create("USERS")

RequestSchema = [
            {
                "action": "PING",
                "schema": {
                }
            },
        ]

class Controller(component.Controller):
    def _actions(self):
        return {
            "PING": self.on_ping,
        }

    def on_ping(self, response, msg):
        logging.info("ping %s", msg)
        ping = yield seld.db.connection.ping()
        logging.info("DB PING %s", ping)
        response.send(self.protocol.Pong())


def install_controller(route, connection, db, config):
    component.install_controller(connection, route, Controller,  RequestSchema, ResponseSchema, db, config)

###########################################################
###########################################################