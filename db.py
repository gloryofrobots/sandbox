INT = 0
STR = 1
class Table:
    def __init__(self, filename):
        self.filename = filename
        self.open()

    def open(self):
        file = open(self.filename, "rb")
        self.data = file.read()
        file.close()

class DB:
    def __init__(self):
        pass