
def __message(action, data):
    return dict(action=action, data=data)

def __empty_message(action):
    return __message(action)

class __Schema:
    def Pong(self):
        return __message("PONG")

Schema = __Schema

