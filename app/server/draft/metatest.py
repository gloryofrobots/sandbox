class ControllerMetaError(Exception):
    pass

class ControllerMetaclass(type): 

    @classmethod
    def create_handler_name(cls, action):
        action_name = action.replace("/", "_").lower()
        return "on_message_%s" % action_name

    
    @classmethod
    def gen(cls, name):
        def _f(self, *args, **kwargs):
            f = getattr(self, name)
            f(*args, **kwargs)
        return _f

    @classmethod
    def check_actions(cls, dct):
        handlers = filter(lambda name: name.startswith("on_message_"), dct.keys())
        schema = dct["RequestSchema"]

        action_map = {}
        for action in schema:
            action_name = action["action"]
            handler_name = cls.create_handler_name(action_name)
            if handler_name not in handlers:
                raise ControllerMetaError("Missing handler for action %s. "
                                          "You need to create method %s "
                                          "in your Controller class" % (action_name, handler_name))
            action_map[action_name] = handler_name
        return action_map

    def __new__(cls, name, bases, dct):
        print "SCHEMA", name, dct["RequestSchema"]
        if "_get_actions" not in dct:
            action_map = cls.check_actions(dct)
            dct["_ACTION_MAP"] = action_map

        return super(ControllerMetaclass, cls).__new__(cls, name, bases, dct)

##########################################
##########################################
class C(object):
    __metaclass__ = ControllerMetaclass
    RequestSchema = []

    def __init__(self):
        super(C, self).__init__()
        if not hasattr(self, "_ACTION_MAP"):
            self.actions = self._get_actions()
        else:
            self.actions = {}
            for action_name in self._ACTION_MAP:
                func = getattr(self, self._ACTION_MAP[action_name])
                self.actions[action_name] = func
            
        

    
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

    def _get_actions(self):
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