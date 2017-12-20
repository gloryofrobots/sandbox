import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Login from './Login';
import Register from './Register';

import {
  Switch,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

class Loginscreen extends Component {
    constructor(props){
        super(props);
        this.state={
        username:'',
        password:'',
        loginmessage:'',
        buttonLabel:'Register',
        isLogin:false
        };
    }
    componentWillMount(){
    }
    render() {
        if (this.state.isLogin) {
            return (

             <div>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>
                <Redirect to="/login" />
           </div>);
        }
        return (
        <div className="loginscreen">
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>
            <div>
            <MuiThemeProvider>
                <div>
                  <RaisedButton label="Register" primary={true} onClick={(event) => this.handleClick(event)}/>
                </div>
            </MuiThemeProvider>
            </div>
        </div>
        );
    }

    handleClick(event){
    // console.log("event",event);
        this.setState({isLogin:true});
  }
}
export default withRouter(Loginscreen);