import React from 'react';

import JQuery  from 'jquery';

import "./jquery.terminal.css";
import 'jquery.terminal';

var $ = JQuery;

class TerminalWrapper extends React.Component {

  componentDidMount() {
    console.log("TermWrapper componentDidMount"); // 
    var {intro, ...options} = this.props;
    this.interpretorProxy = this.interpretorProxy.bind(this);
    this.terminal = $(this.node).terminal(this.interpretorProxy, options);
    this.terminal.echo(intro);
  }
  
   
  componentWillReceiveProps(nextProps){
      var {intro, prompt} = nextProps;
      console.log("TERM WRAP UPDATE", intro, this.terminal);
      if (!this.terminal) {
          return;
      }
      this.terminal.set_prompt(prompt);
      this.terminal.echo(intro);
  }
  // componentWillUpdate(){
  //     var {greetings, ...options} = this.props;
  //     console.log("TERM WRAP UPDATE", greetings, this.terminal);
  //     if (!this.terminal) {
  //         return;
  //     }
  //     this.terminal.greetings(greetings);
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

export default TerminalWrapper;