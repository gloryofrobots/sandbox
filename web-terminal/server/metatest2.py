
class C(object):
    # __metaclass__ = ControllerMetaclass
    def __init__(self):
        super(C, self).__init__()
            
class C1(C):
    RequestSchema = [
                {"action": "PING",},
                {"action": "AUTH/LOGIN",},
            ]

    def on_message_ping(self):
        return "C1 ping"

    def on_message_auth_login(self):
        return "C1 auth login"

class C2(C1):

    RequestSchema = [
                {"action": "PONG",},
            ]

    def on_message_pong(self):
        return "C2 pong"

    def on_message_auth_login(self):
        assert(False)

class C3(C1):
    RequestSchema = [
                {"action": "GET_SOME",},
            ]

    def _declare_actions(self):
        return {
            "GET_SOME": self._get_some
        }

    def _get_some(self):
        return "C3 get_some"

        
    
def test(c):
    # action = c.kls
    # print action()
    print c.__class__.__name__, c.actions
    for action in c.actions.values():
        print action()
    
test(C1())
test(C2())
test(C3())