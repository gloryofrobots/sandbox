
let Config = {};
Config.SERVER_URL = "http://localhost:8881";
Config.REGISTER_URL = Config.SERVER_URL + "/register";
Config.AUTH_URL = Config.SERVER_URL + "/auth";
Config.ECHO_URL = Config.SERVER_URL + "/echo";
Config.TIME_ECHO_URL = Config.SERVER_URL + "/time_echo";
Config.TOKEN_COOKIE = "JWT";
Object.freeze(Config);

export default Config;


