
import SockJS from "sockjs-client";
import _ from "underscore";

class Connection {
    constructor(url, options, observers){
        this.observers = observers || {};
        this.url = url;
        this.options = options;
        this._connect = this._connect.bind(this);
        this.connection = null;
        this.opened = false;
        _connect();
    }

    addObservers(observers) {
        _.each(observers, function (key, observer, observers) {
            if (!_.has(this.observers, key)) {
                this.observers[key] = [];
            }
            this.observers[key].push(observer);
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
            _.each(observers, (observer) => observer(msg));

            console.log('RECEIVED ', msg);
        };

        this.connection.onclose = function() {
            console.log('SOCKET CLOSED');
            self.connection = null;
        };
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

    send(msg) {
        if (!this.isInitialized()) {
            return false;
        }

        var data = _prepare(msg);

        if (!data) {
            return false;
        }
        
        try {
            this.connection.send(data);
            return true;
        } catch(e) {
            return false;
        }
    }
}

export default Connection;