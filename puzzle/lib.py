"""
transpose :: [[a]] -> [[a]] Source
The transpose function transposes the rows and columns of its argument. For example,

>>> transpose [[1,2,3],[4,5,6]]
[[1,4],[2,5],[3,6]]
If some of the rows are shorter than the following rows, their elements are skipped:

>>> transpose [[10,11],[20],[],[30,31,32]]
[[10,20,30],[11,31],[32]]
"""
import copy


def is_equal_lists(l1, l2):
    if len(l1) != len(l2):
        return False
    for i in range(len(l1)):
        if l1[i] != l2[i]:
            return False

    return True


class Func:

    def apply(values):
        pass
        # res = []
        # for v in values:
        #     val = self._transform(v)
        #     if val is not None:
        #         res.append(val)
        # return res


class Map(Func):

    def __init__(self, fn):
        self.fn = fn

    def apply(self, values):
        res = []
        for v in values:
            val = self.fn.apply(v)
            res.append(val)
        return res


class Reduce(Func):

    def __init__(self, fn):
        self.fn = fn

    def apply(self, values):
        # vals = copy.copy(values)
        res = [copy.copy(values[0])]
        for i in range(1, len(values)):
            v = values[i]
            print("V", v)
            res = self.fn.reduce(v, res)

        return res


class Filter(Func):

    def __init__(self, fn):
        self.fn = fn

    def apply(self, values):
        res = []
        for v in values:
            if self.fn.apply(v) is True:
                res.append(v)
        return res


class Equal(Func):

    def __init__(self, v):
        self.val = v

    def apply(self, val):
        return self.val == val


class Contains(Func):

    def __init__(self, v):
        self.val = v

    def apply(self, vals):
        return self.val in vals

class Zero(Func):
    def apply(self, *args):
        return 0
        
class One(Func):
    def apply(self, *args):
        return 1

class Not(Func):

    def __init__(self, fn):
        self.fn = fn

    def apply(self, val):
        return not self.fn.apply(val)


class Append(Func):

    def __init__(self, val):
        self.val = val

    def apply(self, val):
        return val + self.val


class Prepend(Func):

    def __init__(self, val):
        self.val = val

    def apply(self, val):
        return self.val + val


class Reverse(Func):

    def __init__(self):
        pass

    def apply(self, data):
        return list(reversed(data))


class Intersperse(Func):

    def __init__(self, fn):
        self.fn = fn

    def apply(self, values):
        res = []
        for v in values:
            res.append(v)
            res.append(self.fn.apply(v))
        return res

class Value:

    def __init__(self, v):
        self.val = v

    def matches(self, val):
        if self.val == Any:
            return True
        return self.val == val

    def apply(self, vals):
        return self.val

class Identity:
    def apply(self, val):
        return val

class Index:

    def __init__(self, i):
        self.index = i

    def apply(self, vals):
        return vals[self.index]


class IndexValue:

    def __init__(self, index, val):
        self.index = index
        self.val = val

    def matches(self, data):
        # print("MATCHES", data, self.val)
        if self.val == Any:
            return True
        val = data[self.index]

        # print("MATCHES2", val == self.val)
        return val == self.val

class Match(Func):

    def __init__(self, fn):
        self.fn = fn

    def apply(self, values):
        i = 0
        res = []
        pattern_length = self.fn.length()
        length = len(values)

        while i < length:
            matched = False
            j = i + pattern_length
            if j > length:
                res += values[i:]
                # print("break", i, j)
                break

            # print("i,j", i, j)
            chunk = values[i:j]
            val = self.fn.apply(chunk)
            if val is not None:
                res = res + val
                i = j
            else:
                res.append(values[i])
                i += 1
            # print("i*j", i, j, chunk, val, res)

        return res


class Exact(Func):

    def __init__(self, what, val):
        self.what = what
        self.val = val

    def length(self):
        return len(self.what)

    def apply(self, vals):
        if vals == self.what:
            return self.val
        return None

class Mask:

    def __init__(self, source, dest):
        self.source = source
        self.dest = dest

    def length(self):
        return len(self.source)

    def apply(self, vals):
        for index_val in self.source:
            if not index_val.matches(vals):
                return None

        res = []
        for attr in self.dest:
            val = attr.apply(vals)
            res.append(val)
        return res


class Reducer():

    def reduce(self, vals, acc):
        pass


class ConcatEqualColumnsReducer(Reducer):

    def reduce(self, vals, acc):
        last = acc[len(acc) - 1]
        # print("ACC", last, acc)
        if is_equal_lists(vals, last):
            last += vals
        else:
            acc.append(vals)

        # print("ACC2", last, acc)
        return acc


# filter (contains 1)
# map (filter (not (contains 1)))
# map (append [1])
# map (map (replace 1 -> 0 1))
# map (reverse)
# map (intersperse 1)
# intersperse [1 1 1 1 1]


reduce_concat_equal = Reduce(ConcatEqualColumnsReducer())

map_filter_0 = Map(
    Filter(
        Equal(0)
    )
)

map_filter_not_0 = Map(
    Filter(
        Not(
            Equal(0)
        )
    )
)
map_filter_not_1 = Map(
    Filter(
        Not(
            Equal(1)
        )
    )
)
map_filter_1 = Map(
    Filter(
        Equal(1)
    )
)

filter_contains_0 = Filter(
    Contains(0)
)

filter_contains_1 = Filter(
    Contains(1)
)

replace_0_1 = Map(
    Match(
        Exact([0], [1])
    )
)

replace_1_0 = Map(
    Match(
        Exact([0], [1])
    )
)

Any = -1


replace_0a_a = Map(
    Match(
        Mask(
            [IndexValue(0, 0), IndexValue(1, Any)],
            [Index(1)]
        )
    )
)

replace_0a_a0 = Map(
    Match(
        Mask(
            [IndexValue(0, 0), IndexValue(1, Any)],
            [Index(0), Value(0)]
        )
    )
)

replace_a1_1 = Map(
    Match(
        Mask(
            [IndexValue(0, Any), IndexValue(1, 1)],
            [Value(1)]
        )
    )
)

intersperse_0 = Map(
        Match(
            Mask(
                [Value(Any)],
                [Index(0), Value(0)]
            )
        )
    )

# intersperse_0 = Intersperse(Zero())
# intersperse_1 = Intersperse(One())
# intersperse_a_1a = Intersperse(One())