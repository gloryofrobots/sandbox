"""
transpose :: [[a]] -> [[a]] Source
The transpose function transposes the rows and columns of its argument. For example,

>>> transpose [[1,2,3],[4,5,6]]
[[1,4],[2,5],[3,6]]
If some of the rows are shorter than the following rows, their elements are skipped:

>>> transpose [[10,11],[20],[],[30,31,32]]
[[10,20,30],[11,31],[32]]
"""
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
        for v in values:
            val = self.fn.apply(v)
            res.append(val)
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

class Not(Func):
    def __init__(self, fn):
        self.fn = fn

    def apply(self, val):
        return not self.fn(val)
    
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
    def __init__(self, val):
        self.val = val

    def apply(self, values):
        res = []
        for v in values:
            res.append(v)
            res.append(self.val)
        return res

# filter (contains 1)
# map (filter (not (contains 1)))
# map (append [1])
# map (map (replace 1 -> 0 1))
# map (reverse)
# map (intersperse 1)
# intersperse [1 1 1 1 1]


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
                print("break", i, j)
                break

            print("i,j", i, j)
            chunk = values[i:j]
            val = self.fn.apply(chunk)
            if val is not None:
                res = res + val
                i = j
            else:
                res.append(values[i])
                i += 1
            print("i*j", i, j, chunk, val, res)
            
        return res

class Replace(Func):
    def __init__(self, what, val):
        self.what = what
        self.val = val

    def length(self):
        return len(self.what)

    def apply(self, vals):
        if vals == self.what:
            return self.val
        return None
            

l = [1,0, 0, 1,0,0,0,1]
l = [0, 0, 0, 1, 0, 0]
m = Match(Replace([0, 0, 0], [1, 0]))
l1 = m.apply(l)
print(l1)
