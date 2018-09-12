X = None
import unittest



def test_lib():
    import puzzle 
    import grid
    DATA = [
        [X, X, X, X, 1, 1, 1],
        [X, X, 1, 0, 1, 1, 0], 
        [1, 1, 0, 0, 0, 1, 0], 
    ]

    p = puzzle.create(DATA)
    p.push("append_0")
    p.push("append_1")
    p.pop()
    p.display()


if __name__ == "__main__":
    test_lib()