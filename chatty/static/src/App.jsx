import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
import './App.css';

import {
  Switch,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

import { Grid, Row, Col } from 'react-material-responsive-grid';

import ChatScreen from './ChatScreen';
import Register from './Register';
import Login from './Login';
import ConsoleScreen from './ConsoleScreen';

injectTapEventPlugin();
class App extends Component {
    constructor(props){
        super(props);
        this.state={
            isAuthenticated:false  
        };
    }
    componentWillMount(){
    }

    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route path="/chat" component={ConsoleScreen}/>
                <Route path="/register" component={Register}/>
            </Switch>
        );
    }
}



export default App;