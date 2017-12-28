import _ from "underscore";
import Cookies from 'universal-cookie';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


class Session{
    constructor(id, connection, tokenName, observers) {
        this.id = id;
        this.connection = connection;
        this.tokenName = tokenName;
        this.observers = {
            "SESSION_TERMINATED":(msg) => {
                this.logout();
            }
        };
        this.observe(observers || {});

        this.cookies = new Cookies();
        this.token = null;
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
        return true;
        // return this.cookies.has(this.tokenName);
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


export default Session;
