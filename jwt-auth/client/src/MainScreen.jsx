import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from 'react-router-dom';
import AppBarDefault from "./AppBarDefault";

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
                    title="Terminal"
                    onRightButtonClick={this.handleLogOut}
                    rightButtonLabel="Log Out"/>

                <h1> Succesfull Login!!!</h1>
            </div>
        );
    }
}

export default withRouter(MainScreen);