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
    def _actions(self):
        return {
            "PING": self.on_ping,
        }

    @tornado.gen.coroutine
    def on_ping(self, request):
        logging.info("ping received %s", request)
        # raise RuntimeError("d1111111")
        # ping = yield self.db.connection.ping()
        # logging.info("DB PING %s", ping)
        request.reply(self.schema.Pong())
        # raise tornad.gen.Return(None)

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