
class Renderer {
    constructor(canvas, settings, onRender){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.strokeStyle = "rgb(0, 0, 0)";
        this.onRender = onRender;

        this.setSettings(settings);
    }

    setSettings(settings) {
        this.cellSize = settings.cellSize;
        this.cellSizeFull = settings.cellSize + settings.cellMargin -1;

        this.ctx.canvas.width = this.cellSizeFull * settings.gridWidth;
        this.ctx.canvas.height = this.cellSizeFull * settings.gridWidth;;
        this.colors = settings.palette;
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
        var xp = x * this.cellSizeFull + this.cellSizeFull/2;
        var yp = y * this.cellSizeFull + this.cellSizeFull/2;
        this.ctx.fillStyle = "#000";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(txt, xp, yp);
    }

    drawCell(x, y, cell) {
        var color = this.colors[cell];

        var xp = x * this.cellSizeFull;
        var yp = y * this.cellSizeFull;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(xp, yp, this.cellSize,this.cellSize);
    }
}    

export default Renderer;