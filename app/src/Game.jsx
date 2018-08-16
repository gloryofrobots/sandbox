function randi(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Game {
    constructor(renderer, width, height, onUpdate, props) {
        this.renderer = renderer;

        this.width = width;
        this.height = height;
        this.size = this.width * this.height;
        this.onUpdate = onUpdate;
        this._generation = 0;
        this.props = props;
        this.cells = new Array(this.size);
        this.cells = this.cells.fill(0, 0, this.size).map(
            (val, index, arr) => {
                return this.genCell();
        });
        this.initialCells = this.cells.slice();
    }

    get generation(){
        return this._generation;
    }

    genCell(){
        return Math.round(Math.random());
    }

    rewind(){
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
        this.render();
        var newCells = new Array(this.size);
        for(var x = 0; x < this.width; x++ ){
            for(var y = 0; y < this.height; y++) {
                var index = this.index(x, y);
                var cell = this.cells[index];
                var newCell = this.calculate(cell, index, x, y);
                newCells[index] = newCell;
            }
        }
        this._generation += 1;
        this.onUpdate(this);
        this.cells = newCells;
    }

    calculate(cell, index, x, y){
        throw new Error("abstract!");
    }


    isRunning(){
        return this.interval !== undefined;
    }

    stop() {
        console.log("STOP interval", this.interval);
        if(!this.isRunning()){
            console.log("NOT RUNNING");
            return;
        }

        clearInterval(this.interval);
        this.interval = undefined;
    }

    run(count, interval) {
        console.log("RUN", count, interval, "Runing", this.isRunning());
        if (this.isRunning()) {
            console.log("ALREADY RUNNING");
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
    countNeighbors(x, y) {
        var cell = this.get(x, y);
        if (cell === 1) {
            return 1;
        }
        return 0;
    }

    calculate(cell, index, x, y){
        var count = 0;
        count += this.countNeighbors(x, y + 1);
        count += this.countNeighbors(x, y - 1);

        count += this.countNeighbors(x + 1, y);
        count += this.countNeighbors(x - 1, y);

        count += this.countNeighbors(x - 1, y + 1);
        count += this.countNeighbors(x - 1, y - 1);

        count += this.countNeighbors(x + 1, y - 1);
        count += this.countNeighbors(x + 1, y + 1);

        return this.judge(cell, count);
    }

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

// class Seeds extends GameOfLife {

//     judge(cell, count) {
//         if(cell === 1) {
//             return 0;
//         }

//         if (count === 2) {
//             return 1;
//         }

//         return 0;
//     }
// }

class BriansBrain extends GameOfLife {
    genCell(){
        var cell =  randi(0, 2);
        return cell;
    }

    judge(cell, count) {
        if(cell === 1) {
            // Dying
            return 2;
        }
        if (cell === 2) {
            return 0;
        }
        if(count === 2) {
            return 1
        }
        return 0;
    }
}

class Cyclic2D extends Game {
    genCell(){
        var maxValue = 2;
        var cell = randi(0, maxValue);
        return cell;
    }

    calculate(cell, index, x, y){
        // var threshold = this.props.threshold;
        // var maxValue = this.props.maxValue;
        var threshold = 1;
        var maxValue = 2;
        var next;
        if(cell === maxValue) {
            next = 0;
        } else {
            next = cell + 1;
        }
        
        for (var x1 = x - 1; x1 < x + 1; x1++){
            for (var y1 = y - 1; y1 < y + 1; y1++){
                if(x1 === x && y1 === y) {
                    continue;
                }

                var neighbor = this.get(x1, y1);
                if(neighbor === next) {
                    threshold--;
                    if (threshold === 0){
                        return next;
                    }
                }
            }
        }
        return cell;
    }
}

export default Cyclic2D;