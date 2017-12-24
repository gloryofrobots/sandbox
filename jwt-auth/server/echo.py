

import handler
import tornado.gen
import tornado.web
import security
import logging


class EchoHandler(handler.BaseHandler):

    def get_schemas(self):
        return [
            {
                "action": "USER_DATA",
                "schema": {
                }
            },
            {
                "action": "TIME",
                "schema": {
                }
            },
        ]

    @handler.write_json_headers
    @handler.jwtauth
    @handler.parse_json_payload
    @handler.validate_json_payload
    @handler.tornado.gen.coroutine
    def post(self, msg, jwt_payload):
        users = self.get_users_collection()
        data = msg["data"]
        action = msg["action"]
        if action == "TIME":
            self.respond("TIME", {"time":security.utc_now(), "jwt":jwt_payload})

        # user = yield users.find_one(dict(username=data["username"]))
        # if user is None:
        #     self.respond_error(
        #         "AUTH", "Invalid username")
        self.finish()
