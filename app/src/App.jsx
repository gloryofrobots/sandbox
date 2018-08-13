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

import MainScreen from './MainScreen';
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
        this.connection.close();
    }

                // <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    render() {
        return (
                <MuiThemeProvider theme={getTheme()}>
                    <Switch>
                        <Route path="/" render={(props)=> (<MainScreen />)}/>
                    </Switch>
                </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
