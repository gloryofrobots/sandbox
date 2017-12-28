import React from 'react';
import JQuery  from 'jquery';
import "./jquery.terminal.css";
import 'jquery.terminal';
var $ = JQuery;


class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

    this.interpreter = this.interpreter.bind(this);
  }

  interpreter(command, term){
      this.props.session.send("PING", {});
      console.log($.terminal.parse_command(command));
      console.log($.terminal.parse_arguments(command));
  }

  render() {
    return (
      <div>
        <TerminalWrapper
           interpreter={this.interpreter}
           checkArity={false}
           greetings={"Type help to see available commands\n"}/>
      </div>
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