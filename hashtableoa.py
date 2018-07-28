class Deleted(object):
    pass

DELETED = Deleted()


def gethash(s):
    h = 0
    s = str(s)

    for c in s:
        h = (h << 6) ^ (h >> 26) ^ ord(c)
    return h


class Pair:

    def __init__(self, key, value):
        self.key = key
        self.value = value

    def __str__(self):
        return str((self.key, self.value))

    __repr__ = __str__

class HashTable(object):
    CAPACITY = 2

    def __init__(self):
        super(HashTable, self).__init__()
        self.data = [None] * self.CAPACITY
        self.size = 0

    def get_index(self, key):
        return gethash(key) % len(self.data)

    def put(self, key, value):
        index = self.get_index(key)
        item = self.data[index]
        if item is not None:
            # print "old key", item
            while item is not None \
                  and item is not DELETED \
                  and item.key != key:

                index = (index + 1) % len(self.data)
                item = self.data[index]

        self.data[index] = Pair(key, value)
        self.size += 1

        if not self.is_overloaded():
            return
        new_size = len(self.data) * 2
        old_data = self.data
        self.data = [None] * new_size
        self.size = 0
        for item in old_data:
            if item is None or item is DELETED:
                continue
            self.put(item.key, item.value)

    def get(self, key):
        index = self.get_index()
        item = self.data[index]
        if item is None:
            raise KeyError()

        while item.key != key:
            index = (index + 1) % len(self.data)
            item = self.data[index]
            if item is DELETED:
                continue
            if item is None:
                raise KeyError()
            
        return item.value

    def delete(self, key):
        index = self.get_index(key)
        item = self.data[index]
        if item is None:
            raise KeyError(key)

        while item.key != key:
            index = (index  + 1) % len(self.data)
            item = self.data[index]
            if item is DELETED:
                continue
            if item is None:
                raise KeyError(key)

        self.data[index] = DELETED
        self.size -= 1

    def is_overloaded(self):
        factor = float(self.size) / float(len(self.data))
        return factor >= 0.7

    def __str__(self):
        res = []
        for item in self.data:
            if item is None or item is DELETED:
                continue
            res.append("%s:%s" % (str(item.key), str(item.value)))

        return "{%s}" % ",".join(res)

def test():
    h = HashTable()
    h.put("a", 1)
    h.put("a", 2)
    h.put("a", 3)
    h.put("b", 2)
    h.put("c", 3)
    h.put("c", 4)
    h.put("a", 5)
    print h
    h.delete("b")
    print h
    h.put("b", 42)
    print h

test()