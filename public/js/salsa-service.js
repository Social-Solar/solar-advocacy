/* global angular */
angular.module('i-like-solar').factory('salsa',
  function ($http) {
    'use strict';

    var baseURL = '//fb.dallinosmun.com';

    function getOptions(obj, cb) {
      var url = baseURL + '/get/user';
      $http.post(url, obj).then(function (res) {
        if (!res.data.success) return cb(res.data.err);
        cb(null, res.data.user);
      });
    }

    function saveOptions(obj, cb) {
      var url = baseURL + '/save/user';
      $http.post(url, obj).then(function (res) {
        if (!res.data.success) return cb(res.data.err);
        cb(null, res.data.user);
      });
    }

    return {
      getOptions: getOptions,
      saveOptions: saveOptions
    };
  }
);

