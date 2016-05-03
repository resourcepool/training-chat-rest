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
var messages = [];

var observers = [];


/**
 * Init method
 */
var init = function () {
};

/**
 * Add message-change observer
 * @param o
 */
var addObserver = function(o) {
  observers.push(o);
};

/**
 * Find all messages
 * @returns {Array}
 */
var findAll = function (head, limit, offset) {
  if (!limit || limit <= 0) {
    limit = Conf.maxMessagesResults;
  }
  if (!offset || offset < 0) {
    offset = 0;
  }
  if (head) {
    for (var i = 0; i < messages.length; i++) {
      var m = messages[i];
      if (m.uuid === head) {
        offset += messages.length - i - 1;
      }
    }
  }
  // If we have a valid limit and offset
  // If offset is bigger than messages length, return empty array
  if (offset > messages.length) {
    return [];
  }
  // Otherwise, return subtable.
  return messages.slice(Math.max(messages.length - (parseFloat(offset) + parseFloat(limit)), 0), messages.length - offset); 
};

/**
 * Reset messages
 */
var reset = function () {
  messages = [];
  init();
};

/**
 * Post message to the chat
 * @param data
 * @param notify
 */
var post = function (data, notify) {
  data = {'uuid': data.uuid, 'login': data.login, 'message': data.message, 'attachments': data.attachments};
  //Push data to news
  console.log("Received message from " + data.login + ": " + data.message);
  // If file has attachments
  if (data.attachments) {
    var attachmentsUrls = [];
    for (var i = 0; i < Math.min(data.attachments.length, maxAttachments); i++) {
      var attachment = data.attachments[i];
      if (isSupportedMimeType(attachment.mimeType)) {
        fileService.store('msg-' + data.uuid, attachment);
        attachmentsUrls.push(Conf.server.baseUrl + '/2.0/files/msg-' + data.uuid + '/' + i + '.' + supportedMimeTypes[attachment.mimeType.toLowerCase()]);
      }
    }
    data.images = attachmentsUrls;
  }
  delete data.attachments;
  // Remove oldest messages when maximum size is reached
  if (messages.length === Conf.maxMessagesInQueue) {
    messages.shift();
  }
  messages.push(data);
  if (notify && observers) {
    // Notify observers
    observers.forEach(function(o) {
      o(data);
    });  
  }
};


/**
 * @param uuid the message uuid
 * @returns {boolean} true if messages already contain the message
 */
var contains = function (uuid) {
  for (var i in messages) {
    var message = messages[i];
    if (message.uuid === uuid) {
      return true;
    }
  }
  return false;
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
  "reset": reset,
  "findAll": findAll,
  "post": post,
  "contains": contains,
  "addObserver": addObserver
};
