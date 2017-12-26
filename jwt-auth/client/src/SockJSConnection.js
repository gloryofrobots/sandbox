import _ from "underscore";
import SockJS from "sockjs-client";
import * as tokens from './tokens';


class Monitor{
    constructor(period){
        this.connections = [];
        this.interval = null;
        this.period = period;
        this.monitor = this.monitor.bind(this);
    }

    monitor() {
        console.log("monitor");
        _.each(this.connections, function(connection) {
            if(!connection.isOpen()) {
                connection.open();
            }
        });
    }

    addConnection(connection) {
        //in case some time js stops being single threaded we stop current loop
        if(this.interval !== null){
            clearInterval(this.interval);
        }

        this.connections.push(connection);
        // this.interval = setInterval(this.monitor, this.period);
    }

    removeConnection(connection) {
        if(this.interval !== null){
            clearInterval(this.interval);
        }

        this.connections = _.without(this.connections, connection);

        if(this.connections.length !== 0){
            // this.interval = setInterval(this.monitor, this.period);
        }
    }
}


class SockJSConnection {
    constructor(url, observers, options){
        this.connection = null;

        this.opened = false;
        this.observers = {};
        this.observe(observers);

        this.url = url;
        this.options = options;
        // weakref
        this.monitor = null;
        this.open();
    }

    setMonitor(monitor) {
        this.monitor = monitor;
        this.monitor.addConnection(this);
    }

    addObserver(key, observer) {
        if (!_.has(this.observers, key)) {
            this.observers[key] = [];
        }
        if (_.isArray(observer)){
            this.observers[key] = _.union(observer, this.observers[key])
        } else {
            this.observers[key].push(observer);
        }
    }

    observe(observers) {
        var self = this;
        console.log("OBSERVE", observers);
        if (!_.isObject(observers)) {
            console.error("expecting object{action:obserber || [...observers]}")
            return;
         }
        _.each(observers,
               (observer, key, observers) => self.addObserver(key, observer)
        );

        console.log("OBSERVE AFTER", this.observers);
    }

    open() {
        if (this.connection) {
            this.connection.close();
        }
        this.connection = new SockJS(this.url, this.options);
        this.connection.onopen = this.onOpen.bind(this);

        this.connection.onmessage = this.onMessage.bind(this);

        this.connection.onclose = this.onClose.bind(this);
    }
    
    onMessage(e) {
        var data = e.data;
        var msg;
        try {
            msg = JSON.parse(data);
        } catch (e) {
            console.log("JSON parse Error:", data);
        }

        var observers = this.observers[msg.action];
        _.each(observers, (observer) => observer(msg.data));

        console.log('RECEIVED ', msg, this.observers);
    }

    onClose() {
        console.log('SOCKET CLOSED');
        this.connection = null;
        this.opened = false;
    }

    isOpen(){
        return this.connection !== null && this.opened === true;
    }

    onOpen(){
        this.opened = true;
        console.log('SOCKET OPEN');
    }

    close(){
        this.connection.close();
        if(this.monitor) {
            this.monitor.removeConnection(this);
            this.monitor = null;
        }
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
        payload = payload || {};
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

        if (!this.isOpen()) {
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

export  {SockJSConnection, Monitor};