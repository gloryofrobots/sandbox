import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

class UploadScreen extends Component {
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
                title="UploadScreen"
            />
            </div>
            </MuiThemeProvider>
        </div>
        );
    }
}
export default UploadScreen;