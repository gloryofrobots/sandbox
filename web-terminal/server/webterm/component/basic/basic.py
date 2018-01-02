import tornado.gen
import tornado.web
import logging

from webterm.component import component

__NAME = "basic"

##########################################
##########################################

class ResponseSchema(component.ResponseSchema):
    def Pong(self):
        return self.create("PONG")

##########################################
##########################################

class Controller(component.Controller):
    _REQUEST_SCHEMA = [
            {
                "action": "PING",
                "schema": {
                }
            },
    ]

    @tornado.gen.coroutine
    def on_message_ping(self, request):
        logging.info("ping received %s", request)
        request.reply(self.schema.basic.Pong())

##########################################
##########################################


def init_component(route, config, schemas, db):
    schemas.add(__NAME, ResponseSchema(route))


def create_controller(route, config, schemas, db):
    return Controller(dict(
        route=route,
        config=config,
        db=db,
        response_schemas=schemas
    ))