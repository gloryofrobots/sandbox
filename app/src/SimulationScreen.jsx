
import React from 'react';
import automaton from "./Automaton";
import Renderer from "./Renderer";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import $ from "jquery";
import * as Errors from "./Errors";
// var $ = require("jquery");
import PaletteEditor from "./PaletteEditor";

import _ from "underscore";

class SimulationScreen extends React.Component {
    constructor(props){
        super(props);
        this.state={
            controls:{
                step:true,
                stop:false,
                run:true,
                rewind:true
            }
        };

        console.log("Sim CONST", this.props.settings);
        this.onRewind = this.onRewind.bind(this);
        this.onStep = this.onStep.bind(this);
        this.onRun = this.onRun.bind(this);
        this.onStop = this.onStop.bind(this);
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
    }

    componentDidUpdate(prevProps) {
        console.log("SIM UP", prevProps, this.props);
        if (_.isEqual(prevProps, this.props)) {
            return;
        }

        console.log("MEKING NEW GAME");
        this.newGame();
    }

    componentDidMount() {
        console.log("SIM MOUNT", this.props);
        this.newGame();
    }

    newGame() {
        var settings = this.props.settings;
        console.log("--------------------------SIM", settings);
        var canvas = document.getElementById("grid");
        var ctx = canvas.getContext("2d");

        ctx.strokeStyle = "rgb(0, 0, 0)";

        ctx.canvas.width = settings.canvasWidth;
        ctx.canvas.height = settings.canvasHeight;

        var cellwidth = (settings.canvasWidth/ settings.gridWidth) - settings.cellMargin;
        var cellheight = (settings.canvasHeight / settings.gridHeight) - settings.cellMargin;

        var render = new Renderer(ctx,
                                  ["#ccc", "#669999", "#000", "#f0f", "#f00", "#0ff", "#ff0", "#00f", "#0f0"],
                                  settings.canvasWidth,
                                  settings.canvasHeight ,
                                  cellwidth,
                                  cellheight,
                                  settings.cellMargin
        );

        var automatonType = automaton(settings.family);
        if (!automatonType){
            alert("Error wrong type");
            return;
        }

        var newGame;
        try {

            var counter = $("#generation-counter");
            const onUpdate = (game) => {
                counter.html(" GEN: " + game.generation + "");
            };

            newGame = new automatonType(
                render, settings.params, settings.gridWidth,
                settings.gridHeight, onUpdate,
            );

       } catch(e) {
           console.log(e instanceof Errors.InvalidParamsError, Errors, e.prototype, e.constructor.prototype);
           if(e instanceof Errors.InvalidParamsError) {
               alert("Invalid automaton params");
               if(this.game) {
                   this.game.rewind();
               }

               return;
           } else {
               console.log(e);
           }
       }

        if (this.game !== undefined) {
            this.game.stop();
            this.game = undefined;
        }
        console.log("!!!!!!!!!!!!!!!!!");
        this.game = newGame;
        this.game.update();
    }

    randomize() {
        if(this.game.isRunning()) {
            console.log("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.randomize();
        this.game.update();
    }

    clear(){
        if(this.game.isRunning()) {
            console.log("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.clear();
        this.game.update();
    }

    load(filename){
        if(this.game.isRunning()) {
            console.log("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.load();
        this.game.update();
    }

    save(filename){
        if(this.game.isRunning()) {
            console.log("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.save(filename);
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
                    <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="flex-start"
                    >
                 <canvas id="grid" className="grid-view"> </canvas>
                 </Grid>
                 </div>
            </div>
        );
    }
}

export default SimulationScreen;