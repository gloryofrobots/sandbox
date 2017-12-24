import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import AppBarDefault from "./AppBarDefault";
import Toggle from 'material-ui/Toggle';
import { Grid, Row, Col } from 'react-material-responsive-grid';

class MainScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            error:"",
            time:0
        };

        this.handleLogOut = this.handleLogOut.bind(this);
        this.onReceiveTimeToggle = this.onReceiveTimeToggle.bind(this);
        this.intervalStep = 1000;
        this.interval = null;
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    requestTime() {
        var self = this;
        self.props.connection.post("TIME", {
            route:self.props.route,
            payload:{},
            accept:function(response) {
                if(response.status !== 200){
                    self.setState({error:"Request failed due to server error!"});
                    return false;
                }
                return true;
            },
            actions:{
                "ERROR":function(response, msg) {
                    self.setState({error:msg.error + "!"});
                },
                "TIME": function(response, msg) {
                    self.setState({time:msg.time});
                    // console.log("TIME RECEIVED", msg.time);
                }
            },
            error: function (error) {
                self.setState({error:"Internal error!"});
                console.log("Echo Error!", error);
            }
        });
    }

    onReceiveTimeToggle(event, state){
        var self = this;
        if (self.interval) {
            clearInterval(self.interval);
            self.interval = null;
        }
        if (state === false){
            return;
        }

        self.interval = setInterval(function(){
        self.requestTime();
        },self.intervalStep);
    }

    handleLogOut(event) {
        this.props.history.push("/");
    }
    timeString() {
        return (
          <span><b>Server Time:</b>  <span>{this.state.time} </span></span>
        );
    }
    render() {
        return (
            <div>
                <AppBarDefault
                    className="app-bar"
                    title="Workspace"
                    onRightButtonClick={this.handleLogOut}
                    rightButtonLabel="Log Out"/>

                <Grid style={{"marginLeft":"40%", "marginTop":20}}>
                  <Row>
                    <Col>
                        <Toggle
                            label="Receive time"
                            defaultToggled={false}
                            onToggle={this.onReceiveTimeToggle}
                            />
                        <p className="center-align">
                          {this.timeString()}
                        </p>
                    </Col>
                  </Row>
                </Grid>
                <p className="center-align" style={{color:"red"}}> {this.state.error} </p>
            </div>
        );
    }
}

export default withRouter(MainScreen);