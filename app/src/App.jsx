import React from 'react';
// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import {getTheme} from "./Theme";

import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom';

import GameOfLifeScreen from './GameOfLifeScreen';
import CONF from "./CONF";

import './App.css';


injectTapEventPlugin();


class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillMount(){
    }

    componentWillUnmount(){
    }

                // <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
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
                <MuiThemeProvider theme={getTheme()}>
                    <Switch>
                        <Route path="/" render={(props)=> (<GameOfLifeScreen />)}/>
                    </Switch>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default withRouter(App);
