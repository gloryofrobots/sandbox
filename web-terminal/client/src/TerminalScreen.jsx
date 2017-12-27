import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from 'react-router-dom';
// import Terminal from "./Terminal";
import Terminal from "./JQTerminal";
import TextEditor from "./TextEditor";
import AppBarDefault from "./AppBarDefault";
import AppBar from 'material-ui/AppBar';

                                // <Row>
                                //     <Col md={12}>
                                //     </Col>
                                // </Row>

class TerminalScreen extends Component {
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
                <AppBar
                   title="Web-Terminal"
                   className="app-bar"
                   />
                <Grid className="terminal-grid">
                    <Row>
                        <Col md={6}>
                            <Terminal /> 
                        </Col>
                        <Col md={6}>
                            <Terminal />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default withRouter(TerminalScreen);
