import unittest
from puzzle.grid import (from2dlist, DGrid, UGrid, LGrid, RGrid, X)


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


class TestGrid(unittest.TestCase):

    def test(self):
        DATA = [
            [X, 0, 1, X],
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [1, 1, 0, 1],
            [1, 0, 1, 1],
            [0, 1, 1, 1],
        ]

        grid = from2dlist(DATA)

        dgrid = DGrid(grid)
        ugrid = UGrid(dgrid)
        lgrid = LGrid(ugrid)
        rgrid = RGrid(lgrid)
        dgrid2 = DGrid(rgrid)

        self.assertEqual(
            dgrid.canonical_cols(),
            [[0, 1, 1, 0, 1, None], [1, 0, 1, 1, 0, 0],
                [1, 1, 0, 1, 0, 1], [1, 1, 1, 0, 1, None]]
        )

        self.assertEqual(
            ugrid.canonical_cols(),
            [[None, 0, 1, 1, 0, 1], [1, 0, 1, 1, 0, 0],
                [1, 1, 0, 1, 0, 1], [None, 1, 1, 1, 0, 1]]
        )

        self.assertEqual(
            lgrid.canonical_cols(),
            [[None, 0, 1, 1, 0, 1], [None, 0, 1, 1, 0, 0],
                [1, 1, 0, 1, 0, 1], [1, 1, 1, 1, 0, 1]]
        )

        self.assertEqual(
            rgrid.canonical_cols(),
            [[1, 0, 1, 1, 0, 1], [1, 0, 1, 1, 0, 0],
                [None, 1, 0, 1, 0, 1], [None, 1, 1, 1, 0, 1]]
        )

        self.assertEqual(
            dgrid2.canonical_cols(),
            [[1, 0, 1, 1, 0, 1], [1, 0, 1, 1, 0, 0],
                [1, 0, 1, 0, 1, None], [1, 1, 1, 0, 1, None]]
        )

        #####################################################################

        self.assertEqual(
            dgrid.canonical_rows(),
            [[0, 1, 1, 1], [1, 0, 1, 1], [1, 1, 0, 1],
                [0, 1, 1, 0], [1, 0, 0, 1], [None, 0, 1, None]],
        )
        self.assertEqual(
            ugrid.canonical_rows(),
            [[None, 1, 1, None], [0, 0, 1, 1], [1, 1, 0, 1],
                [1, 1, 1, 1], [0, 0, 0, 0], [1, 0, 1, 1]]
        )

        self.assertEqual(
            lgrid.canonical_rows(),
            [[None, None, 1, 1], [0, 0, 1, 1], [1, 1, 0, 1],
                [1, 1, 1, 1], [0, 0, 0, 0], [1, 0, 1, 1]]
        )

        self.assertEqual(
            rgrid.canonical_rows(),
            [[1, 1, None, None], [0, 0, 1, 1], [1, 1, 0, 1],
                [1, 1, 1, 1], [0, 0, 0, 0], [1, 0, 1, 1]]
        )

        self.assertEqual(
            dgrid2.canonical_rows(),
            [[1, 1, 1, 1], [0, 0, 0, 1], [1, 1, 1, 1],
                [1, 1, 0, 0], [0, 0, 1, 1], [1, 0, None, None]]
        )
        # print_grids(dgrid, ugrid, lgrid, rgrid, dgrid2)


if __name__ == '__main__':
    unittest.main()
