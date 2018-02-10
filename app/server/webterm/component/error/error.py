
from webterm.component import component

__NAME = "error"

class ResponseSchema(component.ResponseSchema):
    def Error(self, error_type, message):
        return self.create(error_type, {"message": message})

def init_response_schema(route, schemas):
    schemas.add(__NAME, ResponseSchema(route))
