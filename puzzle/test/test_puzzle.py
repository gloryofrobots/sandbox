import unittest

from puzzle.grid import X
from puzzle import (grid, puzzle)

class TestPuzzle(unittest.TestCase):

    def assert_puzzle(self, data, expected, commands, display=False):
        p = puzzle.create(data)
        for name in commands:
            p.push(name)
        # print(p.current().canonical_rows())
        if display:
            p.display()
        expected = list(reversed(expected))
        self.assertEqual(p.current().canonical_rows(), expected)


    def test0_3(self):
        self.assert_puzzle(
            data = [
                [1, X, X, X, X, 1],
                [0, 1, X, X, 1, 0],
                [0, 0, 1, 1, 0, 0],
            ],
            expected = [
                [0,0,0,0,0,0],
                [1,1,1,1,1,1],
            ],
            commands = [
                "map_reject_0",
                "map_append_0",
            ]
        )

    def test0_4(self):
        self.assert_puzzle(
            data = [
                [1, X, X, X, X, 1],
                [0, 1, X, X, 1, 0],
                [0, 0, 1, 1, 0, 0],
            ],
            expected = [
                [1,1,1,1,1,1],
                [0,0,0,0,0,0],
                [1,1,1,1,1,1],
            ],
            commands = [
                "map_reject_0",
                "map_append_0",
                "map_replace_0_01",
            ],
        )

    def test1_4(self):
        self.assert_puzzle(
            data = [
                [1, 0, 0, 2],
                [1, 1, 2, 2],
            ],
            expected = [
                [1, 1, 1, 1],
                [1, 1, 1, 1],
            ],
            commands = [
                "map_replace_0_01",
                "map_replace_2_12",
                "map_reject_0",
                "map_reject_2",
            ],
        )

    def test2_1(self):
        self.assert_puzzle(
            data = [
                [2, 1, 1, 0, 0, 0, 1, 1, 2],
            ],
            expected = [
                [X, X, 2, X, X],
                [X, 1, 2, 1, X],
                [2, 1, 2, 1, 2],
            ],
            commands = [
                "reduce_concat_equal",
                "map_replace_0_2",
            ],
        )

    def test3_2(self):
        self.assert_puzzle(
            data = [
                [X, 1, X, 1, X],
                [1, 0, 1, 0, 1],
                [0, 0, 1, 0, 0],
            ],
            expected = [
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 1],
            ],
            commands = [
                "map_replace_0_1",
                "map_replace_11_0",
                "map_replace_0a_a",
                "map_replace_a_1a",
            ],
        )