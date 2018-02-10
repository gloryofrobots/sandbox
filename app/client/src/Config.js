
let Config = {};
Config.SERVER_URL = "http://localhost:8881";
Config.REGISTER_URL = Config.SERVER_URL + "/register";
Config.AUTH_URL = Config.SERVER_URL + "/auth";
Config.LOGOUT_URL = Config.SERVER_URL + "/logout";
Config.ECHO_URL = Config.SERVER_URL + "/echo";
Config.TIME_ECHO_URL = Config.SERVER_URL + "/time_echo";
Config.TOKEN_COOKIE = "JWT";
Config.SOCKET_CHECK_INTERVAL = 10000;
Object.freeze(Config);

export default Config;


