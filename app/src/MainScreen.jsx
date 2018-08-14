import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class DefaultScreen extends Component {
    constructor(props){
        super(props);
        this.state={
        };
    }

    renderContent() {
        return (
            <div> </div>
        );
    }

    render() {
        return (
            <div>
              <AppBar position="static" className="app-bar">
                <Toolbar>
                  <Typography variant="title" color="inherit" className="app-bar" >
                    Cellular Automatons
                  </Typography>
                </Toolbar>
              </AppBar>
              {this.renderContent()}
            </div>
        );
    }
}

                                // 
export default DefaultScreen;
