var HashMap = require('hashmap');
var uuid = require('node-uuid');
var tokens = new HashMap();

const SESSION_TIMEOUT = 300000;

/**
 * Init method
 */
var init = function () {

};

/**
 * Check token validity
 * @param token
 */
var isValidToken = function (login, token) {
  if (tokens.has(login)) {
    var t = tokens.get(login);
    return t ? (t.token === token) : false;
  }
};

/**
 * Add token for login
 * @param login
 * @param token
 */
var createToken = function (login) {
  var token = uuid.v4();
  tokens.set(login, {
    "timer": setTimeout(function () {
      // Logout after 5 minutes
      tokens.remove(login)
    }, SESSION_TIMEOUT), "token": token
  });
  return token;
};

/**
 * Remove token for login
 * @param login
 */
var removeToken = function (login) {
  var t = tokens.get(login);
  if (t) {
    clearTimeout(t.timer);
  }
  tokens.remove(login);
};

/**
 * Refresh token expiration
 */
var refreshToken = function (login) {
  var t = tokens.get(login);
  if (t) {
    clearTimeout(t.timer);
  }
  t.timer = setTimeout(function () {
    // Logout after 5 minutes
    tokens.remove(login)
  }, SESSION_TIMEOUT);
};


// Initialize service
init();

// Exports
module.exports = {
  "isValidToken": isValidToken,
  "createToken": createToken,
  "removeToken": removeToken,
  "refreshToken": refreshToken
};