import Cookies from "js-cookie";

const TOKEN_KEY = "token";

export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
}

export const setToken = (value, expirse) => {
    if(expirse) {
        Cookies.set(TOKEN_KEY, value, expirse);
    } else {
        Cookies.set(TOKEN_KEY, value);
    }
}