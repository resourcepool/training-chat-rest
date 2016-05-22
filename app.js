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
var Conf = require('./conf/conf');
// Node Misc
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

//-------------------------------------------------------------------------------
// INIT
//-------------------------------------------------------------------------------
// Init express
var app = express();

// Cors
app.use(cors());

// Json parser
app.use(bodyParser.json({"limit": Conf.maxMessageSizeInKb * 1024}));

var staticRoot = __dirname + '/public';
var viewsRoot = __dirname + '/views';

// Declare routes
require('./route/index')(app, staticRoot, viewsRoot);
require('./route/api1.0')(app);
require('./route/api2.0')(app);

//-------------------------------------------------------------------------------
// LAUNCH SERVER
//-------------------------------------------------------------------------------
Conf.server.baseUrl = Conf.server.scheme + '://' + Conf.server.host + ':' + Conf.server.port + Conf.server.path;

var server = app.listen(Conf.server.port, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log('Chat REST Application listening at http://%s:%s', host, port);
});

// Add websocket handler
require('./route/apiws')(server);