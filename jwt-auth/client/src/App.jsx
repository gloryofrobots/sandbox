import React, { Component } from 'react';
// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';


import {
  Switch,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

import { Grid, Row, Col } from 'react-material-responsive-grid';

import Register from './Register';
import Login from './Login';
import MainScreen from './MainScreen';
import Connection from './Connection';
import Config from "./Config";


import './App.css';


injectTapEventPlugin();

class App extends Component {
    constructor(props){
        super(props);
        this.state={
            isAuthenticated:false  
        };
        this.onAuth = this.onAuth.bind(this);
    }

    onAuth(token) {
        this.connection = new Connection(Config.SOCKET_URL);
    }

    componentWillMount(){

    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <Switch>
                    <Route exact path="/"
                           render={(props) => (<Login onAuth={this.onAuth}/>)} />
                    <Route path="/main" component={MainScreen}/>
                    <Route path="/register" component={Register}/>
                </Switch>
            </MuiThemeProvider>
        );
    }
}



export default App;
