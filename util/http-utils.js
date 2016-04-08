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
// Error handling
var rejectUnauthorized = function (res, message, useBasic) {
  res.status(401);
  if (useBasic) res.setHeader('WWW-Authenticate', 'Basic realm="Authentication Required"');
  res.json(message);
};
var rejectBadRequest = function (res, message) {
  res.status(400).json(message);
};
var rejectNotFound = function (res, message) {
  res.status(404).json(message);
};

// Error messages
var messages = {};
messages.wrongHeadersErrorMsg = {"status": 400, "message": "Please provide the Content-Type:application/json header"};
messages.registerSuccessfulMsg = {"status": 200, "message": "Registered successfully"};
messages.loginSuccessfulMsg = {"status": 200, "message": "Login successful"};
messages.postSuccessfulMsg = {"status": 200, "message": "Message posted successfully"};
messages.profileUpdateErrorMsg = {"status": 400, "message": "Bad structure of profile update: should at least contain a password, a picture, or an email. "};
messages.postErrorMsg = {"status": 400, "message": "Bad structure of message: should at least contain a login, an uuid and a message. Example: {\"uuid\":\"550e8400-e29b-41d4-a716-446655440000\", \"login\":\"foo\", \"message\": \"bar\"}"};
messages.postErrorUuidExistsMsg = {"status": 400, "message": "Your message has already been posted."};
messages.noSuchElement = {"status": 404, "message": "The following attachment does not exist."};
messages.accessDeniedAdminMsg = {"status": 401, "message": "Access denied. Only admin can access this resource"};
messages.operationSuccessMsg = {"status": 200, "message": "Operation succeeded"};
messages.registerErrorMsg = {"status": 400, "message": "Bad structure of request: should at least contain a login, and a password field. Example: {\"login\":\"foo\", \"password\":\"bar\"}"};
messages.postErrorUuidExistsMsg = {"status": 400, "message": "Your message has already been posted."};

// Exports
module.exports = {
  "messages": messages,
  "rejectBadRequest": rejectBadRequest,
  "rejectUnauthorized": rejectUnauthorized,
  "rejectNotFound": rejectNotFound
};