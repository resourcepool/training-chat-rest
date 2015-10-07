# Chat API
This repository contains a Node.js / Express / Angularjs simple webapp for a chat.  
It can be used as a nice learning API.

## API Specs

The API has been developed in multiple versions:
 * 1.0: Easiest to implement. Registration is done via an HTML page or via path variables, messages can be fetched with path variables.
 * 2.0: Harder to implement, but more secure. Login is done via basic HTTP, messages can be fetched only with authentication headers, and pagination.

The URI is formed of three parts:
{baseURL}/{versionPrefix}/{route}

An example instance was published on the following baseURL: http://training.loicortola.com/chat-rest

### 1.0
versionPrefix: 1.0

This API has permissive request Content-Types, and is best fit for beginners.

| Endpoint | Returns |
| ----- | ------ | ----------- | ------- |
| <ul><li>**Route:** ``/register``</li><li>**Method:** ``GET``</li><li>**Description:** Register new user to database with a web page</li></ul> | An HTML page with a Registration form |
| <ul><li>**Route:** ``/register/{login}/{password}``</li><li>**Method:** ``POST``</li><li>**Description:** Register new user to chat service through API</li></ul> |  <table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Registered successfully"} if everything went well.</td></tr><tr><td>400-BAD-REQUEST</td><td>with JSON response {"status":400,"message":"...","elements":"..."} if login or/and password already exist</td></tr></table> |
| <ul><li>**Route:** ``/connect/{login}/{password}``</li><li>**Method:** ``GET``</li><li>**Description:** Connect new user to chat service through API</li></ul> |  <table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Login successful"} if everything went well.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> |
| <ul><li>**Route:** ``/messages/{login}/{password}``</li><li>**Method:** ``GET``</li><li>**Description:** Retrieve all messages from chat service API</li></ul> |  <table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON Array response [{"uuid":"...","login":"john","message":"Hello world! Ping"},{"uuid":"...","login":"jane","message":"Pong!"}] if everything went well.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> | 
| <ul><li>**Route**: ``/messages/{login}/{password}``</li><li>**Method:** ``PUT``</li><li>Post new message to chat service API</li></ul> |  **Request body:** {"uuid":"...","login":"jane","message":"Pong!"} <br/>**Warning: uuid is mandatory and should be a valid generated uuid!** <br/><table><tr><th>Status</th><th>Body</th></tr><tr><td>200-OK</td><td>JSON response {"status":200,"message":"Message posted successfully"} if everything went well.</td></tr><tr><td>400-BAD-REQUEST</td><td>with JSON response {"status":400,"message":"...","elements":"..."} if any mandatory body fields are absent/invalid.</td></tr><tr><td>401-UNAUTHORIZED</td><td>with JSON response {"status":401,"message":"...","elements":"..."} if login or/and password provided are not correct</td></tr></table> | 

