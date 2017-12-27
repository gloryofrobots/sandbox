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

import TerminalScreen from './TerminalScreen';
import Connection from './Connection';
import Config from "./Config";
import * as tokens from './tokens';


import './App.css';


injectTapEventPlugin();


class App extends Component {
    constructor(props){
        super(props);
        this.onTerminate = this.onTerminate.bind(this);

        var routes = {
                "register":Config.REGISTER_URL,
                "auth":Config.AUTH_URL,
                "logout":Config.LOGOUT_URL,
                "echo": Config.ECHO_URL,
                "time_echo": Config.TIME_ECHO_URL
        };

        this.connection = new Connection(
            routes,
            this.onTerminate,
            Config.SOCKET_CHECK_INTERVAL
       );
    }
    onTerminate(){
        tokens.removeToken();
        this.props.history.push("/");
    }

    isAuthenticated() {
        if (!tokens.hasToken()) {
            return false;
        }
        return true;
    }

    componentWillMount(){

    }

    render() {
        return (
                <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                    <Switch>
                        <Route path="/" render={(props)=> (<TerminalScreen
                                                            connection={this.connection.secure()}
                                                            />)}/>
                    </Switch>
                </MuiThemeProvider>
        );

        // if(this.state.sessionTerminated === true) {
        //     return(
        //     <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        //       <ExpiredScreen handleSignInAgain={this.handleSignInAgain}/>
        //      </MuiThemeProvider>
        //     );
        // }
        // else if(this.isAuthenticated()) {
        //     return (
        //             <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        //                 <Switch>
        //                     <Route path="/" render={(props)=> (<MainScreen
        //                                                           connection={this.connection.secure()}
        //                                                           echoRoute="time_echo"
        //                                                           logoutRoute={"logout"}/>)}/>
        //                 </Switch>
        //             </MuiThemeProvider>
        //     );
        // } else {
        //     return (
        //         <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        //             <Switch>
        //                 <Route exact path="/"
        //                     render={(props) => (<Login
        //                                                connection={this.connection}
        //                                                route = "auth"
        //                                                onAuth={this.onAuth}/>)} />
        //                 <Route path="/register"
        //                     render={(props) => (<Register
        //                                             connection={this.connection}
        //                                             route="register"/>)} />
        //             </Switch>
        //         </MuiThemeProvider>
        //     );
        // }
    }
}



export default withRouter(App);
