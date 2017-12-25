import handler
import conn
import tornado.gen
import tornado.web
import security
import logging


class TimeEchoConnection(conn.BaseConnection):
    def get_schemas(self):
        return [
            {
                "action": "START_TIME_ECHO",
                "schema": {
                    "interval": {"type": "integer"},
                }
            },
            {
                "action": "STOP_TIME_ECHO",
                "schema": {
                }
            },
        ]

    def _on_open(self, info):
        self.looper = None

    def get_actions(self):
        return {
            "START_TIME_ECHO":self.on_start_time_echo,
            "STOP_TIME_ECHO":self.on_stop_time_echo
        }

    @conn.jwtauth
    def on_start_time_echo(self, jwt, msg):
        logging.info("start time echo %s ", str(self.looper))
        if self.looper != None:
            return

        if msg["interval"] < 500:
            self.respond_error("UNSUPPORTED_ECHO_INTERVAL", "Interval must be > 500")
            return
            
        self.looper = self.add_loop(self.time_echo, msg["interval"])

    @conn.jwtauth
    def on_stop_time_echo(self, jwt, msg):
        logging.info("stop time echo %s", str(self.looper))
        if self.looper != None:
            return

        self.remove_loop(self.looper)

    def time_echo(self):
        if self.is_closed:
            return
        logging.info("TIME ECHO")
        self.respond("TIME", {"time":security.utc_now()})


class EchoHandler(handler.BaseHandler):
    def get_schemas(self):
        return [
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
            self.respond("TIME", {"time":security.utc_now()})

        self.finish()
