
import json
import validictory
import copy
import logging


COMMON_SOCKJS_SCHEMA = {
    "type": "object",
    "properties": {
        "action": {"type": "string"},
        "sid": {"type":"integer", "required":False},
        "token": {"type":"string", "required":False},
        # "jwt": {"type": "string"},
        "data": {"type": "object", "properties": None},
    }
}


def extend_child_schemas(parent, schemas):
    full_schemas = {}
    for schema in schemas:
        full_schema = copy.deepcopy(parent)
        full_schema["properties"]["data"]["properties"] = schema["schema"]
        full_schemas[schema["action"]] = full_schema

    return full_schemas


def create_sockjs_validator(schemas):
    new_schemas = extend_child_schemas(COMMON_SOCKJS_SCHEMA, schemas)
    return Validator(new_schemas)


class ValidationException(Exception):
    pass


class Validator(object):
    def __init__(self, schemas=None):
        super(Validator, self).__init__()
        schemas = {} if schemas is None else schemas
        self.message_schemas = schemas

    def add_schema(self, action, data_properties):
        self.message_schemas[action] = data_properties

    def validate(self, msg_data):
        if "action" not in msg_data:
            raise ValidationException("action")

        action = msg_data["action"]

        if action not in self.message_schemas:
            raise ValidationException("Unknown Action" + str(action))

        schema = self.message_schemas[action]
        try:
            validictory.validate(
                msg_data, schema, disallow_unknown_properties=True)
        except Exception as e:
            raise ValidationException(str(e))
