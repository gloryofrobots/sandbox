
import React from 'react';
import Game from "./GameOfLife";
import Renderer from "./Renderer";
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom'; // 

var game;
class Simulation extends React.Component {
    constructor(props){
        super(props);
        this.onSubmit = props.onSubmit;
        console.log("SETTINGS", this.props.settings);
    }

    startSimulation() {
        var settings = this.props.settings;

        const GRID_WIDTH = settings.gridWidth;
        const GRID_HEIGHT= settings.gridHeight;
        const VIEW_WIDTH = settings.canvasWidth;
        const VIEW_HEIGHT = settings.canvasHeight;
        const INTERVAL = settings.interval;
        const STEPS = settings.countSteps;
        // const cell_width = 30;
        // const cell_height = 30;
        const CELL_MARGIN = settings.cellMargin;

        var canvas = document.getElementById("grid");
        var ctx = canvas.getContext("2d");

        ctx.strokeStyle = "rgb(0, 0, 0)";

        ctx.canvas.width = VIEW_WIDTH;
        ctx.canvas.height = VIEW_HEIGHT;

        var cellwidth = (VIEW_WIDTH / GRID_WIDTH) - CELL_MARGIN;
        var cellheight = (VIEW_HEIGHT / GRID_HEIGHT) - CELL_MARGIN;
        var render = new Renderer(ctx, VIEW_WIDTH, VIEW_HEIGHT, cellwidth, cellheight, CELL_MARGIN);
        var self = this;

        function startGame(){
            if (game != undefined){
                game.stop();
            }

            game = new Game(render, GRID_WIDTH, GRID_HEIGHT);
            game.update();
            document.getElementById("next").onclick = function() {
                if (game.interval) {
                    return;
                }
                game.update();
            };

            document.getElementById("loop").onclick = function() {
                game.loop(STEPS, INTERVAL);
            };

            document.getElementById("stop").onclick = function() {
                console.log("stop");
                game.stop();
            };
        }
        document.getElementById("start").onclick = function() {
            startGame();
        };

        startGame();
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
                    <Button variant="outlined" id="start">Start</Button>
                    <Button variant="outlined"  id="next">Next</Button>
                    <Button variant="outlined"  id="loop">Loop</Button>
                    <Button variant="outlined"  id="stop">Stop</Button>
                </p>
                <div id="grid-wrapper"> 
                <canvas id="grid" className="grid-view"> </canvas>
                </div>
            </div>
        );
    }
}

export default withRouter(Simulation);