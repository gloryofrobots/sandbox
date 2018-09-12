from puzzle import lib
from puzzle import grid

class Puzzle:

    def __init__(self, data, lib):
        self.initial = grid.from2dlist(data)
        self.history = None
        self.reset()
        self.lib = lib

    def reset(self):
        self.history = [(self.initial, None)]


    def current(self):
        return self.history[len(self.history) - 1][0]

    def apply(self, name):
        t = self.lib.get(name)
        grid = self.current()
        new_grid = grid.transform(t)
        return new_grid, t
        
    def push(self, name):
        new_grid, t = self.apply(name)
        self.history.append((new_grid, t))

    def pop(self):
        return self.history.pop()

    def test(self, name):
        new_grid, t = self.apply(name)
        grid.display(g)
        
        
    def display(self):
        for g, t in self.history:
            print("----------")
            print("::", t)
            print(g.display())


def create(data, _lib=None):
    if _lib is None:
        _lib = lib.lib

    return Puzzle(data, _lib)