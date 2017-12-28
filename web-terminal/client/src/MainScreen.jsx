import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import {withRouter} from 'react-router-dom'; // 
import Terminal from "./Terminal";
// import TextEditor from "./TextEditor";
import AppBar from 'material-ui/AppBar';
import _ from "underscore";


class MainScreen extends Component {
    constructor(props){
        super(props);
        this.state={
        };
        this.termCount = 1;
        this.colWidth = 12 / this.termCount;
    }

    createSession(index) {
        var tokenName = this.props.tokenBaseName + index;
        return this.props.connection.createSession(tokenName);
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
                      {
                          _.range(this.termCount).map((i) => (
                             <Col md={this.colWidth} key={i}>
                               <Terminal session={this.createSession(i)}/> 
                            </Col>
                          ))
                      }
                    </Row>
                </Grid>
            </div>
        );
    }
}

                                // 
export default withRouter(MainScreen);
