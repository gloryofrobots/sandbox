import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import AppBarDefault from './AppBarDefault';
import {withRouter, Redirect} from 'react-router-dom';
import { Grid, Row, Col } from 'react-material-responsive-grid';
import axios from 'axios';
import Cookies from 'universal-cookie';


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
                // <Redirect to="/" />
        if (this.state.authenticated) {
            return (
                <h4>Auth Success!!</h4>
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

        if (this.state.username.length == 0) {
            self.setState({error:"Username can not be empty!"});
            return;
        }
        if (this.state.password.length == 0) {
            self.setState({error:"Password can not be empty!"});
            return;
        }

        var payload={
            action:"AUTH",
            data:{
                "username": this.state.username,
                "password":this.state.password
           }
        };

        self.setState({error:""});
        axios.post(this.props.authUrl, payload)
        .then(function (response) {
            console.log("AUTH RESPONSE", response);
            if(response.status != 200){
                self.setState({error:"Authentication failed due to server error!"});
            } else {
                var msg = response.data;
                if (msg.action == "ERROR") {
                    self.setState({error: msg.data.error + "!"});
                } else if (msg.action != "AUTH_SUCCESS") {
                    self.setState({error:"Authentication failed due to server error!"});
                } else {
                    var cookies = new Cookies();
                    cookies.set("JWT", msg.data.jwt, {expires:new Date(parseInt(msg.data.exp)), path:"/"});
                    // console.log("JWT", msg.data.jwt, msg.data);
                    // console.log("COO", cookies.getAll());
                    self.setState({authenticated: true});
                }
            }
        })
        .catch(function (error) {
            self.setState({error:"Authentication failed due to invalid data"});
            console.log("Authentication failed!", error);
        });
    }
}

export default withRouter(Login);