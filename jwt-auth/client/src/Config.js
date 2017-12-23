

var Config = {};

(function(){
    Config.SOCKET_URL = "http://localhost:8881";
    Config.REGISTER_URL = Config.SOCKET_URL + "/register";
    Config.AUTH_URL = Config.SOCKET_URL + "/auth";
    Object.freeze(Config);
})();


export default Config;