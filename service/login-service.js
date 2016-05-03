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
// Imports
var fileService = require('./file-service');

var supportedMimeTypes = {'image/jpg': 'jpg', 'image/jpeg': 'jpg', 'image/png': 'png'};
var maxAttachments = Conf.maxAttachments;

// Global variables
var users = {};

/**
 * Init method
 */
var init = function () {
  users[Conf.admin.login] = {"password": Conf.admin.password};
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
    users[login] = {"password": password};
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
  } else if (users[login].password != password) {
    success = false;
    data.elements.push('password');
  }
  callback(success, success ? null : data);
};

/**
 * Attempt to update profile settings (email, password, etc...)
 * @param profile the user profile
 * @param callback to be called with result
 */
var updateProfile = function (profile, callback) {
  var update = {
    elements : []
  };
  var userProfile = users[profile.login];
  if (profile.password && userProfile.password != profile.password) {
    // If password has been updated
    userProfile.password = profile.password;
    update.elements.push('password');
  }
  if (profile.picture) {
    // If picture has been updated
    var attachment = profile.picture;
    if (isSupportedMimeType(attachment.mimeType)) {
      fileService.storeProfile(profile.login, attachment);
      update.picture = Conf.server.baseUrl + '/2.0/files/usr-' + profile.login + '.' + supportedMimeTypes[attachment.mimeType.toLowerCase()];
      update.elements.push('picture');
      userProfile.picture = update.picture;
    }
  }
  if (userProfile.email != profile.email) {
    // If email has been updated
    userProfile.email = profile.email;
    update.elements.push('email');
  }
  callback(update);
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
 */
var findAll = function () {
  var results = [];
  for (var user in users) {
    results.push({login: user, picture: users[user].picture, email: users[user].email});
  }
  return results;
};

/**
 * Find all users
 * @param login the user login
 * @returns Object
 */
var findOne = function (login) {
  var u = users[login];
  if (u) {
    return {login: login, picture: u.picture, email: u.email};
  }
  return null;
};

/**
 * Check if user is admin
 * @param login the user login
 * @param password the user password
 * @returns {boolean} true if admin, false otherwise
 */
var isAdmin = function (login, password) {
  // Trim credentials
  login = login ? login.trim() : undefined;
  password = password ? password.trim() : undefined;
  return (login === Conf.admin.login && password === Conf.admin.password);
};


/**
 * Check whether mime type is supported or not
 * @param mimeType the file mime type
 * @returns {boolean} true if supported, false otherwise
 */
var isSupportedMimeType = function (mimeType) {
  mimeType = mimeType.toLowerCase();
  return supportedMimeTypes.hasOwnProperty(mimeType);
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
  "findOne": findOne,
  "isAdmin": isAdmin,
  "updateProfile": updateProfile
};
