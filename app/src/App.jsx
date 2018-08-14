import React from 'react';
// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {getTheme} from "./Theme";
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Settings from "./Settings";

import {
  Route,
  withRouter,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';

import Simulation from './Simulation';
import CONF from "./CONF";

import './App.css';


injectTapEventPlugin();


class App extends React.Component {
    constructor(props){
        super(props);
        this.history = props.history;
        this.onSubmitSettings = this.onSubmitSettings.bind(this);
        this.state = {
            settings:{
                canvasWidth:CONF.CANVAS_WIDTH,
                canvasHeight:CONF.CANVAS_HEIGHT,
                gridWidth:CONF.GRID_WIDTH,
                gridHeight:CONF.GRID_HEIGHT,
                countSteps:CONF.COUNT_STEPS,
                interval:CONF.INTERVAL,
                cellMargin:CONF.CELL_MARGIN
           }
        };
    }

    componentWillMount(){
    }

    componentWillUnmount(){
    }
    onSubmitSettings(settings){
        console.log("SETTINGS" , settings);
        this.setState({
            settings:settings
        });
    }
                // <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    render() {
        console.log("RENDER SETTINGS", this.state.settings);
        return (
          <MuiThemeProvider theme={getTheme()}>
              <AppBar position="static" className="app-bar">
                <Toolbar>
                  <Typography variant="title" color="inherit" className="app-bar" >
                    Cellular Automatons
                  </Typography>
                </Toolbar>
              </AppBar>
                <Router>
                    <div>
                        <Settings settings={this.state.settings}
                                onSubmit={this.onSubmitSettings} />

                        <hr />
                        <Simulation settings={this.state.settings} />

                        <Route path="/" render={(props)=> (<div></div>)}/>
                    </div>
                </Router>
         </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
