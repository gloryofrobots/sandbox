
class Renderer {
    constructor(ctx, colors, width, height, cellwidth, cellheight, cellmargin){
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.colors = colors;
        this.cellRectRadius = 5;
        this.cellWidth = cellwidth;
        this.cellHeight = cellheight;
        this.margin = cellmargin;
        this.marginX = this.cellWidth + this.margin;
        this.marginY = this.cellHeight + this.margin;
        console.log(this);
    }

    setColors(c){
        this.colors = c;
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
        this.ctx.fillStyle = "#000";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(txt, xp, yp);
    }

    drawCell(x, y, cell) {
        // console.log("DRAW", x, y, cell);
        var color = this.colors[cell];

        var xp = x * this.marginX;
        var yp = y * this.marginY;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(xp, yp, this.cellWidth,this.cellHeight);
    }
}    

export default Renderer;