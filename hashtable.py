#Emacspeak old commit  3bc5caeda14f1ae1ac8e1eeb246bc80f87b21e36y


class Entry(object):
    def __init__(self, key, value):
        self.next = None
        self.value = value
        self.key = key

def gethash(key, size):
    s = str(key)
    h = 0
    for c in s:
        h = (h << 6) ^ (h >> 26) ^ ord(c)

    return h % size
    

class HashTableChain(object):
    CAPACITY = 1
    def __init__(self):
        self.size = 0
        self.data = [None] * self.CAPACITY

    def hash(self, key):
        return gethash(key, len(self.data))

    def put(self, key, value):
        # print "__PUT__"
        h = self.hash(key)
        item = self.data[h]
        if item is None:
            self.data[h] = Entry(key, value)
            # print "put first", key, self
        else:
            while True:
                if item.key == key:
                    item.value = value
                    # print "put Found", key, self
                    break

                if item.next is None:
                    item.next = Entry(key, value)
                    # print "put New", key, self
                    break

                item = item.next

        self.size += 1

        # print "size,", self.size, len(self.data)
        if self.size < len(self.data):
            return

        old_data = self.data
        self.data = [None] * (self.size * 2)
        # print "new size", len(self.data)

        for entry in old_data:
            item = entry
            while item is not None:
                # print "put resize", item.key, item.value
                self.put(item.key, item.value)
                item = item.next

        
    def get(self, key):
        h = self.hash(key)
        item = self.data[h]
        if item is None:
            raise KeyError()
            
        while True:
            if item.key == key:
                return item.value

            if item.next is None:
                raise KeyError()

            item = item.next

    def delete(self, key):
        h = self.hash(key)
        item = self.data[h]
        if item is None:
            raise KeyError()

        prev = item
        item = item.next

        if prev.key == key:
            if item is None:
                self.data[h] = None
                return
            else:
                self.data[h] = item
            return
            
        while True:
            if item is None:
                raise KeyError()

            if item.key == key:
                prev.next = item.next
                return

            prev = item
            item = item.next
            

    def __str__(self):
        result = []
        for entry in self.data:
            item = entry
            while item is not None:
                result.append("%s: %s" % (str(entry.key), str(entry.value)))
                item = item.next
        return "{%s}" % ",".join(result)

    def __repr__(self):
        return self.__str__()
        
    @staticmethod
    def test():
        h = HashTableChain()
        h.put("a", 1)
        h.put("a", 2)
        h.put("b", 3)
        h.put("c", 4)
        h.put("a", 3)
        h.put("b", 5)
        print(h)
        print(h.get("a"))
        print(h.get("b"))
        print(h.get("c"))
        h.delete("b")
        print(h)
        h.put("b", 10)
        h.delete("a")
        print(h)

