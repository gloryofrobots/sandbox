import React from 'react';
import JQuery  from 'jquery';
import "./jquery.terminal.css";
import 'jquery.terminal';
import _ from "underscore";
var $ = JQuery;


class Terminal extends React.Component {
  constructor(props) {
    super(props);

    this.commands = {};

    this.interpreter_2 = {
        clear:(command) => {
            this.clear();
        },
        math:{
            "+": (a, b) => { return a + b; }
        },
        login:(user)=>{
            console.log(user);
        },
        log:(...rest) => {
            console.log(rest);
        }
    };

    var greetings;
      

    if (!this.props.session.exists()){
        greetings = "Type login [username] [password] for authentication \n";
        this.interpreter = this._auth_interpreter.bind(this);
    } else{
        greetings = "Type help to see available commands\n";
        this.interpreter = this._interpreter.bind(this);
    }

    this.state = {greetings:greetings};
  }

  addCommand(command) {
      this.commands[command.name] = command;
  }

  addCommands(commands) {
      _.each(commands, (command) => this.addCommand(command));
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
           interpreter={this.interpreter}
           checkArity={false}
           greetings={this.state.greetings}/>
    );
  }
}


class TerminalWrapper extends React.Component {
  componentDidMount() {
    var {interpreter, command, ...options} = this.props;
    this.terminal = $(this.node).terminal(interpreter, options);
  }
  componentWillUnmount() {
    this.terminal.destroy();
  }
  isCommandControlled() {
    return this.props.command !== undefined;
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