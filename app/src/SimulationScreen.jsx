
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

        this.game.run(this.props.settings.interval);
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
        this.game.render();
    }

    componentDidMount() {
        console.log("SIM MOUNT", this.props);
        this.newGame();
    }

    newGame() {
        var settings = this.props.settings;
        console.log("--------------------------SIM NEW GAME", settings);
        var automatonType = automaton(settings.family);
        if (!automatonType){
            alert("Error wrong type");
            return;
        }

        var newGame;
        try {
            var canvas = document.getElementById("grid");

            var counter = $("#generation-counter");
            const onRender = (game) => {
                counter.html(" GEN: " + this.generation + "");
            };
            var render = new Renderer(canvas, settings, onRender);

            newGame = new automatonType(
                render, settings.params, settings.gridWidth,
                settings.gridHeight, onRender,
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
        this.game.randomize();
    }

    randomize() {
        if(this.game.isRunning()) {
            console.log("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.randomize();
    }

    // changeInterval(settings) {
    //     this.game.setInterval(settings.interval);
    // }

    changePalette(settings) {
        this.game.setPalette(settings.palette);
    }

    changeCanvas(settings) {
        this.game.setRenderSettings(settings);
    }

    clear(){
        if(this.game.isRunning()) {
            console.log("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.clear();
    }

    load(filename){
        if(this.game.isRunning()) {
            console.log("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.load();
    }

    save(filename){
        if(this.game.isRunning()) {
            console.log("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.save(filename);
    }

    shouldComponentUpdate(nextProps, nextState) {
        var settings = nextProps.settings;
        updated = nextProps.updated;
        if(updated.length !== 1) {
            return true;
        }
        if(_.contains(updated, "palette")) {
            sim.changePalette(settings);
        } else if(updated.has("cellMargin") || updated.has("canvasWidth") || updated.has("canvasHeight")) {
            sim.changeCanvas(settings);
        } else if(updated.has("interval")) {
            this.updateFromSettings(settings);
            // sim.changeInterval(settings);
        } else {
            this.updateFromSettings(settings);
        }

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