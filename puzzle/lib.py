"""
transpose :: [[a]] -> [[a]] Source
The transpose function transposes the rows and columns of its argument. For example,

>>> transpose [[1,2,3],[4,5,6]]
[[1,4],[2,5],[3,6]]
If some of the rows are shorter than the following rows, their elements are skipped:

>>> transpose [[10,11],[20],[],[30,31,32]]
[[10,20,30],[11,31],[32]]
"""
from puzzle import grid
import copy

Any = -1


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
        # print("REDUXE", values)
        # vals = copy.copy(values)
        acc = self.fn.initialize(values)
        for i in range(1, len(values)):
            v = values[i]
            # print("V:", v)
            acc = self.fn.reduce(v, acc)

        return self.fn.finalize(acc)


class Scanl(Func):

    def __init__(self, fn):
        self.fn = fn

    def apply(self, values):
        # print("REDUXE", values)
        # vals = copy.copy(values)
        acc = values[0]
        res = []
        res.append(acc)
        for i in range(1, len(values)):
            v = values[i]
            # print("V:", v)
            acc = self.fn.reduce(v, acc)
            res.append(acc)

        return res


class Zip2(Func):
    def __init__(self):
        pass
        
    def apply(self, values):
        # print("REDUXE", values)
        # vals = copy.copy(values)
        res = []
        
        for i in range(0, len(values), 2):
            j = i + 1
            if j >= len(values):
                res.append(values[i])
                break
            v1 = values[i]
            v2 = values[j]
            if len(v1) > len(v2):
                 t = v1
                 v1 = v2
                 v2 = t
            vres = [] 
            for x in range(len(v1)):
                vres.append(v1[x])
                vres.append(v2[x])
                
            for x in range(len(v1), len(v2)):
                vres.append(v2[x])
            res.append(vres)

        return res


class Reducer():

    def initialize(self, values):
        return copy.copy(values[0])

    # def initialize(self, value):
    #     return value

    def finalize(self, acc):
        return acc

    def reduce(self, vals, acc):
        pass


class ConcatEqualColumnsReducer(Reducer):

    def initialize(self, values):
        return [copy.copy(values[0]), [copy.copy(values[0])]]

    def finalize(self, state):
        # print("STATE", state)
        return state[1]

    def reduce(self, vals, state):
        check, acc = state
        last = acc[len(acc) - 1]
        # print("CHECK", check, vals, acc, last)
        # print("ACC", last, acc)
        if is_equal_lists(vals, check):
            last += vals
            # print("CHECK AFTER", check is last, check, vals, acc, last)
        else:
            state[0] = copy.copy(vals)
            acc.append(copy.copy(vals))
            # print("CHECK AFTER2", check, vals, acc, last)

        # print("ACC2", last, acc)
        return state


class BinaryReducer(Reducer):

    def __init__(self, false_val, true_val):
        self.true_val = true_val
        self.false_val = false_val

    def finalize(self, val):
        return [val]


class ANDReducer(BinaryReducer):

    def reduce(self, val, acc):
        # print("AND", val, acc)
        if acc == self.true_val and val == self.true_val:
            return self.true_val
        return self.false_val


class XORReducer(BinaryReducer):
    def reduce(self, val, acc):
        if acc == self.true_val and val == self.false_val:
            return self.true_val
        elif val == self.true_val and acc == self.false_val:
            return self.true_val
        return self.false_val


class ORReducer(BinaryReducer):

    def reduce(self, val, acc):
        if acc == self.true_val or val == self.true_val:
            return self.true_val
        return self.false_val

class Sort(Func):
    def __init__(self, desc):
        self.desc = desc

    def apply(self, values):
        return sorted(values, reverse=(self.desc==True))

class Transpose(Func):

    def apply(self, values):
        values = grid.pad_end(values)
        # print(values)
        newlist = []
        i = 0
        size1 = len(values)
        size2 = len(values[0])
        # print("SIZE", size1, size2)
        while i < size2:
            j = 0
            vec = []
            while j < size1:
                vec.append(values[j][i])
                j = j + 1
            newlist.append(vec)
            i = i + 1

        newlist = grid.remove_empty(newlist)
        return newlist
    
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

class Delete(Func):
    def apply(self, values):
        res =  values[1: len(values)]
        print("DEL", values, res)
        return res


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


class Lib:

    class Transformation:

        def __init__(self, name, fn):
            self.name = name
            self.fn = fn

        def apply(self, values):
            return self.fn.apply(values)

        def __str__(self):
            return self.name

        def __repr__(self):
            return self.__str__()

    def __init__(self):
        self.trans = {}

    def add(self, name, fn):
        self.trans[name] = Lib.Transformation(name, fn)

    def get(self, name):
        return self.trans[name]

#######################################################################
##LIB DECLARATION #####################################################
#######################################################################

lib = Lib()

#################

lib.add(
    "map_filter_0",
    Map(
        Filter(
            Equal(0)
        )
    )
)

#################

# lib.add(
#     "map_filter_not_0",
#     Map(
#         Filter(
#             Not(
#                 Equal(0)
#             )
#         )
#     )
# )

#################

