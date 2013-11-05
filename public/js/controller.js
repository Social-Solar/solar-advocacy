/* global angular, console */
angular.module('i-like-solar').controller('fbCtrl',
  function ($scope, fb, salsa) {
    'use strict';

    $scope.companies = [ 'Vivint', 'Sungevity', 'Enphase', 'Other' ];

    $scope.loggedIn = false;
    $scope.loading = true;

    var id, token;

    fb.getLoginStatus(function (res) {
      $scope.loading = false;
      if (res.status === 'connected') {
        console.log(res);
        id = res.authResponse.userID;
        token = res.authResponse.accessToken;
        loadApp();
      }
    });

    $scope.login = function () {
      fb.login(function (res) {
        if (res.authResponse) {
          id = res.authResponse.userID;
          token = res.authResponse.accessToken;
          loadApp();
        }
      });
    };

    $scope.verify = function (company, company2) {
      return company === 'Other' ? !company2 : false;
    };

    $scope.saveOptions = function (company, company2) {
      var obj = {
        id:      id,
        token:   token,
        company: company !== 'Other' ? company : company2,
        privacy: 'Test'
      };

      salsa.saveOptions(obj, function (err, data) {
        console.log(err);
        console.log(data);
      });
    };

    function loadApp() {
      $scope.loggedIn = true;

      fb.getUser(function (res) {
        $scope.name = res.first_name || res.name;
        console.log(res);
      });

      salsa.getOptions({ id: id, token: token }, function (err, data) {
        if (err) return;
        console.log(data);
      });
    }
  }
);
