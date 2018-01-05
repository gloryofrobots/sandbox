import React from 'react';
import JQuery  from 'jquery';
import _ from "underscore";
import {sprintf} from 'sprintf-js';

import TerminalWrapper from "./TerminalWrapper";
import {PublicInterpreter, PrivateInterpreter} from "./command";


class Terminal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {intro:"", interpreter:""};
        this.props.session.setOnOpenCallback(this.onSessionOpen.bind(this));
        this.props.session.setOnAuthenticateCallback(this.onSessionAuthenticate.bind(this));
    }

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    setupPublic(){
        this.setState({
            intro: "\n--  Use auth [username] [password] for authentication or register [username] [password] to register\n",
            prompt: "> ",
            interpreter:PublicInterpreter(this.props.session)
        });
    }

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    setupPrivate(){
        var session = this.props.session;
        console.log("SETUP PRIVATE");
            session.sendSync(
                (msg) => {
                    if (session.isError(msg)) {
                        console.error("Cannot aquire username  from server:" + msg.data.message);
                    } else if (msg.route !== "USER/USER") {
                        console.error("Cannot aquire username from server");
                    } else {
                        var username = msg.data.username;
                        this.setState({
                            intro: "\n--  Type help to see available commands\n",
                            prompt: "@" + username +" > ",
                            interpreter:PrivateInterpreter(this.props.session, () => this.setupPublic())
                        });
                    }
                },
                "USER/GET_AUTHENTICATED",
                {
                }
            );
    }

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    onSessionAuthenticate (){
        console.log("SESSION AUTHENTICATED FROM USER");
        this.setupPrivate();
    }

    onSessionOpen() {
        if (!this.props.session.authenticated()){
            console.log("AUTH REQUIRED");
            this.setupPublic();
        } else {
            console.log("SESSION AUTHENTICATED");
            this.setupPrivate();
        }
    }

    render() {
        console.log("RENDER", this.state.intro);
        return (
            <TerminalWrapper
                interpreter={this.state.interpreter.evaluate}
                checkArity={false}
                intro={this.state.intro}
                prompt={this.state.prompt}
                greetings="" />
        );
    }
}



export default Terminal;