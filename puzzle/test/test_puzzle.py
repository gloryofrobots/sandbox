import unittest

class TestLib(unittest.TestCase):

    def assertGrid(self, p, name, expected):
        p.push(name)
        # print(p.current().canonical_rows())
        expected = list(reversed(expected))
        self.assertEqual(p.current().canonical_rows(), expected)
        p.reset()


    def test1_1(self):
        pass