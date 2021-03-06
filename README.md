# Chat API
This repository contains a Node.js / Express / Angularjs simple webapp for a chat.  
It can be used as a nice learning API.
Source code is available and released under the Apache 2.0 License.

## API Description
---------------
The API has been developed in multiple versions:
 * 1.0: Easiest to implement. Registration is done via an HTML page or via path variables, messages can be fetched with path variables.
 * 2.0: Harder to implement, but more secure, with many more features. Login is done via basic HTTP, users have profiles with pictures, messages can contain attachments, can be fetched only with basic auth headers, and supports pagination.  
 * Websockets: Extension to 2.0, for real-time message updates, and login information.

Both API 1.0 and 2.0 descriptors are documented and can be tried at:  
[Swagger Documentation 1.0](https://training.loicortola.com/chat-rest/swagger/1.0.html)  
[Swagger Documentation 2.0](https://training.loicortola.com/chat-rest/swagger/2.0.html)  

The URI is formed of three parts:
{baseURL}/{versionPrefix}/{route}

For instance: To register a user, you would call https://training.loicortola.com/chat-rest/1.0/register/myuser/mypassword

An example instance was published on the following baseURL: https://training.loicortola.com/chat-rest

### 1.0
---------------
**versionPrefix: /1.0**

This API has permissive request Content-Types, and is best fit for beginners.

#### ``[GET] /register/{login}/{password}``
---------------
**Description:** Register new user to chat service through API
<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON response {"status":200,"message":"Registered successfully"} if everything went well.</td>
  </tr>
  <tr>
    <td>400-BAD-REQUEST</td>
    <td>with JSON response {"status":400,"message":"...","elements":"..."} if login or/and password already exist</td>
  </tr>
</table>

#### ``[GET] /connect/{login}/{password}``
**Description:** Connect new user to chat service through API
<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON response {"status":200,"message":"Login successful"} if everything went well.</td>
  </tr>
  <tr>
    <td>401-UNAUTHORIZED</td>
    <td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td>
  </tr>
</table>

#### ``[GET] /messages/{login}/{password}``
**Description:** Retrieve all messages from chat service API
<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON Array response [{"uuid":"...","login":"john","message":"Hello world! Ping"},{"uuid":"...","login":"jane","message":"Pong!"}] if everything went well.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td>
  </tr>
</table>

#### ``[POST] /messages/{login}/{password}``
**Description:** Post new message to chat service API  
**Request body:** {"uuid":"...","login":"jane","message":"Pong!"}  
**Warning: uuid is mandatory and should be a valid generated uuid!**  
<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON response {"status":200,"message":"Message posted successfully"} if everything went well.</td>
  </tr>
  <tr>
    <td>400-BAD-REQUEST</td>
    <td>with JSON response {"status":400,"message":"...","elements":"..."} if any mandatory body fields are absent/invalid or if message has already been posted.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td>
  </tr>
</table>

### 2.0
---------------
**versionPrefix: /2.0**

This API performs authentication using basic authentication (more info: https://en.wikipedia.org/wiki/Basic_access_authentication)  
The API searches for Content-Type:application/json header when required, and is best fit for advanced use.

#### [POST] ``/register``
**Description:** Register new user to chat service through API  
**Request body:** {"login":"foo","password":"bar"}  
**Warning: requires Content-Type:application/json header!** 

<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON response {"status":200,"message":"Registered successfully"} if everything went well.</td>
  </tr>
  <tr>
    <td>400-BAD-REQUEST</td>
    <td>with JSON response {"status":400,"message":"...","elements":"..."} if login or/and password already exist, or fields not properly set.</td>
  </tr>
</table>

#### [GET] ``/connect``
**Description:** Connect new user to chat service through API  
**Warning: requires Basic Authentication!**  

<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON response {"status":200,"message":"Login successful"} if everything went well.</td>
  </tr>
  <tr>
    <td>401-UNAUTHORIZED</td>
    <td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td>
  </tr>
</table>

#### [GET] ``/profile/{login}``
**Description:** Get the profile details of any user (login, email, picture)  
**Warning: requires Basic Authentication!**  

<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON response {"login": "john", "email": "foo@bar.com", "picture": "https://training.loicortola.com/chat-rest/2.0/files/usr-john.jpg"} if everything went well.</td>
  </tr>
  <tr>
    <td>401-UNAUTHORIZED</td>
    <td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td>
  </tr>
</table>

#### [POST] ``/profile``
**Description:** Update user profile (email, picture, password)  
**Request body:** {"email": "foo@bar.com", "password":"newfoo", "picture":{"mimeType": "image/jpg", "data": "yourbase64profilepicture"}}   **Warning: requires Basic Authentication!**  
**Warning: requires Content-Type:application/json header!** 

<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON response {"status":200,"message":"Profile updated successfully", "elements": ["picture", "password"]} if everything went well.</td>
  </tr>
  <tr>
    <td>400-BAD-REQUEST</td>
    <td>with JSON response {"status":400,"message":"...","elements":"..."} if fields not properly set.</td>
  </tr>
</table>

#### [GET] ``/messages?&limit=10&offset=20&head=uuid-1234``
**Description:** Retrieve all messages from chat service API  
Optional parameters:  
 * **limit:** maximum number of results.
 * **offset:** result offset.
 * **head:** head pointer. Offset and limit values will take this message uuid as head reference instead of last posted message.
 
**Warning: requires Basic Authentication!**  

<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON Array response [{"uuid":"...","login":"john","message":"Hello world! Ping"},{"uuid":"...","login":"jane","message":"Pong!", "images": ["https://training.loicortola.com/2.0/files/.../1.png"]}] if everything went well.<br/>**NB: images is not a mandatory field. it can hold URLs to the image attachments posted along with a message.**</td>
  </tr>
  <tr>
    <td>401-UNAUTHORIZED</td>
    <td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td>
  </tr>
</table>

#### [POST] ``/messages``
**Description:** Post new message to chat service API  
**Warning: requires Basic Authentication!**  
**Request body:** {"uuid":"...","login":"jane","message":"Pong!", "attachments": [{"mimeType": "image/png", "data": "yourbase64imagecontenthere"}]}  
**Warning: uuid is mandatory and should be a valid generated uuid!**  
**NB: attachments is not a mandatory field. it can hold image/png or image/jpg content. Warning, size is limited to 1024kb by default.**  

<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>JSON response {"status":200,"message":"Message posted successfully"} if everything went well.</td>
  </tr>
  <tr>
    <td>400-BAD-REQUEST</td>
    <td>with JSON response {"status":400,"message":"...","elements":"..."} if any mandatory body fields are absent/invalid or if message has already been posted.</td>
  </tr>
  <tr>
    <td>401-UNAUTHORIZED</td>
    <td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td>
  </tr>
</table>

#### [GET] ``/files/{uuid}/{fileName}``
**Description:** Retrieve file posted along depending on the file extension.

<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>image/* response if everything went well.</td>
  </tr>
  <tr>
    <td>404-NOT-FOUND</td>
    <td>if image does not exist.</td>
  </tr>
</table> 

#### [GET] ``/files/{filename}``
**Description:** Retrieve profile picture.

<table>
  <tr>
    <th>Status</th>
    <th>Body</th>
  </tr>
  <tr>
    <td>200-OK</td>
    <td>image/* response if everything went well.</td>
  </tr>
  <tr>
    <td>404-NOT-FOUND</td>
    <td>if image does not exist.</td>
  </tr>
</table>

### Websocket API
---------------
**namespace: 2.0/ws**  

This API allows the use of websockets to enhance real-time experience for users.  
The Websocket API uses Socket.io as an implementation.
**Warning:** socket.io has a very original way of declaring its clients. Beware of the difference between host, namespace, and path.  



| Event | Payload & Outcomes |
| ----- | ------ | ----------- | ------- |
| <ul><li>**Event:** ``auth_required``</li><li>**Source:** ``SERVER``</li><li>**Description:** Once connection is established, server tells client authentication is required.</li></ul> |  None |
| <ul><li>**Event:** ``auth_attempt``</li><li>**Source:** ``CLIENT``</li><li>**Description:** Client attempts to authenticate to the server.</li></ul> | <br/>**Payload:** {"login":"foo","password":"bar"} <br/><table><tr><th>Status</th><th>Payload</th></tr><tr><td>Success</td><td>Server will emit **auth_success** and **active_users_update** if everything went well.</td></tr><tr><td>Failure</td><td>Server will emit **auth_failed** if credentials are wrong.</td></tr></table> |
| <ul><li>**Event:** ``auth_success``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies client its authentication was successful, and returns the session-token.</li></ul> | <br/>**Payload:** {"login":"foo","token":"session-token1234","message": "Authentication successful"} |
| <ul><li>**Event:** ``auth_failed``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies client its authentication has failed.</li></ul> | None |
| <ul><li>**Event:** ``outbound_msg``</li><li>**Source:** ``CLIENT``</li><li>**Description:** Client sends a new message.</li></ul> | <br/>**Payload:** {"login":"foo","token":"session-token1234","uuid":"message-uuid-1234","message": "Hello World!","attachments": [{"mimeType": "image/png", "data": "yourbase64imagecontenthere"}]} <br/><table><tr><th>Status</th><th>Payload</th></tr><tr><td>Success</td><td>Server will emit **post_success_msg** and broadcast **inbound_msg** if everything went well.</td></tr><tr><td>Failure</td><td>Server will emit **bad_request_msg** if credentials or message structure are wrong.</td></tr></table> |
| <ul><li>**Event:** ``inbound_msg``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies clients a new message was sent.</li></ul> | <br/>**Payload:** {"login":"foo","uuid":"message-uuid-1234","message": "Hello World!", "images": ["https://training.loicortola.com/2.0/files/.../1.png"]}]}  |
| <ul><li>**Event:** ``user_typing_outbound_msg``</li><li>**Source:** ``CLIENT``</li><li>**Description:** Client notifies server of a message being written.</li></ul> | <br/>**Payload:** {"login":"foo","token":"session-token1234"} <br/><table><tr><th>Status</th><th>Payload</th></tr><tr><td>Failure</td><td>Server will emit **bad_request_msg** if credentials or message structure are wrong.</td></tr></table> |
| <ul><li>**Event:** ``user_typing_inbound_msg``</li><li>**Source:** ``SERVER``</li><li>**Description:** Server notifies clients a message is being written by a specific user.</li></ul> | <br/>**Payload:** {"login":"foo"}  |
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
