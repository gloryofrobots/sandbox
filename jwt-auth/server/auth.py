import handler
import tornado.gen
import tornado.web
import security
import jwt
import logging

class AuthHandler(handler.BaseHandler):

    def get_schemas(self):
        return [{
            "action": "AUTH",
            "schema": {
                "password": {"type": "string", "blank": False},
                "username": {"type": "string", "blank": False}
            }
        }
        ]

    @handler.parse_json_payload
    @handler.validate_json_payload
    @handler.write_json_headers
    @handler.tornado.gen.coroutine
    def post(self, msg):
        cfg = self.get_config()
        users = self.get_users_collection()
        data = msg["data"]
        user = yield users.find_one(dict(username=data["username"]))
        if user is None:
            self.respond_error(
                "AUTH", "Invalid username")
        elif not security.verify_password(data["password"], user["password"]): 
            self.respond_error(
                "AUTH", "Passwords did not match")
        else:
            token,exp = security.create_token(
                dict(user=user["uid"]),
                cfg.JWT_SECRET,
                cfg.JWT_ALGO,
                cfg.JWT_DURATION
            )
            # self.set_cookie('jwt', token)
            self.respond("AUTH_SUCCESS", dict(jwt=token, exp=exp))

        self.finish()