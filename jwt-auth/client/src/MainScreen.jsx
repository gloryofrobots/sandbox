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
    }

    componentWillMount() {
        var self = this;
        if(this.socket != null){
            this.socket.close();
            this.socket = null;
            throw new Error("Unclosed socket on mounting");
        }
        this.socket = this.props.connection.openSocket(this.props.echoRoute, {
            "TIME":function(msg){
                 self.setState({time:msg.time});
            }
        });
    }

    componentWillUnmount() {
        if(this.socket != null){
            this.socket.close();
            this.socket = null;
        }
    }

    onReceiveTimeToggle(event, state){
        if (state === true){
            this.socket.send("START_TIME_ECHO", {"interval":1000});
        } else{
            this.socket.send("STOP_TIME_ECHO");
        }
    }

    handleLogOut(event) {
        var self = this;
        self.props.connection.post("LOGOUT", {
            route:self.props.logoutRoute,
            payload:{},
            accept:function(response) {
                if(response.status !== 200){
                    self.setState({error:"LogOut Server error"});
                    return false;
                }
                return true;
            },
            actions:{
                "ERROR":function(response, msg) {
                    self.setState({error:"LogOut Server error " + msg.error + "!"});
                },
            },
            error: function (error) {
                self.setState({error:"LogOut Server error"});
            }
        });

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
}

export default withRouter(MainScreen);