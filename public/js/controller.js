/* global angular, console */
angular.module('i-like-solar').controller('fbCtrl',
  function ($scope, $setTimeout, fb, salsa) {
    'use strict';
    $scope.alerts = [];

    $scope.companies = [ 'Vivint', 'Sungevity', 'Enphase', 'Other' ];

    $scope.loggedIn = false;
    $scope.loading = true;

    var id, token;

    fb.getLoginStatus(function (res) {
      $scope.loading = false;
      if (res.status === 'connected') {
        id = res.authResponse.userID;
        token = res.authResponse.accessToken;
        loadApp();
      }
    });

    $scope.login = function () {
      $scope.joining = true;
      fb.login(function (res) {
        $scope.joining = true;
        if (res.authResponse) {
          id = res.authResponse.userID;
          token = res.authResponse.accessToken;
          loadApp();
          createAlert('success', 'Congrats! Thanks for joining!');
        } else {
          $scope.joining = false;
          createAlert('error', 'Oops, Something went wrong. Try again!');
        }
      });
    };

    $scope.verify = function (company, company2) {
      return company === 'Other' ? !company2 : !company;
    };

    $scope.saveOptions = function (company, company2, swFriends, swFoF) {
      $scope.saving = true;
      var obj = {
        id:      id,
        token:   token,
        company: company !== 'Other' ? company : company2,
        privacy: {
          friends: swFriends,
          friendsOfFriends: swFoF
        }
      };

      salsa.saveOptions(obj, function (err) {
        $scope.saving = false;
        if (err) {
          createAlert('error', 'Oops, something went wrong.');
          return console.error(err);
        }
        createAlert('success', 'Your info has been saved!');
      });
    };

    function loadApp() {
      var gotName = false;
      var gotOptions = false;

      $scope.loggedIn = true;
      $scope.loading = true;
      fb.getUser(function (res) {
        $scope.name = res.first_name || res.name;
        gotName = true;
        if (gotOptions) $scope.loading = false;
      });

      salsa.getOptions({ id: id, token: token }, function (err, data) {
        gotOptions = true;
        if (gotName) $scope.loading = false;
        if (err) return console.error(err);
        $scope.company = data.company;

        $scope.swFriends = data.privacy.friends;
        $scope.swFoF = data.privacy.friendsOfFriends;
      });
    }

    function createAlert(type, msg) {
      var alert = {
        type: type,
        msg: msg
      };

      $scope.alerts.push(alert);
      $setTimeout(function () {
        var index = $scope.alerts.indexOf(alert);
        $scope.alerts.splice(index, 1);
      }, 2000);
    }
  }
);
