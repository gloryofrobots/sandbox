import _ from "underscore";
import Cookies from 'universal-cookie';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


class Session{
    constructor(id, connection, tokenName, observers) {
        this.cookies = new Cookies();
        this.id = id;
        this.connection = connection;
        this.tokenName = tokenName;
        this.observers = {
            "SESSION_TERMINATED":(msg) => {
                this.logout();
            }
        };
        this.observe(observers || {});
        this.handlers = {};

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
            console.error("expecting object{route:obserber || [...observers]}")
            return;
         }
        _.each(observers,
               (observer, key, observers) => self.__observe(key, observer)
        );

        console.log("OBSERVE AFTER", this.observers);
    }

    save(token, exp) {
        this.cookies.set(this.tokenName, token, {expires:new Date(parseInt(exp, 10)) , path:"/"});
    }

    exists(){
        return this.getToken() != undefined;
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

    isError(msg) {
        return msg.route.startsWith("ERROR");
    }

    receive(msg){
        var token = msg.token;
        if (token !== this.getToken()){
            console.error("session:receive tokens not match");
            return;
        }

        console.log('SESSION ' + this.id + ' RECEIVED ', this.tokenName, msg);
        if (_.has(msg, "rid")){
            var observer = this.handlers[msg.rid];
            if (!observer) {
                console.error("Invalid RID!")
                return;
            }
            console.log("OBSERVER", observer, this.handlers)
            observer(msg)
            // faster than delete
            this.handlers[msg.rid] = undefined;
        } else {
            var observers = this.observers[msg.route];
            _.each(observers, (observer) => observer(msg.data));
        }

    }

    addResponseHandler(callback) {
        var requestId = getRandomInt(0, 100000);

        while(!_.isUndefined(this.handlers[requestId])) {
            requestId = getRandomInt(0, 100000);
        }

        this.handlers[requestId] = callback;
        return requestId;
    }

    authenticate(callback, route, payload) {
       if (this.exists()) {
            throw new Error("Session has been already authenticated");
       }

       var requestId = this.addResponseHandler(
           (msg) => {
               if(callback(msg) === true) {
                    if (!this.isError(msg)) {
                        console.log("SAVING", msg.data.token, msg.data.exp);
                        this.save(msg.data.token, msg.data.exp);
                    }
               }
           }
       );

       return this.__send(route, payload, requestId);
    }

    sendSync(callback, route, payload) {
       if(!this.exists()) {
           console.error("Session:send not active");
            return;
       }
       var requestId = this.addResponseHandler(callback);
       return this.__send(route, payload, requestId);
    }

    send(route, payload) {
       if(!this.exists()) {
           console.error("Session:send not active");
            return;
       }

       this.__send(route, payload, undefined)
    }

    __send(route, payload, rid) {
       var data = {
            route:route,
            sid:this.id,
            token:this.getToken(),
            data:payload || {}
       }
       if (!_.isUndefined(rid)) {
           data.rid = rid
       }
       return this.connection.send(data);
    }
}


export default Session;
