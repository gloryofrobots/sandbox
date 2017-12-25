import _ from "underscore";
import axios from 'axios';
import * as tokens from './tokens';
import SockJSConnection from "./SockJSConnection";

class BaseConnection {
    constructor(routes, onTerminate){
        this.routes = routes;
        this.onTerminate = onTerminate;
        this.defaultActions = {
            "SESSION_TERMINATED":onTerminate
        };
    }

    prepareOptions(action, opts) {
        var options = _.clone(opts);

        _.defaults(options, {
            route:undefined,
            payload:{},
            accept: (status)=>true,
            error: (error) => console.error("REQUEST FAILED", error),
            actions: {"*":  (request, msg) => console.error("REQUEST NOT HANDLED", request)}

        });

        options.actions=_.extend(options.actions, this.defaultActions);
        options.payload = {action:action, data:options.payload};

        if (!options.route) {
            throw new Error("Route propert must be filled");
        }

        options.url = this.routes[options.route];

        if (!options.url) {
            throw new Error("Unknown route", options.route);
        }
        return options;
    }

    dispatch(response, options) {
        // console.log("ACTIONS", options.actions);
        // console.log("POST  RESPONSE", response);
        if (!options.accept(response)) {
            return;
        }

        var response_data = response.data;
        var msg = response_data.data;
        var action = response_data.action;
        var handler = options.actions[action];
        // console.log("ACTION", action, handler);
        if (!handler) {
            handler = options["*"];
        }

        handler(response, msg);
    }

    openSocket(route, observers, options) {
        var url = this.routes[route];
        if (!url) {
            throw new Error("INVALID ROUTE");
        }

        return new SockJSConnection(url, _.extend(observers, this.defaultActions), options);
    }
}

class SecureConnection extends BaseConnection {
    post(action, opts) {
        var self = this;
        var token = tokens.getToken();
        if (!token) {
            this.onTerminate();
            return;
        }
        var options = this.prepareOptions(action, opts);
        
        axios.post(options.url, options.payload, {
            headers: { Authorization: "Bearer " + token }
        })
        .then(function (response) {
            self.dispatch(response, options);
        })
        .catch(function(error){
            options.error(error);
        });
    }
}

class Connection extends BaseConnection{
    secure() {
        return new SecureConnection(this.routes, this.onTerminate);
    }

    post(action, opts) {
        var self = this;
        var options = this.prepareOptions(action, opts);
        axios.post(options.url, options.payload)
        .then(function (response) {
            self.dispatch(response, options);
        })
        .catch(function(error){
            options.error(error);
        });
    }
}



export default Connection;