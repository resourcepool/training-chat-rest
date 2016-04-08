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
var loginService = require('../service/login-service');
var messageService = require('../service/message-service');
var securityService = require('../service/security-service');
var HttpUtils = require('../util/http-utils');
var HashMap = require('hashmap');
var SocketIO = require('socket.io');

var AuthSuccessMsg = require('../websocket/auth-success-msg.js');
var AuthFailedMsg = require('../websocket/auth-failed-msg.js');
var AuthRequiredMsg = require('../websocket/auth-required-msg.js');
var AuthTokenMsg = require('../websocket/auth-token-msg.js');
var OutboundMsg = require('../websocket/outbound-msg.js');
var InboundMsg = require('../websocket/inbound-msg.js');
var BadRequestMsg = require('../websocket/bad-request-msg.js');
var PostSuccessMsg = require('../websocket/post-success-msg.js');
var ActiveUsersRequest = require('../websocket/active-users-request-msg.js');
var ActiveUsersUpdate = require('../websocket/active-users-update-msg.js');

var io;
var activeClients = new HashMap();

/**
 * Proceed authentication with Token-based Auth
 * @param socket the client socket
 * @param credentials the credentials (token and login)
 * @returns {*} a promise which will be resolved only if auth is successful
 */
var authenticate = function (socket, credentials) {
  return new Promise(function (resolve, reject) {
    if (securityService.isValidToken(credentials.login, credentials.token)) {
      resolve(credentials.login);
    } else {
      reject();
    }
  }).catch(function () {
    console.log("Auth failed");
    // Login failure. Notify client
    AuthFailedMsg.emitOn(socket);
  });
};

// Exports
module.exports = function (server) {

//-------------------------------------------------------------------------------
// Websocket-API
//-------------------------------------------------------------------------------
  io = SocketIO(server);

  io.of('/2.0/ws')
      .on('connection', function (socket) {
        console.log("New connection established");
        // Emit auth required message
        AuthRequiredMsg.emitOn(socket);
        // Message handlers
        socket.on('auth_attempt', function (payload) {
          handleAuthAttempt(payload, socket);
        });
        socket.on('outbound_msg', function (payload) {
          handleOutboundMessage(payload, socket);
        });
        socket.on('active_users_request', function (payload) {
          handleActiveUsersMessage(payload, socket);
        });
        socket.on('end', function(payload) {
          socket.disconnect(true);
        })
      });

//-------------------------------------------------------------------------------
// REGISTER
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// LOGIN
//-------------------------------------------------------------------------------
  function handleAuthAttempt(payload, socket) {
    console.log("Received auth attempt");
    // Parse auth payload
    var credentials = AuthTokenMsg.parse(payload);
    // Attempt login
    loginService.login(credentials.login, credentials.password, function (success, data) {
      if (success) {
        console.log("Auth successful");
        var token = securityService.createToken(credentials.login);
        
        activeClients.set(credentials.login, socket);
        
        // Login success. Add ws to list and emit success msg
        new AuthSuccessMsg(credentials.login, token).emitOn(socket);
        
        // Broadcast active users
        new ActiveUsersUpdate(activeClients.keys()).broadcastOn(socket);
        
        // Create Disconnect handle
        socket.on('disconnect', function () {
          activeClients.remove(credentials.login);
          // Broadcast active users
          new ActiveUsersUpdate(activeClients.keys()).broadcastOn(socket);
        });
      } else {
        console.log("Auth failed");
        // Login failure. Notify client
        AuthFailedMsg.emitOn(socket);
        // FIXME should we close socket?
      }
    });
  }


//-------------------------------------------------------------------------------
// MESSAGE
//-------------------------------------------------------------------------------

  function handleOutboundMessage(payload, socket) {
    console.log("Received inbound message");
    var message = OutboundMsg.parse(payload);
    authenticate(socket, {"login": message.login, "token": message.token})
        .then(function (login) {
          if (!message.uuid || !message.login || !message.message) {
            // Emit bad request message
            new BadRequestMsg(HttpUtils.messages.postErrorMsg).emitOn(socket);
            return;
          }
          if (messageService.contains(message.uuid)) {
            new BadRequestMsg(HttpUtils.messages.postErrorUuidExistsMsg).emitOn(socket);
            return;
          }
          // Save message in DB
          messageService.post(message);
          // Send success acknowledgment
          new PostSuccessMsg(message.uuid, HttpUtils.messages.postSuccessfulMsg).emitOn(socket);
          // Broadcast message to active users
          new InboundMsg(message).broadcastOn(socket);
        })
  }

//-------------------------------------------------------------------------------
// ACTIVE USERS
//-------------------------------------------------------------------------------

  function handleActiveUsersMessage(payload, socket) {
    console.log("Received active users request");
    var message = ActiveUsersRequest.parse(payload);
    authenticate(socket, {"login": message.login, "token": message.token})
        .then(function (login) {
          // Broadcast active users
          new ActiveUsersUpdate(activeClients.keys()).broadcastOn(socket);
        });
  }
  
};