
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

        <div className="widget-header" style={{height:"85%"}}>
          <p className="center-align">--console--</p>
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
