import React, { Component } from 'react';
// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import AppBarDefault from "./AppBarDefault";


import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom';

import Register from './Register';
import Login from './Login';
import MainScreen from './MainScreen';
import Connection from './Connection';
import Config from "./Config";
import * as tokens from './tokens';


import './App.css';


injectTapEventPlugin();

const ExpiredScreen = (props) => (
    <div>
        <AppBarDefault
            className="app-bar"
            title="Session expired"
            onRightButtonClick={props.handleSignInAgain}
            rightButtonLabel="Sign In"/>
        <div className="center-align">
            <p className="center-align" style={{color:"red", "fontSize":"20px"}}>
            Your session was expired. Please sign in again!
            </p>
            <RaisedButton
                label="Sign In"
                primary={true}
                onClick={props.handleSignInAgain}
            />
            </div>
    </div>
);



class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            sessionTerminated:false
        };
        
        this.connection = new Connection({
            "register":Config.REGISTER_URL,
            "auth":Config.AUTH_URL,
            "echo": Config.ECHO_URL,
            "time_echo": Config.TIME_ECHO_URL
        }, (function() {
            tokens.removeToken();
            this.setState({sessionTerminated:true});
            this.props.history.push("/");
        }).bind(this));

        this.onAuth = this.onAuth.bind(this);
        this.handleSignInAgain = this.handleSignInAgain.bind(this);
    }

    isAuthenticated() {
        if (!tokens.hasToken()) {
            return false;
        }
        return true;
    }

    onAuth(msg) {
        // this.connection = new Connection(Config.SOCKET_URL);
        tokens.saveToken(msg.jwt, msg.exp);
    }

    componentWillMount(){

    }

    handleSignInAgain(){
        this.setState({sessionTerminated:false});
    }

    render() {
        if(this.state.sessionTerminated === true) {
            return(
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
              <ExpiredScreen handleSignInAgain={this.handleSignInAgain}/>
             </MuiThemeProvider>
            );
        }
        else if(this.isAuthenticated()) {
            return (
                    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                        <Switch>
                            <Route path="/" render={(props)=> (<MainScreen
                                                                  connection={this.connection.secure()}
                                                                  route={"echo"}/>)}/>
                        </Switch>
                    </MuiThemeProvider>
            );
        } else {
            return (
                <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                    <Switch>
                        <Route exact path="/"
                            render={(props) => (<Login
                                                       connection={this.connection}
                                                       route = "auth"
                                                       onAuth={this.onAuth}/>)} />
                        <Route path="/register"
                            render={(props) => (<Register
                                                    connection={this.connection}
                                                    route="register"/>)} />
                    </Switch>
                </MuiThemeProvider>
            );
        }
    }
}



export default withRouter(App);
