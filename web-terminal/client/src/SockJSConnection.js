import _ from "underscore";
import SockJS from "sockjs-client";
import Cookies from 'universal-cookie';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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
            this.stop();
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
        this.stop();
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
        this.sockjs = null;

        this.opened = false;

        this.url = url;
        this.options = options || {};
        
        this.sessions = [];

        if (_.has(this.options, "monitorInterval") && this.options.monitorInterval >= 1000){
            this.monitor = new Monitor(this, this.options.monitorInterval);
        }
        this.open();
    }

    open() {
        if (this.sockjs) {
            this.sockjs.close();
        }
        this.sockjs = new SockJS(this.url, this.options);
        this.sockjs.onopen = this.onOpen.bind(this);

        this.sockjs.onmessage = this.onMessage.bind(this);
        this.sockjs.onclose = this.onClose.bind(this);
    }
    
    onMessage(e) {
        var data = e.data;
        var msg;
        try {
            msg = JSON.parse(data);
        } catch (e) {
            console.log("JSON parse Error:", data);
        }

        var session = this.sessions[msg.sid];
        if (!session) {
            console.error("SJConn:onMessage bad session");
            return;
        }

        session.receive(msg);
    }

    onClose() {
        console.log('SOCKET CLOSED');
        this.sockjs = null;
        this.opened = false;
    }

    isOpen(){
        return this.sockjs !== null && this.opened === true;
    }

    onOpen(){
        this.opened = true;
        console.log('SOCKET OPEN');
    }

    close(){
        this.sockjs.close();
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

    _send(msg) {
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
            this.sockjs.send(data);
            return true;
        } catch(e) {
            console.log("send: exception",e);
            return false;
        }
    }

    createSession(tokenName) {
        var id = _.size(this.sessions);
        var session =  new Session(id, this, tokenName);
        this.sessions.push(session);
        return session;
    }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

class Session{
    constructor(id, connection, tokenName, observers) {
        this.tokenName = tokenName;
        this.cookies = new Cookies();
        this.observers = {
            "SESSION_TERMINATED":(msg) => {
                this.logout();
            }
        };
        this.observe(observers || {});
        this.token = null;
        this.id = id;
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

    save(token, exp) {
        this.cookies.set(this.tokenName, token, {expires:new Date(parseInt(exp, 10) + 1000 * 10), path:"/"});
    }

    exists(){
        return this.cookies.has(this.tokenName);
    }

    getToken(){
        if (!this.token)  {
            this.token =  this.cookies.get(this.tokenName);
        }
        return this.token;
    }

    logout(){
        this.token = null;
        this.cookies.remove(this.tokenName);
    }

    receive(msg){
        var token = msg.token;
        if (token !== this.getToken()){
            console.error("session:receive tokens not match");
            return;
        }

        var observers;
        if (_.has(msg, "rid")){
            var handlers = this.handlers[msg.rid];
            if (!handlers) {
                console.error("Invalid RID!")
                return;
            }
            observers = handlers[msg.action];
            // faster than delete
            this.handlers[msg.rid] = undefined;
        } else {
            observers = this.observers[msg.action];
        }

        _.each(observers, (observer) => observer(msg.data));
        console.log('RECEIVED ', this.tokenName, msg, this.observers);
    }

    addResponseHandler(callback) {
        var requestId = getRandomInt(0, 100000);

        while(!_.isUndefined(this.handlers, requestId)) {
            requestId = getRandomInt(0, 100000);
        }

        this.handlers[requestId] = callback;
        return requestId;
    }

    authenticate(action, payload, callback) {
       if (this.exists()) {
            throw new Error("Session has already authenticated");
       }

       var requestId = this.addResponseCallback(
           (msg) => {
               if(callback(msg) === true) {
                   this.save(msg.data.token, msg.data.exp);
               }
           }
       );

       var data = {
            sid:this.id,
            rid:requestId,
            action:action,
            data:payload
       }

       return this.connection._send(data);
    }

    sendSync(action, payload, callback) {
       if(!this.exists()) {
           console.error("Session:send not active");
            return;
       }

       var requestId = this.addResponseCallback(callback);
       var data = {
            action:action,
            sid:this.id,
            rid:requestId,
            token:this.getToken(),
            data:payload
       }

       return this.connection._send(data);
    }

    send(action, payload) {
       if(!this.exists()) {
           console.error("Session:send not active");
            return;
       }

       var data = {
            action:action,
            sid:this.id,
            token:this.getToken(),
            data:payload
       }

       return this.connection._send(data);
    }
}


export default SockJSConnection;