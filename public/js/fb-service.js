/* global angular, FB, BASE_URL */
angular.module('i-like-solar').factory('fb',
  function ($rootScope) {
    'use strict';
    FB.init({
      appId: '582937771761901',
      channelUrl: BASE_URL + '/channel.html',
      status: true
    });

    function getLoginStatus(cb) {
      FB.getLoginStatus(function (res) {
        cb(res);
        $rootScope.$apply();
      });
    }

    function login(cb, perms) {
      var obj = '';
      if (perms) obj = { scope: perms };

      FB.login(function (res) {
        cb(res);
        $rootScope.$apply();
      }, obj);
    }

    function getUser(cb) {
      FB.api('/me', function (res) {
        cb(res);
        $rootScope.$apply();
      });
    }

    return {
      getLoginStatus: getLoginStatus,
      login: login,
      getUser: getUser
    };
  }
);

