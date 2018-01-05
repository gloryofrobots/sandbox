import tornado.gen
import tornado.web
import logging
import copy
import webterm.security

from webterm.component import component

__NAME = "basic"

##########################################
##########################################

class ResponseSchema(component.ResponseSchema):
    def Pong(self):
        return self.create("PONG")

    def AuthSuccess(self, jwt, exp):
        return self.create("AUTH_SUCCESS", {"token":jwt, "exp":exp})

    def RegisterSuccess(self):
        return self.create("REGISTER_SUCCESS")

##########################################
##########################################

class Controller(component.Controller):
    _REQUEST_SCHEMA = [
            {
                "action": "PING",
                "schema": {
                }
            },
            {
                "action": "REGISTER",
                "schema": {
                    "username": {"type": "string"},
                    "password": {"type": "any"},
                }
            },
            {
                "action": "AUTH",
                "schema": {
                    "username": {"type": "string"},
                    "password": {"type": "any"},
                }
            },
    ]

    def _on_init(self, options):
        self.user_mapper = self.db.get_mapper("user")

    @tornado.gen.coroutine
    def on_message_ping(self, request):
        logging.info("ping received %s", request)
        request.reply(self.schema.Pong())

    @tornado.gen.coroutine
    def on_message_register(self, request):
        logging.info("register received %s", request)
        username = request.data["username"]
        
        password = webterm.security.hash_password(request.data["password"])
        webterm.security.verify_password(request.data["password"], password)

        try:
            yield self.user_mapper.insert_user(username, password)
        except Exception as e:
            request.reply(self.schemas.error.Error("REGISTER_FAILED", str(e)))
        else:
            request.reply(self.schema.RegisterSuccess())
            
    @tornado.gen.coroutine
    def on_message_auth(self, request):
        logging.info("auth received %s", request)
        username = request.data["username"]
        password = request.data["password"]
        
        user = yield self.user_mapper.get_user_by_username(username)

        if user is None:
            request.reply(self.schemas.error.Error("AUTH_FAILED", "INVALID USER NAME"))
        elif not webterm.security.verify_password(password, user["password"]): 
            request.reply(self.schemas.error.Error("AUTH_FAILED", "INVALID USER PASSWORD"))
        else:
            logging.info("user %s", user)
            token, exp = self.auth.create_token(dict(id=user["id"], username=user["username"]))
            request.reply(self.schema.AuthSuccess(token, exp))

##########################################
##########################################


def init_response_schema(route, schemas):
    schemas.add(__NAME, ResponseSchema(route))


def create_controller(route, ctx):
    return Controller(
        name=__NAME,
        route=route,
        config=ctx.config,
        db=ctx.db,
        response_schemas=ctx.response_schema,
        public=True,
        auth=ctx.auth,
    )