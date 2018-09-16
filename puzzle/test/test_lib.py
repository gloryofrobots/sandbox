import unittest

from puzzle.grid import X
from puzzle import (grid, puzzle)


class TestLib(unittest.TestCase):

    def assertGrid(self, p, name, expected):
        p.push(name)
        # print(p.current().canonical_rows())
        expected = list(reversed(expected))
        self.assertEqual(p.current().canonical_rows(), expected)
        p.reset()

    def setUp(self):
        DATA = [
            [X, X, X, X, 1, 1, 1],
            [X, X, 1, 0, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 0],
        ]

        self.p0 = puzzle.create(DATA)

        DATA = [
            [0, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 1],
        ]

        self.p1 = puzzle.create(DATA)

        DATA = [
            [0, 0, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0],
            [1, 0, 1, 1, 0, 0, 1],
        ]

        self.p2 = puzzle.create(DATA)

    def test(self):
        self.assertGrid(
            self.p0,
            "map_append_0",
            [
                [X, X, X, X, 0, 0, 0],
                [X, X, 0, 0, 1, 1, 1],
                [0, 0, 1, 0, 1, 1, 0],
                [1, 1, 0, 0, 0, 1, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_intersperse_0",
            [
                [X, X, X, X, 0, 0, 0],
                [X, X, X, X, 1, 1, 1],
                [X, X, 0, 0, 0, 0, 0],
                [X, X, 1, 0, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 1, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_replace_0a_a0",
            [
                [X, X, X, X, 1, 1, 1],
                [X, X, 0, 0, 0, 1, 0],
                [1, 1, 1, 0, 1, 1, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_replace_a1_1",
            [
                [X, X, X, 0, 1, 1, 1],
                [1, 1, 1, 0, 1, 1, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_replace_0_1",
            [
                [X, X, X, X, 1, 1, 1],
                [X, X, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_filter_1",
            [
                [X, X, X, X, 1, X],
                [X, X, X, 1, 1, X],
                [1, 1, 1, 1, 1, 1]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_filter_0",
            [
                [X, 0, X, 0],
                [0, 0, 0, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "filter_contains_0",
            [
                [X, X, 1, 1],
                [1, 0, 1, 0],
                [0, 0, 0, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_reverse",
            [
                [X, X, X, X, 0, 1, 0],
                [X, X, 0, 0, 1, 1, 0],
                [1, 1, 1, 0, 1, 1, 1]
            ]
        )

        self.assertGrid(
            self.p1,
            "reduce_concat_equal",
            [
                [X, 1, X, 0, X],
                [X, 1, X, 0, X],
                [0, 1, 0, 0, 0],
                [0, 1, 1, 0, 1]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_reduce_and",
            [
                [1, 1, 0, 0, 0, 1, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_reduce_or",
            [
                [1, 1, 1, 0, 1, 1, 1]
            ]
        )

        self.assertGrid(
            self.p2,
            "map_sort_asc",
            [
                [1, 1, 1, 1, 0, 1, 1],
                [0, 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]
            ]
        )

        self.assertGrid(
            self.p2,
            "map_sort_desc",
            [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0],
                [1, 1, 1, 1, 0, 1, 1]
            ]
        )

        self.assertGrid(
            self.p0,
            "transpose",
            [
                [0, X, X],
                [1, X, X],
                [0, 0, X],
                [0, 1, X],
                [0, 1, 1],
                [1, 0, 1],
                [1, 1, 1]
            ]
        )


        self.assertGrid(
            self.p0,
            "map_reduce_xor",
            [
                [1, 1, 1, 0, 0, 1, 1]
            ]
        )

        self.assertGrid(
            self.p0,
            "map_delete",
            [
                [X, X, 1, 1, 1],
                [1, 0, 1, 1, 0]
            ]
        )

        self.assertGrid(
            self.p2,
            "map_swap",
            [
                [1, 0, 1, 1, 0, 0, 1],
                [0, 0, 1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 1, 0]
            ]
        )

        # self.p2.push("map_swap")
        # self.p2.display()
