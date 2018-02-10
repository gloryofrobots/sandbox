import tornado.gen
import tornado.web
import logging
import zmq
import bson

from webterm.component import component


__NAME = "scm"

##########################################
##########################################


class ResponseSchema(component.ResponseSchema):

    def Result(self, result):
        return self.create("RESULT", dict(result=result))

    def Error(self, error):
        return self.create("ERROR", dict(error=error))

##########################################
##########################################


class Controller(component.Controller):
    _REQUEST_SCHEMA = [
        {
            "action": "EVAL",
            "schema": {
                    "code": {"type": "string"},
            }
        },
    ]

    def _on_init(self, options):
        self.zmq_context = options["zmq_context"]
        self.socket = self.zmq_context.socket(zmq.REQ)
        self.socket.connect(self.config.SCM_SOCKET)

    def _on_close(self):
        self.socket.close()

    @tornado.gen.coroutine
    def on_message_eval(self, request):
        logging.info("eval req received %s", request)
        code = request.data["code"]
        msg = bson.dumps(dict(code=code))
        self.socket.send(msg)
        result = yield self.socket.recv()
        logging.info("RECIVED %s",  result)
        result = bson.loads(result)
        status = result["status"]
        if status == "OK":
            request.reply(self.schema.Result(result["result"]))
        elif status == "ERR":
            request.reply(self.schema.Error(result["error"]))


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
        auth=ctx.auth,
        zmq_context=ctx.zmq_context
    )