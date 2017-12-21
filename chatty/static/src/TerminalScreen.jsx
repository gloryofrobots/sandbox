import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {withRouter, Redirect} from 'react-router-dom';
import Terminal from "./Terminal";
import AppBarDefault from "./AppBarDefault";

import CodeMirror from "react-codemirror";
import ReactGridLayout from 'react-grid-layout';

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');
const TextEditor = () => 
    (
                  <CodeMirror
                            value='<h1>I ♥ react-codemirror2</h1>'
                            options={{
                                mode: 'xml',
                                theme: 'material',
                                lineNumbers: true
                            }}
                            onChange={(editor, data, value) => {
                            }}
                  />
     );


class TerminalScreen extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }
    handleLogOut(event) {
        this.props.history.push("/");
    }
    render() {
        return (
        <div>
            <div>

                <AppBarDefault
                    className="app-bar"
                    title="Terminal"
                    onRightButtonClick={(event) => this.handleLogOut(event)}

                    rightButtonLabel="Log Out"/>

       <ReactGridLayout className="layout" cols={2} rowHeight={200} width={1200}>
        <div key="a" data-grid={{x: 0, y: 0, w: 1, h: 2}}><Terminal/></div>
        <div key="b" data-grid={{x: 2, y: 0, w: 1, h: 2}}><TextEditor/></div>
      </ReactGridLayout>
                  

            </div>
        </div>
        );
    }
}
export default withRouter(TerminalScreen);
