import random
import math


class Builder:

    def __init__(self, **options):
        self.result = []
        self.options = options

    def add_times(self, val, count, **options):
        for i in range(count):
            self.add(val, **options)

    def add(self, val, **options):
        if not options:
            options = self.options
        pad_left = options.get("pad_left", "")
        pad_right = options.get("pad_right", None)
        if pad_right is None:
            pad_right = pad_left
        self.result.append(pad_left + val + pad_right)

    def nl(self):
        self.result.append("\n")

    def __str__(self):
        return "".join(self.result)


class Cell:

    class Flag:
        CLEAR = 0
        DANGER = 1
        UNSURE = 2

    def __init__(self, is_mine):
        self.x = None
        self.y = None
        self._is_mine = is_mine
        self.mines_nearby = 9

        self._is_open = False
        self.flag = Cell.Flag.CLEAR

    def set_coord(self, x, y):
        self.x = x
        self.y = y

    def set_mines_nearby(self, count):
        self.mines_nearby = count

    def is_mine(self):
        return self._is_mine

    def is_open(self):
        return self._is_open

    def open(self):
        self._is_open = True

    def is_danger(self):
        return self.flag == Cell.Flag.DANGER

    def is_unsure(self):
        return self.flag == Cell.Flag.UNSURE

    def is_clear(self):
        return self.flag == Cell.Flag.CLEAR

    def set_flag(self, flag):
        self.flag = flag
        
    def cycle_flag(self):
        if self.flag == Cell.Flag.CLEAR:
            self.flag = Cell.FLAG.DANGER
        elif self.flag == Cell.Flag.DANGER:
            self.flag = Cell.Flag.UNSURE
        elif self.flag == Cell.Flag.UNSURE:
            self.flag = Cell.Flag.CLEAR


def shuffle(array):
    count = len(array) - 1
    while count >= 0:
        i = math.floor(random.random() * count)
        t = array[count]
        array[count] = array[i]
        array[i] = t
        count -= 1


