
import SockJS from "sockjs-client";

import _ from "underscore";
import axios from 'axios';
import * as tokens from './tokens';

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
        console.log("ACTIONS", options.actions);
        console.log("POST  RESPONSE", response);
        if (!options.accept(response)) {
            return;
        }

        var response_data = response.data;
        var msg = response_data.data;
        var action = response_data.action;
        var handler = options.actions[action];
        console.log("ACTION", action, handler);
        if (!handler) {
            handler = options["*"];
        }

        handler(response, msg);
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


// class Connection {
//     constructor(url, options, observers){
//         this.observers = {};
//         this.observe(observers);
//         this.url = url;
//         this.options = options;
//         this._connect = this._connect.bind(this);
//         this.connection = null;
//         this.opened = false;
//         this._connect();
//     }

//     observe(observers) {
//         _.each(observers, function (key, observer, observers) {
//             if (!_.has(this.observers, key)) {
//                 this.observers[key] = [];
//             }
//             if (_.isArray(observer)){
//                 this.observers[key] = _.union(observer, this.observers[key])
//             } else {
//                 this.observers[key].push(observer);
//             }
//         });
//     }
    
//     _connect() {
//         var self = this;
//         this.connection = null;
//         this.connection = new SockJS(this.url, this.options);

//         this.connection.onopen = function() {
//             self.opened = true;
//             console.log('SOCKET OPEN');
//         };

//         this.connection.onmessage = function(e) {
//             var data = e.data;
//             var msg;
//             try {
//                 msg = JSON.parse(data);
//             } catch (e) {
//                 console.log("JSON parse Error:", data);
//             }

//             var observers = self.observers[msg.type];
//             _.each(observers, (observer) => observer(msg));

//             console.log('RECEIVED ', msg);
//         };

//         this.connection.onclose = function() {
//             console.log('SOCKET CLOSED');
//             self.connection = null;
//         };
//     }

//     isInitialized() {
//         return this.connection != null;
        
//      }

//     _prepare(data) {
//         try {
//             return JSON.stringify(data);
//         } catch(e) {
//             console.log("JSON serialize Error:", data);
//             return null;
//         }
//     }

//     send(msg) {
//         if (!this.isInitialized()) {
//             return false;
//         }

//         var data = this._prepare(msg);

//         if (!data) {
//             return false;
//         }
        
//         try {
//             this.connection.send(data);
//             return true;
//         } catch(e) {
//             return false;
//         }
//     }
// }

export default Connection;