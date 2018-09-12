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

    def test(self):
        self.assertGrid(
            self.p0,
            "append_0",
            [
                [X, X, X, X, 0, 0, 0],
                [X, X, 0, 0, 1, 1, 1],
                [0, 0, 1, 0, 1, 1, 0],
                [1, 1, 0, 0, 0, 1, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "intersperse_0",
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
            "replace_0a_a0",
            [
                [X, X, X, X, 1, 1, 1],
                [X, X, 0, 0, 0, 1, 0],
                [1, 1, 1, 0, 1, 1, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "replace_a1_1",
            [
                [X, X, X, 0, 1, 1, 1],
                [1, 1, 1, 0, 1, 1, 0]
            ]
        )

        self.assertGrid(
            self.p0,
            "replace_0_1",
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

        self.p0.push("filter_contains_0")
        self.p0.display()
