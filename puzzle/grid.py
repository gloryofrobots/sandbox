import math
import copy

STRINGS = {}
STRINGS[None] = " "
STRINGS[0] = "0"
STRINGS[1] = "1"

COLORS = [
    (195, 206, 190),
    (137, 168, 121)
]

X = None


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


def filter_empty(arr):
    res = []
    for a in arr:
        empty = True
        for v in a:
            if v is not None:
                empty = False
                break
        if not empty:
            res.append(a)
    return res


def pad_end(lst):
    res = copy.deepcopy(lst)
    max_len = max([len(l) for l in res])
    for l in res:
        padding = ([None] * (max_len - len(l)))
        l += padding
    return res


def remove_empty(lst):
    res = []
    for l in lst:
        nl = []
        for v in l:
            if v is not None:
                nl.append(v)
        res.append(nl)
    return res


def deepfilter(fn, lists):
    res = []
    for l in lists:
        fl = list(filter(fn, l))
        res.append(fl)
    return res


filternone = lambda lists: deepfilter(lambda v: v is not None, lists)


def from2dlist(arr):
    width = len(arr[0])
    for a in arr:
        assert(len(a) == width)

    cols = [[] for _ in range(width)]
    height = len(arr)
    # print("DATA GRID", width, height)
    # print("-----------------------------")
    for x in range(width):
        col = cols[x]
        for y in range(height - 1, -1, -1):
            val = arr[y][x]
            if val is None:
                break
            col.append(val)

    return DGrid(cols)


class Grid:

    def __init__(self, els):
        if isinstance(els, Grid):
            self.els = self.extract_from_grid(els)
        else:
            self.els = els

    # def copy(self):
    #     return copy.deepcopy(self)

    def clone(self, els):
        return self.__class__(els)

    def elements(self):
        return copy.deepcopy(self.els)

    def __repr__(self):
        return self.display()

    def __str__(self):
        rows = reversed(self.canonical_rows())
        crows = [" ".join(map(lambda v:STRINGS[v], r)) for r in rows]
        result = "\n".join(crows)
        return result

    def display(self):
        rows = list(reversed(self.canonical_rows()))
        rows = ["%r" % r for r in rows]
        s = "[\n    %s\n]" % ",\n    ".join(rows)
        s = s.replace("None", "X")
        return s

    def transform(self, t):
        els = self.elements()
        els = t.apply(els)
        els = filter_empty(els)
        return self.clone(els)

    def pad_back(self):
        els = []
        max_size = max([len(el) for el in self.els])
        for e in self.els:
            padding = ([None] * (max_size - len(e)))
            el = e + padding
            els.append(el)

        return els

    def pad_front(self):
        els = []
        max_size = max([len(el) for el in self.els])
        for e in self.els:
            padding = ([None] * (max_size - len(e)))
            el = padding + e
            els.append(el)

        return els

class ColGrid(Grid):
    def extract_from_grid(self, grid):
        return filternone(grid.canonical_cols())
        
    def canonical_rows(self):
        return canonical_rows(self.canonical_cols())


class RowGrid(Grid):

    def extract_from_grid(self, grid):
        return filternone(grid.canonical_rows())

    def canonical_cols(self):
        return canonical_cols(self.canonical_rows())


class DGrid(ColGrid):

    def canonical_cols(self):
        return self.pad_back()


class UGrid(ColGrid):

    def canonical_cols(self):
        return self.pad_front()

class RGrid(RowGrid):

    def canonical_rows(self):
        return self.pad_back()

class LGrid(RowGrid):

    def canonical_rows(self):
        return self.pad_front()

