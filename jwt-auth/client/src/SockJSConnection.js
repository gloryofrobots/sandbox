import _ from "underscore";
import SockJS from "sockjs-client";
import * as tokens from './tokens';

class SockJSConnection {
    constructor(url, observers, options){
        this.observers = {};
        this.observe(observers);
        this.url = url;
        this.options = options;
        this._connect = this._connect.bind(this);
        this.connection = null;
        this.opened = false;
        this._connect();
    }

    observe(observers) {
        var self = this;
        _.each(observers, function (key, observer, observers) {
            if (!_.has(self.observers, key)) {
                self.observers[key] = [];
            }
            if (_.isArray(observer)){
                self.observers[key] = _.union(observer, this.observers[key])
            } else {
                self.observers[key].push(observer);
            }
        });
    }
    
    _connect() {
        var self = this;
        this.connection = null;
        this.connection = new SockJS(this.url, this.options);

        this.connection.onopen = function() {
            self.opened = true;
            console.log('SOCKET OPEN');
        };

        this.connection.onmessage = function(e) {
            var data = e.data;
            var msg;
            try {
                msg = JSON.parse(data);
            } catch (e) {
                console.log("JSON parse Error:", data);
            }

            var observers = self.observers[msg.type];
            _.each(observers, (observer) => observer(msg.data));

            console.log('RECEIVED ', msg);
        };

        this.connection.onclose = function() {
            console.log('SOCKET CLOSED');
            self.connection = null;
        };
    }

    close(){
        this.connection.close();
    }

    isInitialized() {
        return this.connection != null;
        
     }

    _prepare(data) {
        try {
            return JSON.stringify(data);
        } catch(e) {
            console.log("JSON serialize Error:", data);
            return null;
        }
    }

    send(action, payload) {
        var token = tokens.getToken();
        if (!token) {
            console.error("send:SESSION IS DEAD");
            return
        }

        var msg = {
            action:action,
            jwt:token,
            data:payload
        }

        if (!this.isInitialized()) {
            console.log("send:connection is closed");
            return false;
        }

        var data = this._prepare(msg);

        if (!data) {
            console.log("send:data is null");
            return false;
        }
        
        try {
            this.connection.send(data);
            return true;
        } catch(e) {
            console.log("send: exception",e);
            return false;
        }
    }
}

export default SockJSConnection;