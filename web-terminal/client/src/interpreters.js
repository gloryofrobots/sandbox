import _ from "underscore";
import Interpreter from "./Interpreter";

function PublicInterpreter(session){
      var interpreter = new Interpreter({
            help :(interp, term, command) => {
                term.echo(interp.help());
            },
            ping :(interp, term, command) => {
                console.log("SENDING PIG");
                session.sendSync(
                    (msg) => {
                        console.log("RECEIVED PONG", msg);
                    },
                    "BASIC/PING"
                );
            },
            users :(interp, term, command) => {
                session.sendSync(
                    (msg) => {
                        console.log("ALL_USERS", msg);
                    },
                    "USER/GET_ALL"
                );
            },
            register :(interp, term, command, username, password) => {
                    console.log("REGISTER", username, password);
                    session.sendSync(
                        (msg) => {
                            if (session.isError(msg)) {
                                term.echo("Registration failed:" + msg.data.message);
                            } else if (msg.route !== "BASIC/REGISTER_SUCCESS") {
                                term.echo("Registration failed!");
                            } else {
                                console.log("REG_SUCCESS", msg);
                                term.echo("Successfull registration! Use auth command to authenticate");
                            }
                        },
                        "BASIC/REGISTER",
                        {
                            username:username,
                            password:password
                        }
                    );
            },
            auth :(interp, term, command, username, password) => {
                    console.log("LOGIN", username, password);
                    session.authenticate(
                        (msg) => {
                            if (session.isError(msg)) {
                                term.echo("Authentication failed:" + msg.data.message);
                                return false;
                            }
                            if (msg.route !== "BASIC/AUTH_SUCCESS") {
                                term.echo("Authentication failed!");
                                return false;
                            }

                            console.log("AUTH_SUCCESS", msg);
                            term.echo("Successfull authentication! Session will expire at [" +
                                      new Date(parseInt(msg.data.exp, 10)) + "]");
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
    return interpreter;
}

function PrivateInterpreter(session, onLogout){
      var interpreter = new Interpreter({
            help :(interp, term, command) => {
                term.echo(interp.help());
            },
            logout :(interp, term, command) => {
                session.logout();
                onLogout();
            },
            "math":{
                "+":{
                    eval:(interp, term, command, x, y) => {
                        term.echo(x + y);
                    }
                }
            }
      });

    return interpreter;
}

export {PublicInterpreter, PrivateInterpreter};