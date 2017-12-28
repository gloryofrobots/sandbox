import _ from "underscore";
import SockJS from "sockjs-client";
import Session from "./Session";

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
    
    onMessage(event) {
        var data = event.data;

        var msg;
        try {
            msg = JSON.parse(data);
        } catch (e) {
            console.log("JSON parse Error:", e,  data);
            return;
        }

        console.log("RECEIVED", msg);
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
        console.log("monitor");
        if(this.connection.isOpen()) {
            return;
        }

        this.connection.open();
    }

}




export default SockJSConnection;