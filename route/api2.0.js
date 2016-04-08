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

// Services
var userService = require('../service/login-service');
var messageService = require('../service/message-service');
var fileService = require('../service/file-service');
var securityService = require('../service/security-service');
var HttpUtils = require('../util/http-utils');

/**
 * Proceed authentication with Http Basic Auth
 * @param req the http request
 * @param res the http response
 * @returns {*} a promise which will be resolved only if auth is successful
 */
var authenticate = function (req, res) {
  return new Promise(function (resolve, reject) {

    var header = req.headers['authorization'] || '';
    // Basic authentication
    var token = header.split(/\s+/).pop() || '';
    var credentials = parseCredentials(token);

    userService.login(credentials.login, credentials.password, function (success, data) {
      if (success) {
        resolve(credentials.login);
      } else {
        reject(data);
      }
    });
  }).catch(function (data) {
    HttpUtils.rejectUnauthorized(res, {"status": 401, "message": data.message, "elements": data.elements}, true);
  });
};

/**
 * Parse credentials from a Basic auth token
 * @param basicAuthToken
 * @returns {{login: *, password: *}}
 */
var parseCredentials = function (basicAuthToken) {
  var auth = new Buffer(basicAuthToken, 'base64').toString();    // convert from base64
  var parts = auth.split(/:/);                          // split on colon
  return {'login': parts[0], 'password': parts[1]};
};

/**
 * Ensures a Content-Type:application/json is present on the request
 * @param req the http request
 * @param res the http response
 * @returns {*} a Promise which will be resolved only if test is successful
 */
var checkHeaders = function (req, res) {
  return new Promise(function (resolve, reject) {
    if (!req.is('application/json')) {
      reject();
    } else {
      resolve();
    }
  }).catch(function () {
    HttpUtils.rejectBadRequest(res, HttpUtils.messages.wrongHeadersErrorMsg);
  });
};

// Exports
module.exports = function (app) {

//-------------------------------------------------------------------------------
// API 2.0
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// REGISTER
//-------------------------------------------------------------------------------
  app.route('/2.0/register')
      .post(function (req, res) {
        checkHeaders(req, res)
            .then(function () {
              var credentials = req.body || {};
              userService.register(credentials.login, credentials.password, function (success, data) {
                if (success) {
                  res.json(HttpUtils.messages.registerSuccessfulMsg);
                  return;
                }
                if (data) {
                  data.status = 400;
                }
                HttpUtils.rejectBadRequest(res, data ? data : HttpUtils.messages.registerErrorMsg);
              });
            });
      });

//-------------------------------------------------------------------------------
// LOGIN
//-------------------------------------------------------------------------------
  app.route('/2.0/connect')
      .get(function (req, res) {
        authenticate(req, res)
            .then(function () {
              res.json(HttpUtils.messages.loginSuccessfulMsg);
            });
      });

//-------------------------------------------------------------------------------
// PROFILE
//-------------------------------------------------------------------------------
  app.route('/2.0/profile/:login')
      .get(function (req, res) {
        authenticate(req, res)
            .then(function (login) {
              res.json(userService.findOne(req.params.login));
            });
      });

  app.route('/2.0/profile')
      .post(function (req, res) {
        checkHeaders(req, res)
            .then(function () {
              return authenticate(req, res);
            })
            .then(function (login) {
              var content = req.body;
              // Enforce login consistency
              content.login = login;
              if (!content.password && !content.picture && !content.email) {
                HttpUtils.rejectBadRequest(res, HttpUtils.messages.profileUpdateErrorMsg);
                return;
              }
              userService.updateProfile(content, function (newProfile) {
                res.json(newProfile);
              });
            });
      });

//-------------------------------------------------------------------------------
// MESSAGE
//-------------------------------------------------------------------------------
  app.route('/2.0/messages')
      .get(function (req, res) {
        authenticate(req, res)
            .then(function () {
              var messages = messageService.findAll(req.query.head, req.query.limit, req.query.offset);
              res.json(messages);
            });
      })
      .post(function (req, res) {
        checkHeaders(req, res)
            .then(function () {
              return authenticate(req, res);
            })
            .then(function (login) {
              var content = req.body;
              // Enforce login consistency
              content.login = login;
              if (!content.uuid || !content.login || !content.message) {
                HttpUtils.rejectBadRequest(res, HttpUtils.messages.postErrorMsg);
                return;
              }
              if (messageService.contains(content.uuid)) {
                HttpUtils.rejectBadRequest(res, HttpUtils.messages.postErrorUuidExistsMsg);
                return;
              }
              messageService.post(content, true);
              res.json(HttpUtils.messages.postSuccessfulMsg);
            });
      });

//-------------------------------------------------------------------------------
// FILE
//-------------------------------------------------------------------------------
  app.route('/2.0/files/:uuid/:element.:ext')
      .get(function (req, res) {
        authenticate(req, res)
            .then(function () {
              if (!fileService.contains(req.params.uuid, req.params.element)) {
                HttpUtils.rejectNotFound(res, HttpUtils.messages.noSuchElement);
              }
              var attachment = fileService.retrieve(req.params.uuid, req.params.element);
              res.setHeader('Content-Type', attachment.mimeType);
              res.send(new Buffer(attachment.data, 'base64'));
            });
      });

  app.route('/2.0/files/:uuid.:ext')
      .get(function (req, res) {
        authenticate(req, res)
            .then(function () {
              if (!fileService.contains(req.params.uuid)) {
                HttpUtils.rejectNotFound(res, HttpUtils.messages.noSuchElement);
              }
              var attachment = fileService.retrieve(req.params.uuid);
              res.setHeader('Content-Type', attachment.mimeType);
              res.send(new Buffer(attachment.data, 'base64'));
            });
      });

//-------------------------------------------------------------------------------
// ADMIN
//-------------------------------------------------------------------------------
  app.route('/2.0/admin/users')
      .get(function (req, res) {
        var header = req.headers['authorization'] || '';
        var token = header.split(/\s+/).pop() || '';
        var credentials = parseCredentials(token);
        if (userService.isAdmin(credentials.login, credentials.password)) {
          var users = userService.findAll();
          res.json(users);
          return;
        }
        HttpUtils.rejectUnauthorized(res, HttpUtils.messages.accessDeniedAdminMsg);
      });

  app.route('/2.0/admin/reset')
      .post(function (req, res) {
        var header = req.headers['authorization'] || '';
        var token = header.split(/\s+/).pop() || '';
        var credentials = parseCredentials(token);
        if (userService.isAdmin(credentials.login, credentials.password)) {
          userService.reset();
          messageService.reset();
          fileService.reset();
          res.json(HttpUtils.messages.operationSuccessMsg);
          return;
        }
        HttpUtils.rejectUnauthorized(res, HttpUtils.messages.accessDeniedAdminMsg);
      });

};