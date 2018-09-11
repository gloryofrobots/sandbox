X = None

def print_grids(*grids):
    print("-----COLS---------")
    for g in grids:
        print(g.canonical_cols())
    print("-----ROWS---------")
    for g in grids:
        print(g.canonical_rows())

    print("-----STR---------")
    for g in grids:
        print("")
        print("===" + str(g.__class__.__name__) + "===")
        print(g)

def test_grid():
    from grid import (from2dlist, DGrid, UGrid, LGrid, RGrid)

    DATA = [
        [X, 0, 1, X],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
        [1, 1, 0, 1],
        [1, 0, 1, 1],
        [0, 1, 1, 1],
    ]

    grid = from2dlist(DATA, 4)


    dgrid = DGrid(grid)
    ugrid = UGrid(dgrid)
    lgrid = LGrid(ugrid)
    rgrid = RGrid(lgrid)
    dgrid2 = DGrid(rgrid)

    print_grids(dgrid, ugrid, lgrid, rgrid, dgrid2)
    l = [[1,2,3,4], [10, 11, 12, 13]]
    l1 = map(lambda l: list(map(lambda v: v + 1, l)), l) 
    print(list(l1))

    # print("[")
    # for row in rows:
    #     print(row, ", ")
    # print("]")

def test_lib():
    import lib as l
    import grid
    DATA = [
        [X, X, X, X, 1, 1, 1],
        [X, X, 0, 0, 0, 0, 0], 
        [1, 1, 0, 0, 1, 1, 0], 
    ]

    replace = l.Map(l.Match(l.Replace([0, 0], [1, 1])))
    g = grid.from2dlist(DATA)
    # g1 = g.transform(l.reduce_concat_equal)
    g1 = g.transform(l.filter_contains_1)
    grid.display(g)
    grid.display(g1)
    print("--------------")
    print(g1)


if __name__ == "__main__":
    test_lib()