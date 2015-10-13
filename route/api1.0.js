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

//Node package imports
var express = require('express');
var bodyParser = require('body-parser');

//Global variables
var loginService = require('../service/login-service');
var messageService = require('../service/message-service');
var HttpUtils = require('../util/http-utils');

/**
 * Proceed authentication with Http Basic Auth
 * @param req the http request
 * @param res the http response
 * @returns {*} a promise which will be resolved only if auth is successful
 */
var authenticate = function (req, res) {
  return new Promise(function (resolve, reject) {
    var credentials = {};

    // Params authentication
    credentials.login = req.params.login;
    credentials.password = req.params.password;

    loginService.login(credentials.login, credentials.password, function (success, data) {
      if (success) {
        resolve();
      } else {
        reject(data);
      }
    });
  }).catch(function (data) {
        HttpUtils.rejectUnauthorized(res, {"status": 401, "message": data.message, "elements": data.elements});
      });
};

// Exports
module.exports = function (app) {

//-------------------------------------------------------------------------------
// API 1.0
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// REGISTER
//-------------------------------------------------------------------------------
  app.route('/1.0/register/:login/:password')
      .post(function (req, res) {
        loginService.register(req.params.login, req.params.password, function (success, data) {
          if (success) {
            res.status(200).json(HttpUtils.messages.registerSuccessfulMsg);
            return;
          }
          HttpUtils.rejectBadRequest(res, {"status": 400, "message": data.message, "elements": data.elements});
        });
      });

//-------------------------------------------------------------------------------
// LOGIN
//-------------------------------------------------------------------------------
  app.route('/1.0/connect/:login/:password')
      .get(function (req, res) {
        authenticate(req, res)
            .then(function () {
              res.status(200).json(HttpUtils.messages.loginSuccessfulMsg);
            }
        );
      });

//-------------------------------------------------------------------------------
// MESSAGE
//-------------------------------------------------------------------------------
  app.route('/1.0/messages/:login/:password')
      .get(function (req, res) {
        authenticate(req, res)
            .then(function () {
              var messages = messageService.findAll();
              res.status(200).json(messages);
            }
        );
      })
      .post(function (req, res) {
        authenticate(req, res)
            .then(function () {
              var content = req.body;
              if (!content.uuid || !content.login || !content.message) {
                HttpUtils.rejectBadRequest(res, HttpUtils.messages.postErrorMsg);
                return;
              }
              if (messageService.contains(content.uuid)) {
                HttpUtils.rejectBadRequest(res, HttpUtils.messages.postErrorUuidExistsMsg);
                return;
              }
              // Enforce login consistency
              req.body.login = req.params.login;
              messageService.post(req.body);
              res.status(200).json(HttpUtils.messages.postSuccessfulMsg);
            }
        );
      });


};