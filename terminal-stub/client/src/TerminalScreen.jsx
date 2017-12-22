import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from 'react-router-dom';
import Terminal from "./Terminal";
import TextEditor from "./TextEditor";
import OutputView from "./OutputView";
import AppBarDefault from "./AppBarDefault";

                                // <Row>
                                //     <Col md={12}>
                                //         <TextEditor/>
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
                <AppBarDefault
                    className="app-bar"
                    title="Terminal"
                    onRightButtonClick={this.handleLogOut}

                    rightButtonLabel="Log Out"/>
                <Grid className="terminal-grid">
                    <Row>
                        <Col md={6}>
                            <Grid className="terminal-grid">
                                <Row>
                                    <Col md={12}>
                                        <Terminal/>
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                        <Col md={6}>
                            <OutputView/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default withRouter(TerminalScreen);
