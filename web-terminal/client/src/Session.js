
import Cookies from 'universal-cookie';

class Session{
    constructor(tokenName) {
        this.tokenName = tokenName;
        this.cookies = new Cookies();
    }

    save(token, exp) {
        this.cookies.set(this.tokenName, token, {expires:new Date(parseInt(exp, 10) + 1000 * 10), path:"/"});
    }

    exists(){
        return this.getToken() !== undefined;
    }

    getToken(){
        return this.cookies.get(this.tokenName);
    }

    destroy(){
        return this.cookies.remove(this.tokenName);
    }
}



export default Session;