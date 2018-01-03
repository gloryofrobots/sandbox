
import tornado.gen
import tornado.web
import logging

from webterm.component import component
from . import db_user

__NAME = "user"

##########################################
##########################################

class ResponseSchema(component.ResponseSchema):
    def Users(self, data):
        return self.create("USERS", dict(users=data))

##########################################
##########################################

class Controller(component.Controller):
    _REQUEST_SCHEMA = [
            {
                "action": "GET_USERS",
                "schema": {
                }
            },
    ]

    @tornado.gen.coroutine
    def on_message_get_users(self, request):
        logging.info("users req received %s", request)
        request.reply(self.schema.Users())

##########################################
##########################################


def init_component(route, config, schemas, db):
    schemas.add(__NAME, ResponseSchema(route))
    db_user.init_database(__NAME, db)


def create_controller(route, config, schemas, db):
    return Controller(
        name=__NAME,
        route=route,
        config=config,
        db=db,
        response_schemas=schemas
    )