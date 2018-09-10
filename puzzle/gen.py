from PIL import (Image, ImageDraw)
from collections import namedtuple
import math
from grid import COLORS, STRINGS
import sys
IMG_SIZE = (400, 400)
MARGIN = 5
COLOR_GRID =(0,0,0,0)

def generate(no, board):
    im = Image.new("RGB", IMG_SIZE, COLOR_GRID)
    width,height = im.size
    draw = ImageDraw.Draw(im)
    # draw.line((0, 0) + im.size, fill=128)
    # draw.line((0, im.size[1], im.size[0], 0), fill=128)
    cell_width = math.floor(width / board.width)
    cell_height = math.floor(height / board.height)
    offset_x = 0
    offset_y = 0
    if(cell_width > cell_height):
        cell_side_full = cell_height
        offset_x = (width - cell_side_full * board.width) / 2
    elif cell_height > cell_width:
        cell_side_full = cell_width
        offset_y = (height - cell_side_full * board.height) / 2
        
    cell_side = cell_side_full - MARGIN
    for y in range(board.height):
        for x in range(board.width):
            index = board.width * y + x
            val = board.data[index]
            px0 = offset_x + (x * cell_side_full) 
            px1 = px0 + cell_side
            py0 = offset_y + (y * cell_side_full)
            py1 = py0 + cell_side
            color = COLORS[val]
            draw.rectangle(((px0, py0), (px1, py1)), color)

    im.show()
    # im.save("p-%d.PNG" % no, "PNG")
    # write to stdout
    # im.save(sys.stdout, "PNG")

DATA = [
    0, 1, 1, 0,
    1, 0, 0, 1,
    0, 1, 1, 0,
    1, 1, 1, 1,
    1, 1, 1, 1,
    0, 1, 1, 0,
]
Board = namedtuple('Board', ['width', 'height', 'data'])
board = Board(
    width=4,
    height=6,
    data=DATA)

generate(1, board)