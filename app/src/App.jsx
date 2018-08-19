import React from 'react';

import _ from "underscore";

// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {getTheme} from "./Theme";
// import Drawer from '@material-ui/core/Drawer';
// import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import ClippedDrawer from './ClippedDrawer';
import Button from '@material-ui/core/Button';

import Settings from "./Settings";

import {
  Route,
  withRouter,
  // Link,
  BrowserRouter as Router,
} from 'react-router-dom';

import SettingsScreen from "./SettingsScreen";
import SimulationScreen from './SimulationScreen';

import './App.css';


injectTapEventPlugin();


class App extends React.Component {
    constructor(props){
        super(props);
        this.history = props.history;

        this.onChangeSettings = this.onChangeSettings.bind(this);
        this.onAction = this.onAction.bind(this);
        this.settings = new Settings(this.onChangeSettings);
        this.sim = React.createRef();
        this.state = {
            settings:this.settings.toObject(),
            updated:this.settings.updatedKeys()
        };
    }

    componentWillMount(){
    }

    componentWillUnmount(){
    }

    onChangeSettings(){
        console.log("CHANGE SETTINGS", this.settings, this.settings.updated, this.settings.updatedKeys());
        this.setState({
            settings:this.settings.toObject(),
            updatedSettings:this.settings.updatedKeys()
        });
    }
    // onChangeSettings(){
    //     var sim = this.sim.current;
    //     var settings = this.settings.toObject();
    //     var updated = this.settings.updated;
    //     if (updated.size === 1) {
    //         if(updated.has("palette")) {
    //             sim.changePalette(settings);
    //         } else if(updated.has("cellMargin") || updated.has("canvasWidth") || updated.has("canvasHeight")) {
    //             sim.changeCanvas(settings);
    //         } else if(updated.has("interval")) {
    //             this.updateFromSettings(settings);
    //             // sim.changeInterval(settings);
    //         } else {
    //             this.updateFromSettings(settings);
    //         }
    //     } else {
    //         this.updateFromSettings(settings);
    //     }
    // }

    // updateFromSettings(settings) {
    //     this.setState({
    //         settings:settings
    //     });
    // }

    onAction(action) {
        // var sim = docum
        var sim = this.sim.current;
        if(action === "clear") {
            sim.clear();
        } else if(action === "randomize") {
            sim.randomize();
        }
    }

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
                      <main>
                       <SettingsScreen settings={this.settings} onAction={this.onAction}/>
                        <hr />
                        <SimulationScreen
                          ref={this.sim}
                          settings={this.state.settings}
                          updatedSettings={this.state.updatedSettings}/>


                        <Route path="/" render={(props)=> (<div></div>)}/>
                    </main>
                </Router>
                <footer className="footer">
                </footer>
         </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
