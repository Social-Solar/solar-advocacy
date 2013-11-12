/* global angular, BASE_URL */
angular.module('i-like-solar').factory('salsa',
  function ($http) {
    'use strict';

    function getOptions(obj, cb) {
      var url = BASE_URL + '/get/user';
      $http.post(url, obj).then(function (res) {
        if (!res.data.success) return cb(res.data.err);
        cb(null, res.data.user);
      });
    }

    function saveOptions(obj, cb) {
      var url = BASE_URL + '/save/user';
      $http.post(url, obj).then(function (res) {
        if (!res.data.success) return cb(res.data.err);
        cb();
      });
    }

    return {
      getOptions: getOptions,
      saveOptions: saveOptions
    };
  }
);

