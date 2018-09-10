
def test_grid():
    from grid import (makegrid, DGrid, UGrid, LGrid, RGrid)
    X = None

    DATA = [
        X, 0, 1, X,
        1, 0, 0, 1,
        0, 1, 1, 0,
        1, 1, 0, 1,
        1, 0, 1, 1,
        0, 1, 1, 1,
    ]

    grid = makegrid(4, DATA)

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


    dgrid = DGrid(grid)
    ugrid = UGrid(dgrid)
    lgrid = LGrid(ugrid)
    rgrid = RGrid(lgrid)
    dgrid2 = DGrid(rgrid)

    print_grids(dgrid, ugrid, lgrid, rgrid, dgrid2)
    l = [[1,2,3,4], [10, 11, 12, 13]]
    l1 = map(lambda l: list(map(lambda v: v + 1, l)), l) 
    print(list(l1))


if __name__ == "__main__":
    test_grid()