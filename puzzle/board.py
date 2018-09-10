
class Cell:
    def __init__(self, val, color):
        self.val = val
        self.color = color

    def equal(self, cell):
        return self.val == cell.val
    
    
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def set_xy_if_top_left(self, x, y):
        if self.cmp_xy_if_top_left(x, y) == -1:
            self.x = x
            self.y = y

    def cmp_xy_if_top_left(self, x, y):
        if y > self.y:
            return 1
        if y == self.y:
            if x > self.x:
                return 1
            elif x == self.x:
                return 0
            return -1
        else:
            return -1

    def __cmp__(self, other):
        return self.cmp_xy_if_top_left(other.x, other.y)

class Grid:
    def __init__(self, side):
        self.side = side
        self.size = side*side
        self.cells = [None] * self.size
        self.origin = Point(self.side/2, self.side/2)
        self.top =-self.origin.y
        
    def index(self, x, y):
        if x > self.side or y > self.side:
            raise IndexError("Out of bounds of the grid", x, y)

        return y * self.side + x

    def get(self, x, y):
        index = self.index(x, y)
        return self.cells[index]

    def _set(self, x, y, cell):
        index = self.index(x, y)
        self.cells[index] = cell
        
    def set(self, x, y, cell):
        nx = x + self.origin.x
        ny = y + self.origin.y
        self._set(nx, ny, cell)

    def find_top(self):
        for y in range(self.side):
            for x in range(self.side):
        
    def compact(self):
        index = 0
        top = 0
        origin = Point(0, 0)
        for y in range(self.side):
            for x in range(self.side):
                cell = self.cells[index]
                index += 0
            pass
            