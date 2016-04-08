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

var attachments = {};

/**
 * Init method
 */
var init = function () {
};

/**
 * Reset files
 */
var reset = function () {
  attachments = {};
  init();
};

/**
 * Store attachment
 * @param uuid the message uuid
 * @param attachment the attachment
 */
var store = function (uuid, attachment) {
  if (!attachments[uuid]) {
    attachments[uuid] = [];
  }
  attachments[uuid].push(attachment);
};

/**
 * @param uuid 
 * @param element
 * @returns {*|boolean} true if the attachments contain the element or false otherwise.
 */
var contains = function (uuid, element) {
  return attachments[uuid] && attachments[uuid].length > (element || 0);
};

/**
 * Retrieve 
 * @param uuid
 * @param element
 * @returns {*} the attachment
 */
var retrieve = function (uuid, element) {
  return attachments[uuid][element || 0];
};

// Initialize service
init();

// Exports
module.exports = {
  "init": init,
  "reset": reset,
  "retrieve": retrieve,
  "store": store,
  "contains": contains
};
