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
 * Dashboard Controller
 * @param $rootScope
 * @param $scope
 * @param $http
 * @param $location
 * @param $timeout
 */
var dashboardCtrl = function ($rootScope, $scope, $http, $location, $timeout) {

  /**
   * Will trigger data refresh every 2 seconds
   */
  var refresh = function () {
    $timeout(function () {
      console.log("refreshing data");
      $http.get("2.0/admin/users", {"Content-Type": "application/json"})
          .success(function (data) {
            $scope.users = data;
          })
          .error(function (data) {
            console.log("Error: " + JSON.stringify(data));
          });
      $http.get("2.0/messages", {"Content-Type": "application/json"})
          .success(function (data) {
            $scope.messages = data;
          })
          .error(function (data) {
            console.log("Error: " + JSON.stringify(data));
          });
      //Will refresh in two seconds;
      refresh();
    }, 2000);
  };

  refresh();

  /**
   * Reset button action
   */
  $scope.reset = function () {
    console.log('here');
    $http.post("2.0/admin/reset", {"Content-Type": "application/json"})
        .success(function () {
          console.log("Chat Reset successful");
        })
        .error(function (data) {
          console.log("Error: " + JSON.stringify(data));
        });
  }
};

app.controller('DashboardCtrl', ['$rootScope', '$scope', '$http', '$location', '$timeout', dashboardCtrl]);
