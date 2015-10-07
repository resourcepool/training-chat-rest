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
var app = angular.module('MainApp');

/**
 * Registration page controller
 * @param $rootScope
 * @param $scope
 * @param $http
 * @param $location
 * @param $timeout
 */
var registerCtrl = function ($rootScope, $scope, $http, $location, $timeout) {

  $scope.view = "views/register.html";
  $scope.form = {};
  $scope.reset = function () {
    $scope.form = {};
  }
  $scope.register = function () {
    if ($scope.form.login && $scope.form.password) {
      $http.post("2.0/register", {
        "login": $scope.form.login,
        "password": $scope.form.password
      }, {"Content-Type": "application/json"})
          .success(function (data) {
            $scope.form.message = data.message;
            $scope.form.valid = true;
          })
          .error(function (data) {
            $scope.form.message = data.message ? data.message : data;
            $scope.form.valid = false;
          });
    } else {
      $scope.form.message = "You need to fill out both user and password.";
    }
  }

};

app.controller('RegisterCtrl', ['$rootScope', '$scope', '$http', '$location', '$timeout', registerCtrl]);
