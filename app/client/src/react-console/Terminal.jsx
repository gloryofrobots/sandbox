
import React from 'react';
import Console from "react-console-component";
// import 'react-console-component/main.css';
import './react-console.css';

class Terminal extends Console {
    command (cmd) {
        var console = this.refs.console;

        console.log(cmd);

        console.return();
    }

    promptLabel() {
        return " $ ";
    }

    render() {
        return (

        <div className="widget-header">
            <Console
                ref="console"
                handler={(text) => this.command(text)}
                promptLabel={()=>this.promptLabel()}
                autofocus={true} />
        </div>
        );
    }
}

export default Terminal;
