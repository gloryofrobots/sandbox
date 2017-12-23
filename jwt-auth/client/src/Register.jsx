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
            email:'',
            password:'',

            registered:false
        };
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    render() {
        if (this.state.registered == false) {
            return (
                    <div>
                        <AppBarDefault
                            title="TerminalStub Register"
                            onRightButtonClick={this.handleSignIn}
                            rightButtonLabel="Sign In"/>
                        <div className="centered-container">
                            <TextField
                                hintText="Enter your username"
                                floatingLabelText="User name"
                                onChange = {(event,newValue) => this.setState({username:newValue})}
                                />
                            <br/>
                            <TextField
                                hintText="Enter your Email"
                                type="email"
                                floatingLabelText="Email"
                                onChange = {(event,newValue) => this.setState({email:newValue})}
                                />
                            <br/>
                            <TextField
                                type = "password"
                                hintText="Enter your Password"
                                floatingLabelText="Password"
                                onChange = {(event,newValue) => this.setState({password:newValue})}
                                />
                            <br/>
                            <br/>
                            <div className="center-align">
                              <RaisedButton label="Submit" primary={true} onClick={this.handleSubmit}/>
                            </div>
                        </div>
                    </div>
                );
           }
        else {
            return (<Redirect to="/" />)
        }
    }


    handleSignIn(event) {
        this.props.history.push("/");
    }


    handleSubmit(event){
        // var apiBaseUrl = "http://localhost:4000/api/";
        //To be done:check for empty values before hitting submit
        var self = this;
        var payload={
            "username": this.state.username,
            "email":this.state.email,
            "password":this.state.password
        };

        // this.setState({registered: true});

        axios.post(this.props.registerUrl, payload)
        .then(function (response) {
            console.log("REG RESPONSE", response);
            if(response.data.code == 200){
                console.log("registration successfull");
            }
        })
        .catch(function (error) {
            console.log("registration failed", error);
        });
    }
}

export default Register;