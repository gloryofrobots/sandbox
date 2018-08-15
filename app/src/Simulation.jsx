
import React from 'react';
import Game from "./Game";
import Renderer from "./Renderer";
import Button from '@material-ui/core/Button';
import $ from "jquery";
// var $ = require("jquery");

class Simulation extends React.Component {
    constructor(props){
        super(props);
        this.state={
            controls:{
                step:true,
                stop:false,
                run:true,
                rewind:false
            }
        };
        this.needToRestart = true;
        this.onSubmit = props.onSubmit;
        console.log("SETTINGS", this.props.settings);
        this.onRewind = this.onRewind.bind(this);
        this.onStep = this.onStep.bind(this);
        this.onRun = this.onRun.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.game=undefined;
    }

    onStep() {
        if (this.game === undefined){
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

    setControls(controls){
        this.setState({controls:controls});
        this.needToRestart = false;
    }

    onUpdate(game) {
        $("#generation-counter").html(game.generation);
    }

    onRun() {
        if (this.game === undefined){
            console.log("GAME UNDEF");
            return;
        }
        if (this.game.isRunning()) {
            alert("Still running");
            return;
        }

        var settings = this.props.settings;
        this.game.run(settings.countSteps, settings.interval);
        this.setControls({
            step:false,
            stop:true,
            run:false,
            rewind:false
        });
    }

    onStop() {
        if (this.game === undefined){
            console.log("GAME UNDEF");
            return;
        }
        this.game.stop();
        this.setControls({
            step:true,
            stop:false,
            run:true,
            rewind:true
        });
    }

    onRewind() {
        if (this.game === undefined){
            console.log("GAME UNDEF");
            return;
        }
        if (this.game.isRunning()) {
            alert("Still running");
            return;
        }
        this.game.rewind();
        this.setControls({
            step:true,
            stop:false,
            run:true,
            rewind:true
        });
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

        if (this.game !== undefined) {
            this.game.stop();
        }

        this.game = new Game(render, settings.gridWidth, settings.gridHeight, this.onUpdate);
        this.game.update();
    }

    componentDidUpdate(prevProps) {
        console.log("SIM UP", this.props);
        if(this.needToRestart == true) {
            this.startSimulation();
        } else {
            this.needToRestart = true;
        }

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
                    <span  id ="generation-counter">0</span>
                    <Button variant="outlined" onClick={this.onRun} disabled={!this.state.controls.run}>Run</Button>
                    <Button variant="outlined" onClick={this.onStop} disabled={!this.state.controls.stop}>Stop</Button>
                    <Button variant="outlined" onClick={this.onStep} disabled={!this.state.controls.step}>Step</Button>
                    <Button variant="outlined" onClick={this.onRewind} disabled={!this.state.controls.rewind} >Rewind</Button>
                </p>
                 <div id="grid-wrapper"> 
                 <canvas id="grid" className="grid-view"> </canvas>
                 </div>
            </div>
        );
    }
}

export default Simulation;