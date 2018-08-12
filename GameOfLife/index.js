
const GRID_WIDTH = 30;
const GRID_HEIGHT= 30;
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 800;
// const cell_width = 30;
// const cell_height = 30;
const CELL_MARGIN = 5;

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
    drawCell(x, y) {
        var xp = x * this.marginX;
        var yp = y * this.marginY;
        this.ctx.rect(xp, yp, this.cellWidth,this.cellHeight);
        this.ctx.fillStyle = "green";
        this.ctx.fill();
    }
}    

class Game {
    constructor(renderer, width, height) {
        this.width = width;
        this.height = height;
        this.render = renderer;
    }
    update() {
        this.render.begin();
        for(var x = 0; x < this.width; x++ ){
            for(var y = 0; y < this.height; y++) {
                this.render.drawCell(x, y);
            }
        }
        this.render.end();
    }
}

function game() {
    var ctx = document.getElementById("grid").getContext("2d");
    ctx.strokeStyle = "rgb(0, 0, 0)";
    // ctx.fillStyle = "rgba(255, 255, 0, .5)";

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

