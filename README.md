# Chat API
This repository contains a Node.js / Express / Angularjs simple webapp for a chat.  
It can be used as a nice learning API.
Source code is available and released under the Apache 2.0 License.

## API Description
---------------
The API has been developed in multiple versions:
 * 1.0: Easiest to implement. Registration is done via an HTML page or via path variables, messages can be fetched with path variables.
 * 2.0: Harder to implement, but more secure. Login is done via basic HTTP, messages can contain attachments, can be fetched only with basic auth headers, and supports pagination.

The URI is formed of three parts:
{baseURL}/{versionPrefix}/{route}

An example instance was published on the following baseURL: http://training.loicortola.com/chat-rest

### 1.0
---------------
**versionPrefix: 1.0**

This API has permissive request Content-Types, and is best fit for beginners.

| Endpoint | Returns |
| ----- | ------ | ----------- | ------- |
| <ul><li>**Route:** ``/register/{login}/{password}``</li><li>**Method:** ``POST``</li><li>**Description:** Register new user to chat service through API</li></ul> |  <table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Registered successfully"} if everything went well.</td></tr><tr><td>400-BAD-REQUEST</td><td>with JSON response {"status":400,"message":"...","elements":"..."} if login or/and password already exist</td></tr></table> |
| <ul><li>**Route:** ``/connect/{login}/{password}``</li><li>**Method:** ``GET``</li><li>**Description:** Connect new user to chat service through API</li></ul> |  <table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Login successful"} if everything went well.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> |
| <ul><li>**Route:** ``/messages/{login}/{password}``</li><li>**Method:** ``GET``</li><li>**Description:** Retrieve all messages from chat service API</li></ul> |  <table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON Array response [{"uuid":"...","login":"john","message":"Hello world! Ping"},{"uuid":"...","login":"jane","message":"Pong!"}] if everything went well.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> | 
| <ul><li>**Route**: ``/messages/{login}/{password}``</li><li>**Method:** ``POST``</li><li>Post new message to chat service API</li></ul> |  <br/>**Request body:** {"uuid":"...","login":"jane","message":"Pong!"} <br/>**Warning: uuid is mandatory and should be a valid generated uuid!** <br/><table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Message posted successfully"} if everything went well.</td></tr><tr><td>400-BAD-REQUEST</td><td>with JSON response {"status":400,"message":"...","elements":"..."} if any mandatory body fields are absent/invalid or if message has already been posted.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> | 

### 2.0
---------------
**versionPrefix: 2.0**

