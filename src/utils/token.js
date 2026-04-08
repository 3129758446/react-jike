const TOKENKEY = 'token_key'

function getToken() {
    return localStorage.getItem(TOKENKEY)
}

function setToken(token) {
    return localStorage.setItem(TOKENKEY, token)
}

function removeToken() {
    return localStorage.removeItem(TOKENKEY)
}

export { getToken, setToken, removeToken }