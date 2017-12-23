
import handler
import tornado.gen
import tornado.web
import security


class RegisterHandler(handler.BaseHandler):

    def get_schemas(self):
        return [{
            "action": "REGISTER",
            "schema": {
                "password": {"type": "string", "blank": False},
                "username": {"type": "string", "blank": False},
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
        existed = yield users.find_one(dict(username=data["username"]))
        if existed is not None:
            self.respond_error(
                "REGISTER", "User with given credentials has been already registered")
        else:
            password = security.hash_password(data["password"])
            security.verify_password(data["password"], password)
            users.insert_one(dict(username=data["username"],
                                  password=password))

            self.respond_empty("REGISTER_SUCCESS")
        self.finish()
