import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from 'react-router-dom';
import AppBarDefault from "./AppBarDefault";
import axios from 'axios';

class MainScreen extends Component {
    constructor(props){
        super(props);
        this.state={
        };
        this.handleLogOut = this.handleLogOut.bind(this);
    }
    handleLogOut(event) {
        this.props.history.push("/");
    }
    render() {
        return (
            <div>
                <AppBarDefault
                    className="app-bar"
                    title="Workspace"
                    onRightButtonClick={this.handleLogOut}
                    rightButtonLabel="Log Out"/>

                <p className="center-align"> <b>Server Time:</b> {this.state.serverTime} </p>
            </div>
        );
    }
}

export default withRouter(MainScreen);