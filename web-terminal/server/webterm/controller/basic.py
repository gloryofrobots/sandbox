import tornado.gen
import tornado.web
import logging

from webterm.controller import controller
from webterm.response_protocol import ResponseProtocol


class PingProtocol(ResponseProtocol):

    def Pong(self):
        return self.empty_message("PONG")


class PingController(controller.Controller):

    def get_protocol(self):
        return PingProtocol()

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


###########################################################
###########################################################


class UsersProtocol(ResponseProtocol):

    def Users(self, data):
        return self.message("USERS", {"users": data})


class UsersController(controller.Controller):

    def get_protocol(self):
        return UsersProtocol()

    def get_schemas(self):
        return [
            {
                "action": "GET_USERS",
                "schema": {
                }
            },
        ]

    def get_actions(self):
        return {
            "GET_USERS": self.on_get_users,
        }

    @tornado.gen.coroutine
    def on_get_users(self, response, msg):
        logging.info("get_users %s", msg)
        users = yield self.db.Users.get_users()
        response.send(self.protocol.Users(users))
