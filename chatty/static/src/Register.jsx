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
    }
    render() {
        if (this.state.registered == false) {
            return (
                    <div>
                        <AppBarDefault
                            title="TerminalStub Register"
                            onRightButtonClick={(event) => this.handleCancel(event)}
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
                            <div class="center-align">
                              <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleClick(event)}/>
                            </div>
                        </div>
                    </div>
                );
           }
        else {
            return (<Redirect to="/" />)
        }
    }
    handleCancel(event) {
        this.props.history.push("/");
    }
    handleClick(event){
        // var apiBaseUrl = "http://localhost:4000/api/";
        //To be done:check for empty values before hitting submit
        var self = this;
        var payload={
            "username": this.state.username,
            "email":this.state.email,
            "password":this.state.password
        };

        this.setState({registered: true});

    //  axios.post(apiBaseUrl+'/register', payload)
    // .then(function (response) {
    //   console.log(response);
    //   if(response.data.code == 200){
    //    //  console.log("registration successfull");
    //     var loginscreen=[];
    //     loginscreen.push(<Login parentContext={this}/>);
    //     var loginmessage = "Not Registered yet.Go to registration";
    //     self.props.parentContext.setState({loginscreen:loginscreen,
    //     loginmessage:loginmessage,
    //     buttonLabel:"Register",
    //     isLogin:true
    //      });
    //   }
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    }
}

export default Register;