class Board:

    class State:
        IN_PROGRESS = 0
        LOSS = 1
        VICTORY = 2

    def __init__(self, height=10, width=10, count_mines=15):
        self.height = height
        self.width = width
        self.count_mines = count_mines
        self.size = self.height * self.width
        self.state = Board.State.IN_PROGRESS

        self.generate_grid()

    def generate_grid(self):
        self.grid = [None] * self.size
        mines_left = self.count_mines
        for i in range(self.size):
            if mines_left > 0:
                mine = True
                mines_left -= 1
            else:
                mine = False
            cell = Cell(mine)
            self.grid[i] = cell

        shuffle(self.grid)

        for y in range(self.height):
            for x in range(self.width):
                cell = self.get(x, y)
                cell.set_coord(x, y)
                cell.set_mines_nearby(self.find_mines_nearby(cell.x, cell.y))

    def get_mine(self, x, y):
        cell = self.get(x, y)
        if cell:
            print("GET MINE", x, y, cell.is_mine())
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

        print("FIND NEARBY", x, y, count)
        return count

    def get_index(self, x, y):
        if x < 0 or x >= self.width:
            return -1
        if y < 0 or y >= self.height:
            return -1

        return x + self.width * y

    def get(self, x, y,):
        index = self.get_index(x, y)
        if index < 0:
            return None
        return self.grid[index]

    def in_progress(self):
        return self.state == Board.State.IN_PROGRESS

    def is_victory(self):
        return self.state == Board.State.VICTORY

    def is_loss(self):
        return self.state == Board.State.LOSS

    def update_state(self):
        victory = True
        for cell in self.grid:
            if cell.is_open() and cell.is_mine():
                self.state = Board.State.LOSS
                return
            elif not cell.is_open():
                if cell.is_mine() and not cell.is_danger():
                    victory = False
            else:
                victory = False
        if victory:
            self.state = Board.State.VICTORY

    def open_cell(self, x, y):
        if not self.in_progress():
            raise RuntimeError()

        cell = self.get(x, y)
        if not cell or cell.is_open() or not cell.is_clear():
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
        if not cell or cell.is_mine() or cell.is_open() or not cell.is_clear():
            return

        cell.open()
        if cell.mines_nearby == 0:
            self._flood(x, y)

    def touch_cell(self, x, y):
        cell = self.get(x, y)
        if not cell:
            return

        cell.cycle_flag()
        self.update_state()

    def flag_cell_danger(self, x, y):
        self.flag_cell(x, y, Cell.Flag.DANGER)

    def flag_cell_unsure(self, x, y):
        self.flag_cell(x, y, Cell.Flag.UNSURE)

    def flag_cell_clear(self, x, y):
        self.flag_cell(x, y, Cell.Flag.CLEAR)

    def flag_cell(self, x, y, flag):
        cell = self.get(x, y)
        if not cell:
            return

        cell.set_flag(flag)
        self.update_state()

    def emoji(self):
        if self.state == Board.State.VICTORY:
            return ":-)"
        if self.state == Board.State.LOSS:
            return ":-("
        return ":-|"

    def cell_view(self, x, y, debug=False):
        cell = self.get(x, y)
        print("CELL_VIEW", x, y, cell.x, cell.y, cell.mines_nearby)
        if not debug:
            if cell.is_open():
                if cell.is_mine():
                    return "*"
                else:
                    return str(cell.mines_nearby)
            else:
                if cell.is_danger():
                    return "!"
                elif cell.is_unsure():
                    return "?"
                else:
                    return "-"
        else:
            if cell.is_mine():
                return "*"
            else:
                return str(cell.mines_nearby)

    def to_string(self, debug=False):
        builder = Builder(pad_left=" ", pad_right=" ")
        half = math.floor((self.width / 2 - 2))

        builder.add_times(" ", half)
        builder.add(self.emoji())
        builder.add_times(" ", half)
        builder.nl()

        def add_cols():
            builder.add(" ")
            for x in range(self.width):
                if x == 0:
                    pad_left = ":"
                else:
                    pad_left = ""
                pad_right = ":"
                builder.add("%d" % x, pad_left=pad_left, pad_right=pad_right)
            builder.nl()

        add_cols()

        for y in range(self.height):
            builder.add("%d" % y, pad_left=":")
            for x in range(self.width):
                if x == 0:
                    pad_left = "|"
                else:
                    pad_left = ""
                pad_right = "|"
                view = self.cell_view(x, y, debug)
                builder.add(view, pad_left=pad_left, pad_right=pad_right)
            builder.add("%d" % y, pad_left=":")
            builder.nl()

        add_cols()
        for cell in self.grid:
            print("cell", cell.x, cell.y, cell.mines_nearby)
        print("---------")
        for y in range(self.height):
            for x in range(self.width):
                cell = self.get(x, y)
                print("cell", cell.x, cell.y, cell.mines_nearby)
        return str(builder)

    def __str__(self):
        return self.to_string(False)


def main():
    b = Board(width = 10, height=10, count_mines=15)
    print (b.to_string(True))

    def coord(arg):
        return (int(arg[0]), int(arg[1]))
    while b.in_progress():
        command = input()

        args = [arg.strip() for arg in command.split(" ") if arg != ""]

        print(args)
        op = args[0]
        if op == "q":
            print ("GoodBuy!!!")
            return

        args = args[1:]

        if len(args) == 1:
            x, y = coord([op, args[0]])
            b.open_cell(x, y)
        elif op == "!":
            x, y = coord(args)
            b.flag_cell_danger(x, y)
        elif op == "?":
            x, y = coord(args)
            b.flag_cell_unsure(x, y)
        elif op == "-":
            x, y = coord(args)
            b.flag_cell_clear(x, y)

        print(b.to_string(debug=True))
        print(b.to_string(debug=False))


if __name__ == "__main__":
    main()
