

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

    @handler.parse_json_payload
    @handler.validate_json_payload
    @handler.write_json_headers
    @handler.tornado.gen.coroutine
    def post(self, msg):
        users = self.get_users_collection()
        data = msg["data"]
        logging.info(request.headers)

        self.respond_empty("ACCESS_DENIED")
        # user = yield users.find_one(dict(username=data["username"]))
        # if user is None:
        #     self.respond_error(
        #         "AUTH", "Invalid username")
        self.finish()