This API performs authentication using basic authentication (more info: https://en.wikipedia.org/wiki/Basic_access_authentication)  
The API searches for Content-Type:application/json header when required, and is best fit for advanced use.

| Endpoint | Returns |
| ----- | ------ | ----------- | ------- |
| <ul><li>**Route:** ``/register``</li><li>**Method:** ``POST``</li><li>**Description:** Register new user to chat service through API</li></ul> |  <br/>**Request body:** {"login":"foo","password":"bar"} <br/>**Warning: requires Content-Type:application/json header!** <br/><table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Registered successfully"} if everything went well.</td></tr><tr><td>400-BAD-REQUEST</td><td>with JSON response {"status":400,"message":"...","elements":"..."} if login or/and password already exist, or fields not properly set.</td></tr></table> |
| <ul><li>**Route:** ``/connect``</li><li>**Method:** ``GET``</li><li>**Description:** Connect new user to chat service through API</li></ul> | <br/>**Warning: requires Basic Authentication!** <br/> <table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Login successful"} if everything went well.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> |
| <ul><li>**Route:** ``/messages?&limit=10&offset=20``</li><li>**Method:** ``GET``</li><li>**Description:** Retrieve all messages from chat service API</li></ul> | <br/>Optional parameters: <br/>**limit:** maximum number of results.<br/>**offset:** result offset.<br/>**Warning: requires Basic Authentication!** <br/><table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON Array response [{"uuid":"...","login":"john","message":"Hello world! Ping"},{"uuid":"...","login":"jane","message":"Pong!", "images": ["http://training.loicortola.com/2.0/files/.../1.png"]}] if everything went well.<br/>**NB: images is not a mandatory field. it can hold URLs to the image attachments posted along with a message.**</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> | 
| <ul><li>**Route**: ``/messages``</li><li>**Method:** ``POST``</li><li>Post new message to chat service API</li></ul> | <br/>**Warning: requires Basic Authentication!** <br/>**Request body:** {"uuid":"...","login":"jane","message":"Pong!", "attachments": [{"mimeType": "image/png", "data": "yourbase64imagecontenthere"}]} <br/>**Warning: uuid is mandatory and should be a valid generated uuid!**<br/>**NB: attachments is not a mandatory field. it can hold image/png or image/jpg content. Warning, size is limited to 1024kb by default.**<br/><table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Message posted successfully"} if everything went well.</td></tr><tr><td>400-BAD-REQUEST</td><td>with JSON response {"status":400,"message":"...","elements":"..."} if any mandatory body fields are absent/invalid or if message has already been posted.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> | 
| <ul><li>**Route:** ``/files/{uuid}/{fileName}``</li><li>**Method:** ``GET``</li><li>**Description:** Retrieve file posted along depending on the file extension.</li></ul> |  <br/><table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>image/* response if everything went well.</td></tr><tr><td>404-NOT-FOUND</td><td>if image does not exist.</td></tr></table> |

### Websocket API
**versionPrefix: 2.0/ws**

This API allows the use of websockets to enhance real-time experience for users.  
The Websocket API uses Socket.io as an implementation.

| Event | Payload & Outcomes |
| ----- | ------ | ----------- | ------- |
| <ul><li>**Event:** ``auth_required``</li><li>**Source:** ``SERVER``</li><li>**Description:** Once connection is established, server tells client authentication is required.</li></ul> |  None |
| <ul><li>**Event:** ``auth_attempt``</li><li>**Source:** ``CLIENT``</li><li>**Description:** Client attempts to authenticate to the server.</li></ul> | <br/>**Payload:** {"login":"foo","password":"bar"} <br/><table><tr><th>Status</th><th>Payload</th></tr><tr><td>Success</td><td>Server will emit **auth_success** and **active_users_update** if everything went well.</td></tr><tr><td>Failure</td><td>Server will emit **auth_failed** if credentials are wrong.</td></tr></table> |
| <ul><li>**Event:** ``auth_success``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies client its authentication was successful, and returns the session-token.</li></ul> | <br/>**Payload:** {"login":"foo","token":"session-token1234","message": "Authentication successful"} |
| <ul><li>**Event:** ``auth_failed``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies client its authentication has failed.</li></ul> | None |
| <ul><li>**Event:** ``outbound_msg``</li><li>**Source:** ``CLIENT``</li><li>**Description:** Client sends a new message.</li></ul> | <br/>**Payload:** {"login":"foo","token":"session-token1234","uuid":"message-uuid-1234","message": "Hello World!","attachments": [{"mimeType": "image/png", "data": "yourbase64imagecontenthere"}]} <br/><table><tr><th>Status</th><th>Payload</th></tr><tr><td>Success</td><td>Server will emit **post_success_msg** and broadcast **inbound_msg** if everything went well.</td></tr><tr><td>Failure</td><td>Server will emit **bad_request_msg** if credentials or message structure are wrong.</td></tr></table> |
| <ul><li>**Event:** ``inbound_msg``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies clients a new message was sent.</li></ul> | <br/>**Payload:** {"login":"foo","uuid":"message-uuid-1234","message": "Hello World!", "images": ["http://training.loicortola.com/2.0/files/.../1.png"]}]}  |
| <ul><li>**Event:** ``post_success_msg``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies emitter-client its message was successfully sent.</li></ul> | <br/>**Payload:** {"uuid":"message-uuid-1234"}  |
| <ul><li>**Event:** ``bad_request_msg``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies emitter-client its message was not sent.</li></ul> | <br/>**Payload:** String message with the error reason.  |
| <ul><li>**Event:** ``active_users_update``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server broadcasts the list of active users to clients. This event is fired everytime the list of connected users changes.</li></ul> | <br/>**Payload:** ["user1", "user2", "john", "jane"]  |

### Register / Dashboard pages
---------------

Besides the API, the Chat system has an HTML registration page available at route /    
Administrators can monitor activity with the HTML dashboard, and reset memory at /dashboard (requires admin login).

## Deploy your own Chat backend
---------------

The source code is now released along with the API description.

Please update the configuration with your own in conf/conf.js

Requirements: node, npm

Execute the following commands:

``npm install``

``bower install``

``gulp``

``./start.sh`` 


## License
---------------------

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
