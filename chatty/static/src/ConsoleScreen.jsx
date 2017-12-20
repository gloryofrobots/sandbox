
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {withRouter, Redirect} from 'react-router-dom';
import Terminal from "./Terminal";

class ConsoleScreen extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }
    
    render() {
        return (
        <div>
            <MuiThemeProvider>
            <div>
                <AppBar
                    className="app-bar"
                    title="Console"
                />
                

                <RaisedButton className="logout-button" label="Log Out" secondary={true}  onClick={(event) => this.props.history.push("/")}/>
                <Terminal />
            </div>
            </MuiThemeProvider>
        </div>
        );
    }
}
export default withRouter(ConsoleScreen);
