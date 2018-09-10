import math
import copy
def calc_index(x, y, width):
    return y * width + x;

STRINGS = {}
STRINGS[None] = " "
STRINGS[0] = "0"
STRINGS[1] = "1"

COLORS = [
    (195, 206, 190),
    (137, 168, 121)
]

def canonical_cols(rows):
    cols = []
    height = len(rows)
    x = 0
    while True:
        col = []
        finished = True
        for y in range(height):
            row = rows[y]
            if (x >= len(row)):
                val = None
            else:
                finished = False
                val = row[x]
            col.append(val)

        if finished:
            break
        else:
            cols.append(col)
            x += 1
    return cols

    
def canonical_rows(cols):
    rows = []
    width = len(cols)
    y = 0
    while True:
        row = []
        finished = True
        for x in range(width):
            col = cols[x]
            if (y >= len(col)):
                val = None
            else:
                finished = False
                val = col[y]
            row.append(val)

        if finished:
            break
        else:
            rows.append(row)
            y += 1
    return rows


def deepfilter(fn, lists):
    res = []
    for l in lists:
        fl = list(filter(fn, l))
        res.append(fl)
    return res


filternone = lambda lists: deepfilter(lambda v: v is not None, lists)

class Grid:
    def __str__(self):
        rows = reversed(self.canonical_rows())
        crows = [" ".join(map(lambda v:STRINGS[v], r)) for r in rows]
        result = "\n".join(crows)
        return result

    def __repr__(self):
        return str(self)


def makegrid(width, arr):
    cols = [[] for _ in range(width)]
    height = math.floor(len(arr) / width)
    print("DATA GRID", width, height)
    print("-----------------------------")
    for x in range(width):
        col = cols[x]
        for y in range(height-1, -1, -1):
            index = calc_index(x, y, width)
            val = arr[index]
            if val is None:
                break
            col.append(val)
    return DGrid(cols=cols)
    

class ColGrid(Grid):

    def __init__(self, grid=None, cols=None):
        if cols is not None:
            self.cols = cols
        else:
            self.cols = filternone(grid.canonical_cols())

    def canonical_rows(self):
        return canonical_rows(self.canonical_cols())

    def transform(t):
        self.cols = t.apply(self.cols)

class RowGrid(Grid):
    def __init__(self,grid=None, rows=None):
        if rows is not None:
            self.rows = rows
        else:
            self.rows = filternone(grid.canonical_rows())

    def transform(t):
        self.rows = t.apply(self.rows)

    def canonical_cols(self):
        return canonical_cols(self.canonical_rows())

class DGrid(ColGrid):
    def canonical_cols(self):
        cols = copy.deepcopy(self.cols)
        max_height = max([len(col) for col in self.cols])
        for col in cols:
            padding = ([None] * (max_height - len(col)))
            col += padding
        return cols


class UGrid(ColGrid):
    def __init__(self, grid):
        self.cols = filternone(grid.canonical_cols())
            
    def canonical_cols(self):
        max_height = max([len(col) for col in self.cols])
        cols = []
        for c in self.cols:
            padding = ([None] * (max_height - len(c)))
            col = padding + c
            cols.append(col)
        return cols

class LGrid(Grid):
    def __init__(self,grid):
        self.rows = filternone(grid.canonical_rows())

    def canonical_rows(self):
        max_width = max([len(row) for row in self.rows])
        rows = []
        for r in self.rows:
            padding = ([None] * (max_width - len(r)))
            row = r + padding 
            rows.append(row)
        return rows

    def canonical_cols(self):
        return canonical_cols(self.canonical_rows())

class RGrid(RowGrid):
    def canonical_rows(self):
        max_width = max([len(row) for row in self.rows])
        rows = []
        for r in self.rows:
            padding = ([None] * (max_width - len(r)))
            row = r + padding 
            rows.append(row)
        return rows

class LGrid(RowGrid):
    def canonical_rows(self):
        max_width = max([len(row) for row in self.rows])
        rows = []
        for r in self.rows:
            padding = ([None] * (max_width - len(r)))
            row = padding + r 
            rows.append(row)
        return rows
