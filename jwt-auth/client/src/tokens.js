
import Config from "./Config";

import Cookies from 'universal-cookie';

let cookies = new Cookies();

function saveToken(token, exp) {
    cookies.set(Config.TOKEN_COOKIE, token, {expires:new Date(parseInt(exp) + 10000 * 32), path:"/"});
}

function hasToken(){
    return getToken() != undefined;
}
function getToken(){
    return cookies.get(Config.TOKEN_COOKIE);
}

function removeToken(){
    return cookies.remove(Config.TOKEN_COOKIE);
}

export {saveToken, getToken, removeToken, hasToken}