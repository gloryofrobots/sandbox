
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
            "action": "ALL",
            "schema": {
            }
        },
    ]

    @tornado.gen.coroutine
    def on_message_all(self, request):
        logging.info("users req received %s", request)
        users = yield self.mapper.get_users()
        request.reply(self.schema.Users(users))

##########################################
##########################################


def init_response_schema(route, schemas):
    schemas.add(__NAME, ResponseSchema(route))


def init_database(db):
    db_user.init_database(__NAME, db)
    

def create_controller(route, ctx):
    return Controller(
        name=__NAME,
        route=route,
        config=ctx.config,
        db=ctx.db,
        response_schemas=ctx.response_schema,
        auth=ctx.auth
    )
