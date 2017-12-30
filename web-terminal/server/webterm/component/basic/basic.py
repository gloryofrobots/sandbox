import tornado.gen
import tornado.web
import logging

from webterm.component import component

RequestSchema = [
            {
                "action": "PING",
                "schema": {
                }
            },
        ]

##########################################
##########################################

class ResponseSchema(component.ResponseSchema):

    def Pong(self):
        return self.create("PONG")

##########################################
##########################################

class Controller(component.Controller):
    def get_actions(self):
        return {
            "PING": self.on_ping,
        }

    def on_ping(self, response, msg):
        logging.info("ping %s", msg)
        ping = yield seld.db.connection.ping()
        logging.info("DB PING %s", ping)
        response.send(self.protocol.Pong())

##########################################
##########################################

def create_controller(route, config, db):
    return Controller(dict(
        route=route,
        config=config,
        db=db,
        request_schema=RequestSchema,
        response_schema=ResponseSchema(route)
        
    ))