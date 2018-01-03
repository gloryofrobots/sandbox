import collections

class ComponentCollection(object):

    def __init__(self, name):
        super(ComponentCollection, self).__init__()
        self.name = name
        self.objects = {}

    def add(self, name, obj):
        self.objects[name] = obj

    def fork(self, names):
        objects = []
        for name in names:
            if name not in self.objects:
                raise ConfigurationError(
                    "ComponentCollection invalid name %s" % name)
            objects.append(self.objects[name])
        type_name = self.name + "".join([name.title() for name in names])
        typp = collections.namedtuple(type_name, names)
        return typp(*objects)

    def pack(self):
        return self.fork(self.objects.keys())

db = ComponentCollection("Collection")

db.add("basic", dict(Error="ERROR", Pong="PONG"))
db.add("users", dict(Users="USERS", UserDeleted="USER_DELETED"))
db.add("records", dict(Records="RECORDS", RecordDeleted="RECORD_DELETED", RecordCreated="RECORD_CREATED"))

s1 = db.fork(["basic", "users"])
s2 = db.fork(["basic"])
s3 = db.fork(["users", "basic", "records"])
s4 = db.pack()

print s3, s3.users, s3.basic, s3.records
print s2, s2.basic, hasattr(s2,"users"), hasattr(s2, "records")
print s1, s1.basic, s1.users, hasattr(s1, "records")
print s4, s4.users, s4.basic, s4.records




