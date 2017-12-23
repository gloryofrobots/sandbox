import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import Login from './Login';
import AppBarDefault from './AppBarDefault';
import {withRouter, Redirect} from 'react-router-dom';

class Register extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',

            registered:false,
            error:'',
            success:''
        };
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    render() {
        var button;
        if (!this.state.registered) {
            button = (<RaisedButton
                        label="Register" 
                        primary={true} onClick={this.handleSubmit}/>);

        } else{
            button = (<RaisedButton
                        label="Sign In" 
                        primary={true} onClick={this.handleSignIn}/>);
        }
        return (
                <div>
                    <AppBarDefault
                        title="Register"
                        onRightButtonClick={this.handleSignIn}
                        rightButtonLabel="Sign In"/>
                    <div className="centered-container">
                        <TextField
                            disabled={this.state.registered}
                            hintText="Enter your username"
                            floatingLabelText="User name"
                            onChange = {(event,newValue) => this.setState({username:newValue})}
                            />
                        <br/>
                        <TextField
                            disabled={this.state.registered}
                            type = "password"
                            hintText="Enter your Password"
                            floatingLabelText="Password"
                            onChange = {(event,newValue) => this.setState({password:newValue})}
                            />
                        <br/>
                        <br/>
                        <div className="center-align">
                          {button}
                        </div>
                        <p className="center-align" style={{color:"red"}}>
                            {this.state.error}
                        </p>
                        <p className="center-align" style={{color:"green"}}>
                            {this.state.success}
                        </p>
                    </div>
                </div>
            );
    }


    handleSignIn(event) {
        this.props.history.push("/");
    }


    handleSubmit(event){
        var self = this;
        var payload={
            action:"REGISTER",
            data:{
                "username": this.state.username,
                "password":this.state.password
           }
        };

        self.setState({success: "", error:""});
        axios.post(this.props.registerUrl, payload)
        .then(function (response) {
            console.log("REG RESPONSE", response);
            if(response.status != 200){
                self.setState({error:"Registration failed due to server error!"});
            } else{
                var msg = response.data;
                if (msg.action == "ERROR") {
                    self.setState({error:msg.data.error + "!"});
                } else if (msg.action != "REGISTER_SUCCESS") {
                    self.setState({error:"Registration failed due to server error!"});
                } else {
                    self.setState({registered: true,
                                   success: "Registration has been successful! Please try to sign in"});
                }
            }
        })
        .catch(function (error) {
            self.setState({error:"Registration failed due to invalid data"});
            console.log("Registration failed!", error);
        });
    }
}

export default withRouter(Register);