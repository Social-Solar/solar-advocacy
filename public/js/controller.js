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
      return company === 'Other' ? !company2 : !company;
    };

    $scope.saveOptions = function (company, company2, swFriends, swFoF) {
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
        if (err) return console.error(err);
        // TODO:: SUCCESS YOU SAVED YOUR DATA
        // OR NO YOU DIDNT
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
  }
);
