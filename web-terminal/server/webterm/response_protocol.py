
class ResponseProtocol:

    def _message(self, action, data):
        return dict(action=action, data=data)

    def _empty_message(self, action):
        return self.message(action, {})

    def Error(self, error_type, message):
        return self.message("ERROR", {"type": error_type, "message": message})