lib.add(
    "map_filter_1",
    Map(
        Filter(
            Equal(1)
        )
    )
)

#################

lib.add(
    "filter_contains_0",
    Filter(
        Contains(0)
    )
)

#################

lib.add(
    "filter_contains_1",
    Filter(
        Contains(1)
    )
)

#################

lib.add(
    "map_replace_0_1",
    Map(
        Match(
            Exact([0], [1])
        )
    )
)

#################

lib.add(
    "map_replace_1_0",
    Map(
        Match(
            Exact([0], [1])
        )
    )
)

#################

lib.add(
    "map_replace_0a_a",
    Map(
        Match(
            Mask(
                [IndexValue(0, 0), IndexValue(1, Any)],
                [Index(1)]
            )
        )
    )
)

#################

lib.add(
    "map_replace_0a_a0",
    Map(
        Match(
            Mask(
                [IndexValue(0, 0), IndexValue(1, Any)],
                [Index(1), Value(0)]
            )
        )
    )
)

#################


lib.add(
    "map_replace_a1_1",
    Map(
        Match(
            Mask(
                [IndexValue(0, Any), IndexValue(1, 1)],
                [Value(1)]
            )
        )
    )
)

#################

lib.add(
    "map_intersperse_0",
    Map(
        Match(
            Mask(
                [Value(Any)],
                [Index(0), Value(0)]
            )
        )
    )
)

#################

lib.add(
    "map_intersperse_1",
    Map(
        Match(
            Mask(
                [Value(Any)],
                [Index(0), Value(1)]
            )
        )
    )
)

#################

lib.add(
    "map_append_0",
    Map(
        Append([0])
    )
)

#################

lib.add(
    "map_append_1",
    Map(
        Append([1])
    )
)

#################

lib.add(
    "reduce_concat_equal",
    Reduce(ConcatEqualColumnsReducer())
)

#################

lib.add(
    "map_reverse",
    Map(
        Reverse()
    )
)

#################

lib.add(
    "map_reduce_and",
    Map(
        Reduce(ANDReducer(0, 1))
    )
)

lib.add(
    "map_reduce_or",
    Map(
        Reduce(ORReducer(0, 1))
    )
)

lib.add(
    "map_reduce_xor",
    Map(
        Reduce(XORReducer(0, 1))
    )
)

lib.add(
    "map_sort_asc",
    Map(
        Sort(False)
    )
)

lib.add(
    "map_sort_desc",
    Map(
        Sort(True)
    )
)


lib.add(
    "transpose",
    Transpose()
)

lib.add(
    "map_scanl_and",
    Map(
        Scanl(ANDReducer(0, 1))
    )
)

lib.add(
    "zip2",
    Zip2()
)

lib.add(
    "map_delete",
    Map(Delete())
)

"""
scanl is similar to foldl, but returns a list of successive reduced values from the left:
scanl f z [x1, x2, ...] == [z, z `f` x1, (z `f` x1) `f` x2, ...]


take n, applied to a list xs, returns the prefix of xs of length n, or xs itself if n > length xs:
take 5 "Hello World!" == "Hello"
take 3 [1,2,3,4,5] == [1,2,3]

drop n xs returns the suffix of xs after the first n elements, or [] if n > length xs:
drop 6 "Hello World!" == "World!"
drop 3 [1,2,3,4,5] == [4,5]
drop 3 [1,2] == []

takeWhile, applied to a predicate p and a list xs, returns the longest prefix (possibly empty) of xs of elements that satisfy p:
takeWhile (< 3) [1,2,3,4,1,2,3,4] == [1,2]
takeWhile (< 9) [1,2,3] == [1,2,3]
takeWhile (< 0) [1,2,3] == []

dropWhile p xs returns the suffix remaining after takeWhile p xs:
dropWhile (< 3) [1,2,3,4,5,1,2,3] == [3,4,5,1,2,3]
dropWhile (< 9) [1,2,3] == []
dropWhile (< 0) [1,2,3] == [1,2,3]

The group function takes a list and returns a list of lists such that the concatenation of the result is equal to the argument. Moreover, each sublist in the result contains only equal elements. For example,
>>> group "Mississippi"
["M","i","ss","i","ss","i","pp","i"]

zip :: [a] -> [b] -> [(a, b)] Source#
zip takes two lists and returns a list of corresponding pairs. If one input list is short, excess elements of the longer list are discarded.

The nub function removes duplicate elements from a list. In particular, it keeps only the first occurrence of each element. (The name nub means `essence'.) It is a special case of nubBy, which allows the programmer to supply their own equality test.
>>> nub [1,2,3,4,3,2,1,2,4,3,5]
[1,2,3,4,5]

delete x removes the first occurrence of x from its list argument. For example,
>>> delete 'a' "banana"
"bnana"

union :: Eq a => [a] -> [a] -> [a] Source#
The union function returns the list union of the two lists. For example,
>>> "dog" `union` "cow"
"dogcw"

The intersect function takes the list intersection of two lists. For example,
>>> [1,2,3,4] `intersect` [2,4,6,8]
[2,4]
If the first list contains duplicates, so will the result.
>>> [1,2,2,3,4] `intersect` [6,4,4,2]
[2,2,4]

"""