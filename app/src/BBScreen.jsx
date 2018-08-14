

import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'; // 

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Game from "./GameOfLife";
import Renderer from "./Renderer";

import _ from "underscore";


var game;

class BBScreen extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }

    componentDidMount() {
        const GRID_WIDTH = 3;
        const GRID_HEIGHT= 3;
        const VIEW_WIDTH = 600;
        const VIEW_HEIGHT = 600;
        const INTERVAL = 100;
        const STEPS = -1;
        // const cell_width = 30;
        // const cell_height = 30;
        const CELL_MARGIN = 5;

        var canvas = document.getElementById("grid");
        var ctx = canvas.getContext("2d");

        ctx.strokeStyle = "rgb(0, 0, 0)";

        ctx.canvas.width = VIEW_WIDTH;
        ctx.canvas.height = VIEW_HEIGHT;

        var cellwidth = (VIEW_WIDTH / GRID_WIDTH) - CELL_MARGIN;
        var cellheight = (VIEW_HEIGHT / GRID_HEIGHT) - CELL_MARGIN;
        var render = new Renderer(ctx, VIEW_WIDTH, VIEW_HEIGHT, cellwidth, cellheight, CELL_MARGIN);

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

                // <AppBar
                //    title="GameOfLife"
                //    className="app-bar"
                //    />
    render() {
        return (
            <div/>
        );
    }
}


export default withRouter(BBScreen);