
def _message(action, data):
    return dict(action=action, data=data)

def _empty_message(action):
    return _message(action, {})

class __Schema:
    def Pong(self):
        return _empty_message("PONG")

    def Error(self, error_type, message):
        return _message("ERROR", {"type":error_type, "message":message})
        
Schema = __Schema()

