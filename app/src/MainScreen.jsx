import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router-dom'; // 

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Game from "./GameOfLife";
import Renderer from "./Renderer";

import _ from "underscore";


var game;
class MainScreen extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }

    componentDidMount() {
        const GRID_WIDTH = 10;
        const GRID_HEIGHT= 10;
        const VIEW_WIDTH = 800;
        const VIEW_HEIGHT = 800;
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
            <div>
              <AppBar position="static" className="app-bar">
                <Toolbar>
                  <Typography variant="title" color="inherit" className="app-bar" >
                    Cellular Automatons
                  </Typography>
                </Toolbar>
              </AppBar>
                <Grid container  justify="center">
                    <Grid item xs={12}>
                        <p className="center">
                            <Button variant="outlined" id="start">Start</Button>
                            <Button variant="outlined"  id="next">Next</Button>
                            <Button variant="outlined"  id="loop">Loop</Button>
                            <Button variant="outlined"  id="stop">Stop</Button>
                        </p>

                    </Grid>
                    <Grid item xs={12}>
                    </Grid>
                </Grid>
                 <canvas id="grid" className="grid-view"> </canvas>
            </div>
        );
    }
}

                                // 
export default withRouter(MainScreen);
