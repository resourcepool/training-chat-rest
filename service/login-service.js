/*
 Copyright 2015 Loïc Ortola
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
// Conf
var Conf = require('../conf/conf');

// Global variables
var users = {};

/**
 * Init method
 */
var init = function () {
  users[Conf.admin.login] = Conf.admin.password;
};

/**
 * Register new user
 * @param login the user login
 * @param password the password
 * @param callback to be called with result
 */
var register = function (login, password, callback) {
  if (!login || login === '' || !password || password === '') {
    callback(false);
    return;
  }
  // Trim credentials
  login = login.trim();
  password = password.trim();
  
  //Push data to news if relevant
  if (!users[login]) {
    console.log("Added user: " + login);
    users[login] = password;
    callback(true);
  } else {
    console.log("User already exists: " + login);
    callback(false, {"message": "User already exists", "elements": "login"});
  }
};

/**
 * Attempt to login
 * @param login the user login
 * @param password the password
 * @param callback to be called with result
 */
var login = function (login, password, callback) {
  if (!login || login === '' || !password || password === '') {
    callback(false, {"message": "Both Login and password fields are mandatory."});
    return;
  }
  // Trim credentials
  login = login.trim();
  password = password.trim();
  
  var success = true;
  var data = {"elements": [], "message": "Login or password incorrect"};

  if (!users[login]) {
    success = false;
    data.elements.push('login');
  } else if (users[login] != password) {
    success = false;
    data.elements.push('password');
  }
  callback(success, success ? null : data);
};

/**
 * Reset Users
 */
var reset = function() {
  users = {};
  init();
};

/**
 * Find all users
 * @returns {Array}
 */
var findAll = function () {
  var result = [];
  for (var user in users) {
    result.push(user);
  }
  return result;
};

/**
 * Check if user is admin
 * @param login the user login
 * @param password the user password
 * @returns {boolean} true if admin, false otherwise
 */
var isAdmin = function (login, password) {
  // Trim credentials
  login = login.trim();
  password = password.trim();
  return (login === Conf.admin.login && password === Conf.admin.password);
};

// Initialize service
init();

// Exports
module.exports = {
  "init": init,
  "login": login,
  "register": register,
  "reset": reset,
  "findAll": findAll,
  "isAdmin": isAdmin
};
