
class Renderer {
    constructor(canvas, settings, onRender){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.strokeStyle = "rgb(0, 0, 0)";
        this.onRender = onRender;

        this.setSettings(settings);
    }

    setSettings(settings) {
        var cellwidth = (settings.canvasWidth/ settings.gridWidth) - settings.cellMargin;
        var cellheight = (settings.canvasHeight / settings.gridHeight) - settings.cellMargin;

        this.ctx.canvas.width = settings.canvasWidth;
        this.ctx.canvas.height = settings.canvasHeight;

        this.colors = settings.palette;
        this.cellWidth = cellwidth;
        this.cellHeight = cellheight;

        this.margin = settings.cellMargin;
        this.marginX = this.cellWidth + this.margin;
        this.marginY = this.cellHeight + this.margin;
    }

    setPalette(c){
        this.colors = c;
    }

    begin(){
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    end() {
        this.ctx.stroke();
        this.onRender();
    }

    drawText(x, y, txt) {
        var xp = x * this.marginX + this.cellWidth/2;
        var yp = y * this.marginY + this.cellHeight/2;
        this.ctx.fillStyle = "#000";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(txt, xp, yp);
    }

    drawCell(x, y, cell) {
        var color = this.colors[cell];

        var xp = x * this.marginX;
        var yp = y * this.marginY;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(xp, yp, this.cellWidth,this.cellHeight);
    }
}    

export default Renderer;