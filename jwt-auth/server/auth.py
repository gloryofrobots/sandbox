import handler
import tornado.gen
import tornado.web
import security
import jwt

class AuthHandler(handler.BaseHandler):

    def get_schemas(self):
        return [{
            "action": "LOGIN",
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
        users = self.get_users_collection()
        data = msg["data"]
        user = yield users.find_one(dict(username=data["username"]))
        if user is None:
            self.respond_error(
                "AUTH", "Invalid username")
        elif not security.verify_password(msg["password"], user["password"]): 
            self.respond_error(
                "AUTH", "Passwords did not match")
        else:
            self.respond_empty("AUTH_SUCCESS")

        self.finish()