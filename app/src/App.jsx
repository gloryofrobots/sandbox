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
  Switch,
  Route,
  withRouter,
 NavLink,
    Link,
    BrowserRouter as Router,
} from 'react-router-dom';

import GOLScreen from './GOLScreen';
import BBScreen from './BBScreen';
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
                gridHeight:CONF.GRID_HEIGHT
           }
        };
    }

    componentWillMount(){
    }

    componentWillUnmount(){
    }
    onSubmitSettings(settings){
        this.setState({
            settings:settings
        });
    }
                // <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    render() {
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
                    <ul>
                        <li>
                            <Link to="gol">Game Of Life</Link>
                        </li>
                        <li>
                            <Link to="bb">Brians Brain</Link>
                        </li>
                    </ul>

                    <div>
                      <Settings settings={{this.settings}}
                        onSubmit={this.onSubmitSettings}
                        />

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
                    <hr />

                        <Route path="/" render={(props)=> (<GOLScreen />)}/>
                        <Route path="/gol" render={(props)=> (<GOLScreen />)}/>
                        <Route path="/bb" render={(props)=> (<BBScreen />)}/>
                    </div>
                </Router>
         </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
