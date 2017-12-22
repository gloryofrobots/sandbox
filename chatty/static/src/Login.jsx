import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import AppBarDefault from './AppBarDefault';
import {withRouter, Redirect} from 'react-router-dom';
import { Grid, Row, Col } from 'react-material-responsive-grid';


class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            authenticated: false,
            registered: false,
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    render() {
        if (this.state.authenticated) {
            return (
                <Redirect to="/terminal" />
            );
        }
        else {
            return (
                <div>
                    <AppBarDefault
                        title="TerminalStub Sign In"
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
        var apiBaseUrl = "http://localhost:4000/api/";
        var self = this;
        var payload={
            "email":this.state.username,
            "password":this.state.password
        };
        this.setState({authenticated:true});

        // axios.post(apiBaseUrl+'login', payload)
        //     .then(function (response) {
        //         console.log(response);
        //         if(response.data.code == 200){
        //             console.log("Login successfull");
        //             var uploadScreen=[];
        //             uploadScreen.push(<UploadScreen appContext={self.props.appContext}/>)
        //             self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
        //         }
        //         else if(response.data.code == 204){
        //             console.log("Username password do not match");
        //             alert("username password do not match")
        //         }
        //         else{
        //             console.log("Username does not exists");
        //             alert("Username does not exist");
        //         }
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
    }
}

export default withRouter(Login);