
import React from 'react';
import Console from "react-console-component";
// import 'react-console-component/main.css';

class Terminal extends Console {
    command (text) {
        this.refs.console.log(text);
        this.refs.console.return();
    }

    promptLabel() {
        return " $ ";
    }

    render() {
        return (
            <Console
                ref="console"
                handler={(text) => this.command(text)}
                promptLabel={()=>this.promptLabel()}
                autofocus={true} />
        );
    }
}

export default Terminal;
