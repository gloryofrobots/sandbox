import _ from "underscore";
import SockJS from "sockjs-client";
import Cookies from 'universal-cookie';

class Monitor{
    constructor(connection, period){
        // weakref
        this.connection = connection;
        this.interval = null;
        this.period = period;
        this.monitor = this.monitor.bind(this);
    }

    start(){
        if (this.interval !== null) {
            stop();
        }

        this.interval = setInterval(this.monitor, this.period);
    }

    stop(){
        if (this.interval === null) {
            return;
        }
        clearInterval(this.interval);
        this.interval = null;
    }

    destroy(){
        stop();
        // clear weakref
        this.connection = undefined;
    }

    monitor() {
        // console.log("monitor");
        if(this.connection.isOpen()) {
            return;
        }

        this.connection.open();
    }

}



class SockJSConnection {
    constructor(url, observers, options){
        this.connection = null;

        this.opened = false;
        this.observers = {};
        this.observe(observers || {});

        this.url = url;
        this.options = options || {};
        
        if (_.has(this.options, "monitorInterval") && this.options.monitorInterval >= 1000){
            this.monitor = new Monitor(this, this.options.monitorInterval;
        }
        this.open();
    }

    __observe(key, observer) {
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
               (observer, key, observers) => self.__observe(key, observer)
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
            this.monitor.destroy();
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

    send(msg) {
        if (!this.isOpen()) {
            console.log("send:connection is closed");
            return false;
        }

        var data = this._prepare(msg || {});

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

    createSession(tokenName, observers) {
        return  new Session(this, tokenName);
    }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

class Session{
    constructor(connection, tokenName) {
        this.tokenName = tokenName;
        this.cookies = new Cookies();
    }

    save(token, exp) {
        this.cookies.set(this.tokenName, token, {expires:new Date(parseInt(exp, 10) + 1000 * 10), path:"/"});
    }

    exists(){
        return this.getId() !== undefined;
    }

    getId(){
        return this.cookies.get(this.tokenName);
    }

    logout(){
        return this.cookies.remove(this.tokenName);
    }

    send(action, payload) {
        if(!this.exists()) {
            console.error("Session:send not active");
        }

        var data = {
            action=action,
            sid=this.getId(),
            data:payload
       }
       return this.connection.send(data);
    }
}


export default SockJSConnection;