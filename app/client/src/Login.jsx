import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBarDefault from './AppBarDefault';
import {withRouter, Redirect} from 'react-router-dom';


class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            authenticated: false,
            error:""
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    render() {
        if (this.state.authenticated) {
            return (
                // <h4>Auth Success!!</h4>
                <Redirect to="/" />
            );
        }
        else {
            return (
                <div>
                    <AppBarDefault
                        title="Sign In"
                        onRightButtonClick={this.handleRegister}
                        rightButtonLabel="Register"/>

                    <div className="centered-container">
                        <TextField
                            hintText="Enter your Username"
                            floatingLabelText="Username"
                            onChange = {(event,newValue) => this.setState({username:newValue})}
                            />
                        <br/>
                        <TextField
                                type="password"
                                hintText="Enter your Password"
                                floatingLabelText="Password"
                                onChange = {(event,newValue) => this.setState({password:newValue})}
                            />
                        <br/>
                        <br/>
                        <div className="center-align">
                            <RaisedButton
                                label="Submit"
                                primary={true}
                                onClick={this.handleLogin}
                            />
                            <p className="center-align" style={{color:"red"}}>
                                {this.state.error}
                            </p>
                            </div>
                    </div>
                </div>
            );
        }
    }

    handleRegister(event){
        this.props.history.push("/register");
    }

    handleLogin(event){
        var self = this;

        if (this.state.username.length === 0) {
            self.setState({error:"Username can not be empty!"});
            return;
        }
        if (this.state.password.length === 0) {
            self.setState({error:"Password can not be empty!"});
            return;
        }

        var payload={
            "username": this.state.username,
            "password":this.state.password
        };

        self.setState({error:""});
        this.props.connection.post("AUTH", {
            route:this.props.route,
            payload:payload,
            accept:function(response) {
                if(response.status !== 200){
                    self.setState({error:"Authentication failed due to server error!"});
                    return false;
                }
                return true;
            },
            actions:{
                "ERROR":function(response, msg) {
                    self.setState({error:msg.error + "!"});
                },
                "AUTH_SUCCESS": function(response, msg) {
                    // console.log("JWT", msg.data.jwt, msg.data);
                    self.props.onAuth(msg);
                    self.setState({authenticated: true});
                },
                "*": function(response, msg) {
                    self.setState({error:"Authentication failed due to server error!"});
                }
            },
            error: function (error) {
                self.setState({error:"Authentication failed due to invalid data"});
                console.log("Authentication failed!", error);
            }
        });

    }
}

export default withRouter(Login);