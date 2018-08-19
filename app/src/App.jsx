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
            settings:this.settings.toObject()
        };
    }

    componentWillMount(){
    }

    componentWillUnmount(){
    }

    onChangeSettings(){
        var sim = this.sim.current;
        var updated = this.settings.updated;
        if (updated.size === 1 && updated.has("palette")) {
            sim.changePalette(this.settings.param("palette"));
        } else {
            this.setState({
                settings:this.settings.toObject()
            });
        }
    }
                // <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>

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
                          action={this.state.action}
                          settings={this.state.settings} />


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
