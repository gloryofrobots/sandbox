
class Game {
    constructor(renderer, width, height, onUpdate) {
        this.renderer = renderer;
        this.width = width;
        this.height = height;
        this.size = this.width * this.height;
        this.finished = false;
        this.onUpdate = onUpdate;
        this._generation = 0;
        this.cells = new Array(this.size);
        this.cells = this.cells.fill(0, 0, this.size).map(
            (val, index, arr) => {
                return Math.round(Math.random());
        });
        this.initialCells = this.cells.slice();
    }
    get generation(){
        return this._generation;
    }

    rewind(){
        this.finished = false;
        this._generation = 0;
        this.cells = this.initialCells.slice();
        this.onUpdate(this);
    }

    index(x, y){
        if (x < 0 || x >= this.width || y < 0 || y > this.height) {
            return -1;
        }
        return y * this.width + x;
    }

    get(x, y) {
        var index = this.index(x, y);
        if (index === -1){
            return undefined;
        }

        // console.log("cells", index, this.cells, this.cells[index]);
        return this.cells[index];
    }

    judge(cell, count) {
        throw new Error("abstract");
    }

    render(){
        this.renderer.begin();
        for(var x = 0; x < this.width; x++ ){
            for(var y = 0; y < this.height; y++) {
                var index = this.index(x, y);
                var cell = this.cells[index];
                
                this.renderer.drawCell(x, y, cell);
                this.calculate(x, y);
                // this.renderer.drawText(x, y, count.toString());
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
                if (newCell !== 0){
                    finished = false;
                }
                newCells[index] = newCell;
            }
        }
        this._generation += 1;
        this.onUpdate(this);
        this.finished = finished;
        this.cells = newCells;
    }

    countNeighbors(x, y) {
        var cell = this.get(x, y);
        if (cell === 1) {
            return 1;
        }
        return 0;
    }

    calculate(x, y){
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
        return this.interval !== undefined;
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

    run(count, interval) {
        console.log("RUN", count, interval, this.isRunning(), this.finished);
        if (this.isRunning()) {
            console.log("ALREADY RUNNING");
            return;
        }
        console.log("FINISHED", this.finished);
        if(this.finished) {
            return;
        }

        // this.update();
        var infinite = count === -1;
        var self = this;

        self.interval = setInterval(
            function() {
                if(infinite){
                    self.update();
                    return
                }

                if(count === 0){
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

class GameOfLife extends Game {

    judge(cell, count) {
        if(cell === 0) {
            if (count === 3) {
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
}

export default GameOfLife;