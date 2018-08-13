
let CONF = {};
CONF.SERVER_URL = "http://localhost:8882";
CONF.SOCKET_ENTRY_URL = CONF.SERVER_URL + "/api"
CONF.SOCKET_CHECK_INTERVAL = 10000;
CONF.TOKEN_BASENAME = "TERM_";
Object.freeze(CONF);

export default CONF;


