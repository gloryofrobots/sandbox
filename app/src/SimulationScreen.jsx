
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


class SimControls extends React.Component {
    constructor(props){
        super(props);
        this.state={
            step:true,
            stop:false,
            run:true,
            rewind:true
        };

        this.onRewind = this.onRewind.bind(this);
        this.onStep = this.onStep.bind(this);
        this.onRun = this.onRun.bind(this);
        this.onStop = this.onStop.bind(this);
    }

    stop() {
        this.onStop();
    }

    onStep() {
        this.props.onStep();
    }

    onRun() {
        this.setState({
            step:false,
            stop:true,
            run:false,
            rewind:false
        });
        this.props.onRun();
    }

    onStop() {
        this.setState({
            step:true,
            stop:false,
            run:true,
            rewind:true
        });
        this.props.onStop();
    }

    onRewind() {
        this.setState({
            step:true,
            stop:false,
            run:true,
            rewind:true
        });
        this.props.onRewind();
    }

    render () {
        return (
            <p className="center">
                <span  id ="generation-counter">0</span>
                <Button variant="outlined" onClick={this.onRun} disabled={!this.state.run}>Run</Button>
                <Button variant="outlined" onClick={this.onStop} disabled={!this.state.stop}>Stop</Button>
                <Button variant="outlined" onClick={this.onStep} disabled={!this.state.step}>Step</Button>
                <Button variant="outlined" onClick={this.onRewind} disabled={!this.state.rewind} >Rewind</Button>
            </p>
        );
    }
}

class SimulationScreen extends React.Component {
    constructor(props){
        super(props);
        this.state={
        };

        console.log("Sim.NEW", this.props.settings);

        this.controls = React.createRef();
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
    }

    onStop() {
        if (this.game === undefined){
            console.log("GAME UNDEF");
            return;
        }
        this.game.stop();
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
    }

    componentDidUpdate(prevProps) {
        console.log("SIM DID UPDATE", prevProps, this.props);
        if (_.isEqual(prevProps, this.props)) {
            return;
        }

        console.log("MACKING NEW GAME");
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
                counter.html(" GEN: " + this.game.generation + "");
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
               console.error(e);
           }
       }

        if (this.game !== undefined) {
            console.log("GAME STOPPED NEW GAME");
            this.game.stop();
            this.game = undefined;
        }
        console.log("!!!!!!!!!!!!!!!!!");
        this.game = newGame;
        this.game.randomize();
    }

    randomize() {
        if(this.game.isRunning()) {
            console.error("GAME IS RUNING", this.game);
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
            console.error("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.clear();
    }

    load(filename){
        if(this.game.isRunning()) {
            console.error("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.load();
    }

    save(filename){
        if(this.game.isRunning()) {
            console.error("GAME IS RUNING", this.game);
            alert("STOP SIMULATION FIRST");
            return;
        }
        this.game.save(filename);
    }

    shouldComponentUpdate(nextProps, nextState) {
        var settings = nextProps.settings;
        var updated = nextProps.updatedSettings;

        if(_.isUndefined(settings) || _.isUndefined(updated)){
            return true;
        }

        if(this.game && this.game.isRunning()) {
            //emulate stop
            this.controls.current.stop();
        }

        console.log("SHOULD", updated);
        if(updated.length !== 1) {
            return true;
        }
        if(_.contains(updated, "palette")) {
            this.changePalette(settings);
            return false;
        } else if(_.contains(updated, "cellMargin") ||
                  _.contains(updated, "cellSize")) {
            this.changeCanvas(settings);
            return false;
        } else if(_.contains(updated, "interval")) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        console.log("SIM RENDER", this.props.settings);
        return (
            <div>
              <SimControls
                ref={this.controls}
                onRun={this.onRun}
                onStop={this.onStop}
                onStep={this.onStep}
                onRewind={this.onRewind}
                />
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