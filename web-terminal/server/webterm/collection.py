
import collections


class Collection(object):

    def __init__(self, name):
        super(Collection, self).__init__()
        self.name = name
        self.objects = {}

    def add(self, name, obj):
        self.objects[name] = obj

    def fork(self, names):
        objects = []
        for name in names:
            if name not in self.objects:
                raise AttributeError(name)
            objects.append(self.objects[name])
        # type_name = self.name + "".join([name.title() for name in names])
        typp = collections.namedtuple(self.name, names)
        return typp(*objects)

    def pack(self):
        return self.fork(self.objects.keys())

