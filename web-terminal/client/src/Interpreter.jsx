
import JQuery  from 'jquery';
import {sprintf} from 'sprintf-js';
import _ from "underscore";

var $ = JQuery;

class Interpreter{
  constructor(commands, commandParser) {
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
        var arity = command.length - 3;
        if (arity !== args.length) {
            term.error(sprintf("Command expects %d number of arguments", arity));
            return;
        }
    }
    command.apply(command, [this, term, commandText, ...args]);
  }
}



export default Interpreter;