
import * as pixi from 'pixi.js'

const grid_width = 30;
const grid_height = 30;
const view_width = 800;
const view_height = 800;
// const cell_width = 30;
// const cell_height = 30;
const cell_margin = 5;

class renderer {
    constructor(width, height, cellwidth, cellheight, cellmargin){
        this.width = width;
        this.height = height;
        this.app = new pixi.application(width, height, { antialias:false, forcecanvas:true });
        document.body.appendchild(this.app.view);
        this.graphics = new pixi.graphics();
        this.cellrectradius = 5;
        this.cellwidth = cellwidth;
        this.cellheight = cellheight;
        this.margin = cellmargin;
        this.marginx = this.cellwidth + this.margin;
        this.marginy = this.cellheight + this.margin;
    }

    begin(){
        this.graphics.linestyle(2, 0xff00ff, 1);
        this.graphics.beginfill(0xff00bb, 0.25);
    }
    end() {
        this.graphics.endfill();
        this.app.stage.addchild(this.graphics);
    }
    drawcell(x, y) {
        // var xp = x * this.marginx;
        // var yp = y * this.marginy;
        var xp = (x * this.cellwidth) + this.margin;
        var yp = (y * this.cellheight) + this.margin;
        this.graphics.drawroundedrect(xp, yp, this.cellwidth, this.cellheight, this.cellrectradius);
    }
}    

class game {
    constructor(renderer, width, height) {
        this.width = width;
        this.height = height;
        this.render = renderer;
    }
    update() {
        this.render.begin();
        for(var x = 0; x < this.width; x++ ){
            for(var y = 0; y < this.height; y++) {
                this.render.drawcell(x, y);
            }
        }
        this.render.end();
    }
}

function game() {
    var cellwidth = (view_width / grid_width) - cell_margin;
    var cellheight = (view_height / grid_height) - cell_margin;
    var render = new renderer(view_width, view_height, cellwidth, cellheight, cell_margin);
    var game = new game(render, grid_width, grid_height);
    game.update();

}

document.addeventlistener('domcontentloaded', function() {
    game();
}, false);

s