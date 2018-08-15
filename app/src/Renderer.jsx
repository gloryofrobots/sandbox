const COLOR_ALIVE = "#669999";
const COLOR_BLACK = "#000";
const COLOR_DEAD = "#ccc";


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
        this.ctx.font = "20px Arial";
        this.ctx.fillText(txt, xp, yp) 
    }

    drawCell(x, y, cell) {
        var color;
        if (cell === 1) {
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

export default Renderer;