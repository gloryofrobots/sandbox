import React from 'react';
// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom';

import MainScreen from './MainScreen';
import Connection from './Connection';
import CONF from "./CONF";
import Session from "./Session";
import SockJSConnection from "./SockJSConnection";

import './App.css';


injectTapEventPlugin();


class App extends React.Component {
    constructor(props){
        super(props);
        this.connection = new SockJSConnection(
            CONF.SOCKET_ENTRY_URL,
            {
                // "SESSION_TERMINATED":() => this.props.history.push("/")
            },
            {
                // monitorInterval:CONF.SOCKET_CHECK_INTERVAL
            }
        );
    }

    componentWillMount(){
    }

    componentWillUnmount(){
        this.connection.close();
    }

    render() {
        return (
                <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                    <Switch>
                        <Route path="/" render={(props)=> (<MainScreen
                                                            connection={this.connection}
                                                            />)}/>
                    </Switch>
                </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
