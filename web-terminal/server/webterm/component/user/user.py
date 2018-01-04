
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

    def User(self, user_id, username,):
        return self.create("USER", dict(id=user_id, username=username))

##########################################
##########################################


class Controller(component.Controller):
    _REQUEST_SCHEMA = [
        {
            "action": "GET_ALL",
            "schema": {
            }
        },
        {
            "action": "GET_AUTHENTICATED",
            "schema": {
            }
        },
    ]

    @tornado.gen.coroutine
    def on_message_get_authenticated(self, request):
        logging.info("users get auth req received %s", request)
        user = yield self.mapper.get_user_by_id(request.user_id)

        if user is None:
            request.reply(self.schemas.error.Error("REQUEST_FAILED", "USER IS ABSENT"))

        request.reply(self.schema.User(user["id"], user["username"]))

    @tornado.gen.coroutine
    def on_message_get_all(self, request):
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
