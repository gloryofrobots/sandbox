import React from 'react';
import JQuery  from 'jquery';
import "./jquery.terminal.css";
import 'jquery.terminal';
import _ from "underscore";
import {sprintf} from 'sprintf-js';

var $ = JQuery;

class Interpreter{
  constructor(commands) {
    this.commands = {};
    if (commands) {
        this.addCommands(commands);
    }
    this.evaluate = this.evaluate.bind(this);
  }

  help(){
      var result = `Available commands: `;
      result += _.keys(this.commands).join(', ');
      return result;
  }

  addCommands(commands) {
      this.commands = {...this.commands, ...commands};
  }

  evaluate(commandText, term){
      // var command_data = $.terminal.parse_command(command_text);
      var args = $.terminal.parse_arguments(commandText);
      console.log("evaluate", commandText, args);
      this.dispatch(term, this.commands, commandText, _.first(args), _.rest(args));
  }
  dispatch(term, commands, commandText, name, args){
      console.log("dispatch", commands, ">>", commandText, ">>", name, ">>", args);
      var command = commands[name];
      if (!command) {
          console.log("not found", commands, commands["login"], command);
          term.error(sprintf("Unknown command %s", name));
          return;
      }

      if (_.isFunction(command)) {
          this.callCommand(term, commandText, args, command, true);
      } else {
          var interpreter = command.eval;
          if(!interpreter) {
              this.dispatch(term, command, commandText, _.first(args), _.rest(args));
          } else{
              this.callCommand(term, commandText, args, interpreter, command.checkArity);
          }
      }
  }

  callCommand(term, commandText, args, command, checkArity) {
    if (checkArity === true) {
        // because of additional args, term and commandText
        var arity = command.length - 2;
        if (arity != args.length) {
            term.error(sprintf("Command expects %d number of arguments", arity));
            return;
        }
    }
    command.apply(command, [term, commandText, ...args]);
  }
}


class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {greetings:"", interpreter:""};
  }

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
    
  setupAuth(){
      var interpreter = new Interpreter({
            help :(term, command) => {
                term.echo(interpreter.help());
            },
            ping :(term, command) => {
                console.log("SENDING PIG");
                this.props.session.sendSync(
                    (msg) => {
                        console.log("RECEIVED PONG", msg);
                    },
                    "BASIC/PING"
                );
            },
            users :(term, command) => {
                this.props.session.sendSync(
                    (msg) => {
                        console.log("ALL_USERS", msg);
                    },
                    "USER/ALL"
                );
            },
            auth :(term, command, username, password) => {
                    console.log("LOGIN", username, password);
                    this.props.session.authenticate(
                        (msg) => {
                            if (this.props.session.isError(msg)) {
                                term.echo("Authentication failed:" + msg.data.message);
                                return false;
                            }
                            if (msg.route != "BASIC/AUTH_SUCCESS") {
                                term.echo("Authentication failed:" + msg.data.message);
                                return false;
                            }

                            console.log("AUTH_SUCCESS", msg);
                            term.echo("Successfull authentication! Session will expire at [" +
                                      new Date(parseInt(msg.data.exp, 10)) + "]");
                            this.setup();
                            return true;
                        },
                        "BASIC/AUTH",
                        {
                            username:username,
                            password:password
                        }
                    );
            }
      });
      this.setState({
          greetings: "Type help to see available commands\n",
          interpreter:interpreter
      });
  }

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////

  setup(){
      var session = this.props.session;
      var interpreter = new Interpreter({
            help :(term, command) => {
                term.echo(interpreter.help());
            },
            logout :(term, command) => {
                session.logout();
                this.setupAuth();
            },
            "math":{
                "+":{
                    eval:(term, command, x, y) => {
                        term.echo(x + y);
                    }
                }
            }
      });
      this.setState({
        greetings: "Type help to see available commands\n",
        interpreter:interpreter
      });
  }

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////

  componentWillMount() {
    if (!this.props.session.exists()){
        console.log("AUTH REQUIRED");
        this.setupAuth();
    } else {
        console.log("SESSION AUTHENTICATED");
        this.setup();
    }
  }
  _auth_interpreter(command, term){
      console.log($.terminal.parse_command(command));
      console.log($.terminal.parse_arguments(command));
   }

  _interpreter(command_text, term){
      var command_data = $.terminal.parse_command(command_text);
      // var command

      console.log(command_data);
  }

  render() {
    return (
        <TerminalWrapper
           interpreter={this.state.interpreter.evaluate}
           checkArity={false}
           greetings={this.state.greetings}/>
    );
  }
}


class TerminalWrapper extends React.Component {

  componentDidMount() {
   console.log("componentDidMount");
    var {...options} = this.props;
    this.interpretorProxy = this.interpretorProxy.bind(this);
    this.terminal = $(this.node).terminal(this.interpretorProxy, options);
  }
  // componentDidMount() {
  //   var {interpreter, command, ...options} = this.props;
  //   // this.interpreter = interpreter;
  //   // this.interpretorProxy = this.interpretorProxy.bind(this);
  //   // this.terminal = $(this.node).terminal(this.interpretorProxy, options);
  //   this.terminal = $(this.node).terminal(interpreter, options);
  // }

  componentWillUnmount() {
    this.terminal.destroy();
  }

  isCommandControlled() {
    return this.props.command !== undefined;
  }

  interpretorProxy(command_text, term){
      this.props.interpreter(command_text, term);
  }

  render() {
    if (this.terminal && this.isCommandControlled()) {
      this.terminal.set_command(this.props.command, true);
    }
    return (
      <div ref={(node) => this.node = node}></div>
    );
  }
}


export default Terminal;