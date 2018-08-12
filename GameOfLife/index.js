
const GRID_WIDTH = 30;
const GRID_HEIGHT= 30;
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 800;
// const cell_width = 30;
// const cell_height = 30;
const CELL_MARGIN = 5;
const COLOR_ALIVE = "#669999"
const COLOR_DEAD = "#fff"

class Renderer {
    constructor(ctx, width, height, cellwidth, cellheight, cellmargin){
        this.ctx = ctx;
        this.width = width;
        this.height = height;

        this.cellRectRadius = 5;
        this.cellWidth = cellwidth;
        this.cellHeight = cellheight;
        this.margin = cellmargin;
        this.marginX = this.cellWidth + this.margin;
        this.marginY = this.cellHeight + this.margin;
        console.log(this);
    }

    begin(){
        this.ctx.beginPath();
    }

    end() {
        this.ctx.stroke();
    }

    drawCell(x, y, alive) {
        var color;
        if (alive == true) {
            color = COLOR_ALIVE;
        } else {
            color = COLOR_DEAD;
        }

        var xp = x * this.marginX;
        var yp = y * this.marginY;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(xp, yp, this.cellWidth,this.cellHeight);
    }
}    

class Game {
    constructor(renderer, width, height) {
        this.width = width;
        this.height = height;
        this.size = this.width * this.height;
        this.render = renderer;
        this.cells = new Array(this.size);
        this.cells = this.cells.fill(0, 0, this.size).map(
            (val, index, arr) => {
                return Math.round(Math.random());
        });
    }

    index(x, y){
        return y * this.width + x;
    }

    update() {
        this.render.begin();
        for(var x = 0; x < this.width; x++ ){
            for(var y = 0; y < this.height; y++) {
                var index = this.index(x, y);
                var cell = this.cells[index];
                this.render.drawCell(x, y, cell);
            }
        }
        this.render.end();
    }
}

function game() {
    var canvas = document.getElementById("grid")
    var ctx = canvas.getContext("2d");

    ctx.strokeStyle = "rgb(0, 0, 0)";

    ctx.canvas.width = VIEW_WIDTH;
    ctx.canvas.height = VIEW_HEIGHT;

    var cellwidth = (VIEW_WIDTH / GRID_WIDTH) - CELL_MARGIN;
    var cellheight = (VIEW_HEIGHT / GRID_HEIGHT) - CELL_MARGIN;
    var render = new Renderer(ctx, VIEW_WIDTH, VIEW_HEIGHT, cellwidth, cellheight, CELL_MARGIN);
    var game = new Game(render, GRID_WIDTH, GRID_HEIGHT);
    game.update();
}

document.addEventListener('DOMContentLoaded', function() {
    game();
}, false);

