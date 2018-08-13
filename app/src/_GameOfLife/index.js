
const GRID_WIDTH = 10;
const GRID_HEIGHT= 10;
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 800;
const INTERVAL = 100;
const STEPS = -1;
// const cell_width = 30;
// const cell_height = 30;
const CELL_MARGIN = 5;
const COLOR_ALIVE = "#669999"
const COLOR_BLACK = "#000"
const COLOR_DEAD = "#ccc"

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

    drawText(x, y, txt) {
        var xp = x * this.marginX + this.cellWidth/2;
        var yp = y * this.marginY + this.cellHeight/2;
        this.ctx.fillStyle = COLOR_BLACK;
        this.ctx.font = "20px Arial"
        this.ctx.fillText(txt, xp, yp) 
    }

    drawCell(x, y, cell) {
        var color;
        if (cell == 1) {
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
        this.renderer = renderer;
        this.width = width;
        this.height = height;
        this.size = this.width * this.height;
        this.finished = false;
        
        this.cells = new Array(this.size);
        this.cells = this.cells.fill(0, 0, this.size).map(
            (val, index, arr) => {
                return Math.round(Math.random());
        });
    }


    index(x, y){
        if (x < 0 || x >= this.width || y < 0 || y > this.height) {
            return -1;
        }
        return y * this.width + x;
    }

    get(x, y) {
        var index = this.index(x, y);
        if (index == -1){
            return undefined;
        }

        // console.log("cells", index, this.cells, this.cells[index]);
        return this.cells[index];
    }

    judge(cell, count) {

        if(cell == 0) {
            if (count == 3) {
                return 1;
            }
            return 0;
        }
        if(count < 2) {
            return 0;
        } else if (count < 4) {
            return 1;
        } else {
            return 0;
        }
    }

    render(){
        this.renderer.begin();
        for(var x = 0; x < this.width; x++ ){
            for(var y = 0; y < this.height; y++) {
                var index = this.index(x, y);
                var cell = this.cells[index];
                
                this.renderer.drawCell(x, y, cell);
                var count = this.calculate(x, y);
                this.renderer.drawText(x, y, count.toString());
            }
        }
        this.renderer.end();

    }

    update() {
        if (this.finished) {
            console.log("Finished");
            
            return;
        }

        this.render();
        var newCells = new Array(this.size);
        var finished = true;
        for(var x = 0; x < this.width; x++ ){
            for(var y = 0; y < this.height; y++) {
                var index = this.index(x, y);
                var cell = this.cells[index];
                var count = this.calculate(x, y);
                var newCell = this.judge(cell, count);
                if (newCell != 0){
                    finished = false;
                }
                newCells[index] = newCell;
            }
        }
        this.finished = finished;
        this.cells = newCells;
    }

    countNeighbors(x, y) {
        var cell = this.get(x, y);
        if (cell == 1) {
            return 1;
        }
        return 0;
    }

    calculate(x, y){
        var index = this.index(x, y);
        var count = 0;
        count += this.countNeighbors(x, y + 1);
        count += this.countNeighbors(x, y - 1);

        count += this.countNeighbors(x + 1, y);
        count += this.countNeighbors(x - 1, y);

        count += this.countNeighbors(x - 1, y + 1);
        count += this.countNeighbors(x - 1, y - 1);

        count += this.countNeighbors(x + 1, y - 1);
        count += this.countNeighbors(x + 1, y + 1);

        return count;
    }

    isRunning(){
        return this.interval != undefined;
    }

    stop() {
        console.log("interval", this.interval);
        if(!this.isRunning()){
            console.log("NOT RUNNING");
            return;
        }

        clearInterval(this.interval);
        this.interval = undefined;
    }

    loop(count, interval) {
        if (this.isRunning()) {
            console.log("ALREADY RUNNING");
            return;
        }
        console.log("FINISHED", this.finished);
        if(this.finished) {
            return;
        }

        // this.update();
        var infinite = count == -1
        var self = this;

        self.interval = setInterval(
            function() {
                if(infinite){
                    self.update();
                    return
                }

                if(count == 0){
                    self.stop();
                    return;
                }

                count -= 1;
                // console.log("COUTN", count);
                self.update();
            },
            interval
       );
        // calculate();
    }
}

var game;
function gameOfLife() {
    var canvas = document.getElementById("grid")
    var ctx = canvas.getContext("2d");

    ctx.strokeStyle = "rgb(0, 0, 0)";

    ctx.canvas.width = VIEW_WIDTH;
    ctx.canvas.height = VIEW_HEIGHT;

    var cellwidth = (VIEW_WIDTH / GRID_WIDTH) - CELL_MARGIN;
    var cellheight = (VIEW_HEIGHT / GRID_HEIGHT) - CELL_MARGIN;
    var render = new Renderer(ctx, VIEW_WIDTH, VIEW_HEIGHT, cellwidth, cellheight, CELL_MARGIN);

    function startGame(){
        if (game != undefined){
            game.stop();
        }

        game = new Game(render, GRID_WIDTH, GRID_HEIGHT);
        game.update();
        document.getElementById("next").onclick = function() {
            if (game.interval) {
                return;
            }
            game.update();
        }

        document.getElementById("loop").onclick = function() {
            game.loop(STEPS, INTERVAL);
        }

        document.getElementById("stop").onclick = function() {
            console.log("stop");
            game.stop();
        }

    }
    document.getElementById("start").onclick = function() {
        startGame();
    }
    startGame();
}


document.addEventListener('DOMContentLoaded', function() {
    gameOfLife();
}, false);

