
import React from 'react';
import Game from "./GameOfLife";
import Renderer from "./Renderer";
import Button from '@material-ui/core/Button';

var game;

class Simulation extends React.Component {
    constructor(props){
        super(props);
        this.onSubmit = props.onSubmit;
        console.log("SETTINGS", this.props.settings);
        this.onRewind = this.onRewind.bind(this);
        this.onStep = this.onStep.bind(this);
        this.onRun = this.onRun.bind(this);
        this.onStop = this.onStop.bind(this);
        this.game=undefined;
    }

    onStep() {
        if (this.game == undefined){
            console.log("GAME UNDEF");
            return;
        }
        if (this.game.isRunning()) {
            alert("Still running");
            return;
        }
        if (this.game.interval) {
            return;
        }
        this.game.update();
    }

    onRun() {
        if (this.game == undefined){
            console.log("GAME UNDEF");
            return;
        }
        if (this.game.isRunning()) {
            alert("Still running");
            return;
        }
        var settings = this.props.settings;
        this.game.loop(settings.countSteps, settings.interval);
    }

    onStop() {
        if (this.game == undefined){
            console.log("GAME UNDEF");
            return;
        }
        this.game.stop();
    }

    onRewind() {
        if (this.game == undefined){
            console.log("GAME UNDEF");
            return;
        }
        if (this.game.isRunning()) {
            alert("Still running");
            return;
        }
        this.game.rewind();
        this.game.update();
    }

    startSimulation() {
        var settings = this.props.settings;
        var canvas = document.getElementById("grid");
        var ctx = canvas.getContext("2d");

        ctx.strokeStyle = "rgb(0, 0, 0)";

        ctx.canvas.width = settings.canvasWidth;
        ctx.canvas.height = settings.canvasHeight;

        var cellwidth = (settings.canvasWidth/ settings.gridWidth) - settings.cellMargin;
        var cellheight = (settings.canvasHeight / settings.gridHeight) - settings.cellMargin;

        var render = new Renderer(ctx,
                                  settings.canvasWidth,
                                  settings.canvasHeight ,
                                  cellwidth,
                                  cellheight,
                                  settings.cellMargin
        );

        this.game = new Game(render, settings.gridWidth, settings.gridHeight);
        this.game.update();
    }

    componentDidUpdate(prevProps) {
        console.log("SIM UP", this.props);
        this.startSimulation();
    }

    componentDidMount() {
        console.log("SIM MOUNT", this.props);
        this.startSimulation();
    }

    render() {
        console.log("SIM RENDER", this.props.settings);
        return (
            <div>
                <p className="center">
                    <Button variant="outlined" onClick={this.onRun}>Run</Button>
                    <Button variant="outlined" onClick={this.onStop}>Stop</Button>
                    <Button variant="outlined" onClick={this.onStep}>Step</Button>
                    <Button variant="outlined" onClick={this.onRewind}>Rewind</Button>
                </p>
                <div id="grid-wrapper"> 
                <canvas id="grid" className="grid-view"> </canvas>
                </div>
            </div>
        );
    }
}

export default Simulation;