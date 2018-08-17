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
import PaletteEditor from "./PaletteEditor";
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
        this.onToggleEditor = this.onToggleEditor.bind(this);

        this.settings = new Settings(this.onChangeSettings);
        this.state = {
            editEnabled:true,
            settings:this.settings.toObject()
        };
    }

    componentWillMount(){
    }

    componentWillUnmount(){
    }

    onToggleEditor() {
        this.setState({
            editEnabled:!this.state.editEnabled
        });
    }
    onChangeSettings(){
        this.setState({
            settings:this.settings.toObject()
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
                  <Button
                    variant="outlined"
                    onClick={this.onToggleEditor}
                    style={{marginLeft:30}}
                    >Toggle editor</Button>
                </Toolbar>
              </AppBar>
                <Router>
                      <div>
                        <Drawer open={this.state.editEnabled}
                                variant="persistent" anchor="left">
                          <PaletteEditor />
                        </Drawer>
                        <SettingsScreen settings={this.settings}/>
                        <hr />
                        <SimulationScreen settings={this.state.settings} />
                        <Route path="/" render={(props)=> (<div></div>)}/>
                    </div>
                </Router>
         </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
