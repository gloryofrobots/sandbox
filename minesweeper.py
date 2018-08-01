import random
import math


class Cell:

    class Flag:
        CLEAR = 0
        MARKED = 1
        UNSURE = 2

    def __init__(self, x, y, is_mine):
        self.x = x
        self.y = y
        self._is_mine = is_mine
        self.mines_nearby = 0

        self._is_open = False
        self.flag = Cell.Flag.NONE

    def set_mines_nearby(self, count):
        self.mines_nearby = count

    def is_mine(self):
        return self._is_mine

    def is_open(self):
        return self._is_open

    def open(self):
        self._is_open = True

    def is_marked(self):
        return self.flag = Cell.Flag.MARKED

    def is_unsure(self):
        return self.flag = Cell.Flag.UNSURE

    def is_clear(self):
        return self.flag = Cell.Flag.CLEAR

    def cycle_flag(self):
        if self.flag == Cell.Flag.CLEAR:
            self.flag = Cell.FLAG.MARKED
        elif self.flag == Cell.Flag.MARKED:
            self.flag = Cell.Flag.UNSURE
        elif self.flag == Cell.Flag.UNSURE:
            self.flag = Cell.Flag.CLEAR
        

def shuffle(array):
    count = len(array)
    while count > 0:
        i = math.floor(random.random() * count):
        t = array[count]
        array[count] = array[i]
        array[i] = t
        count -= 1


class Board:

    class State:
        IN_PROGRESS = 0
        LOST = 1
        WON = 2

    def __init__(self, height=10, width=10, count_mines=15):
        self.height = height
        self.width = width
        self.count_mines = count_mines
        self.size = self.height * self.width
        self.state = IN_PROGRESS

        self.generate_grid(mines)

    def generate_grid(self, mines):
        self.grid = [None] * self.size
        mines_left = self.count_mines
        for x in range(self.width):
            for y in range(self.height):
                index = self.get_index(x, y)
                if mines_left > 0:
                    mine = True
                    mines_left -= 1
                else:
                    mine = False
                cell = Cell(x, y, mine)
                self.grid[index] = cell

        shuffle(self.grid)

        for cell in self.grid:
            cell.set_mines_nearby(self.find_mines_nearby(cell.x, cell.y))

    def get_mine(self, x, y):
        cell = self.get(x, y)
        if not cell or not cell.is_mine():
            return 0
        return 1

    def find_mines_nearby(self, x, y):
        count = 0

        count += self.get_mine(x, y + 1)
        count += self.get_mine(x, y - 1)

        count += self.get_mine(x - 1, y)
        count += self.get_mine(x + 1, y)

        count += self.get_mine(x + 1, y + 1)
        count += self.get_mine(x - 1, y + 1)

        count += self.get_mine(x + 1, y - 1)
        count += self.get_mine(x - 1, y - 1)

        return count

    def get_index(self, x, y):
        if self.x < 0 or self.x >= self.width:
            return -1
        if self.y < 0 or self.y >= self.height:
            return -1

        return x + self.width * y

    def get(self, x, y,):
        index = self.get_index(x, y)
        if index < 0:
            return None
        return self.grid[index]

    def in_progress(self):
        return self.state == Board.State.IN_PROGRESS

    def open_cell(self, x, y):
        if not self.in_progress():
            raise RuntimeError()

        cell = self.get(x, y)
        if cell.is_open() or cell.is_marked():
            return

        cell.open()
        if not cell.is_mine():
            self._flood(x, y)
        self.update_state()

    def _flood(self, x, y):
        self.flood_fill(x + 1, y)
        self.flood_fill(x - 1, y)
        self.flood_fill(x, y + 1)
        self.flood_fill(x, y - 1)
        self.flood_fill(x - 1, y - 1)
        self.flood_fill(x + 1, y - 1)
        self.flood_fill(x - 1, y + 1)
        self.flood_fill(x + 1, y + 1)
        
    def flood_fill(self, x, y):
        cell = self.get(x, y)
        if not cell or cell.is_mine() or cell.is_open() or cell.is_marked():
            return

        cell.open()
        if cell.mines_nearby == 0:
            self._flood(x, y)
        
    def touch_cell(self, x, y, flag):
        cell = self.get(x, y)
        if not cell:
            return

        cell.cycle_flag()
        self.update_state()

    def flag_cell(self, x, y, flag):
        pass
