/* global angular, FB, BASE_URL */
angular.module('i-like-solar').factory('fb',
  function ($rootScope, $http) {
    'use strict';

    var appId = '582937771761901';

    FB.init({
      appId: appId,
      channelUrl: BASE_URL + '/channel.html',
      status: true,
      xfbml: true
    });

    function getLoginStatus(cb) {
      FB.getLoginStatus(function (res) {
        cb(res);
        $rootScope.$apply();
      });
    }

    function login(cb, perms) {
      var obj = null;
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

    function getPhotoUrl(cb) {
      FB.api('/me/picture', { type: 'large' }, function (res) {
        cb(res);
        $rootScope.$apply();
      });
    }

    function createPhoto(url, id, cb) {
      $http.post(BASE_URL + '/createPhoto', {
        url: url,
        id: id
      }).then(function (res) {
        cb(res.data);
      });
    }

    function uploadPhoto(url, cb) {
      if (url.indexOf('//local') === 0)
        url = 'http://f.cl.ly/items/3p1S1d1Y2z1n2B0u0c1y/Image%202013.11.25%203%3A47%3A09%20PM.jpeg';
      else
        url = 'http:' + url;
      if (url.indexOf(':4000') !== -1)
        url = url.replace(':4000', ':3000');
      FB.api('/me/photos', 'post', {
        no_story: 1,
        url: url
      }, function (res) {
        cb(res);
        $rootScope.$apply();
      });
    }

    function ui(publish, cb) {
      publish.appId = appId;
      FB.ui(publish, function (res) {
        cb(res);
        $rootScope.$apply();
      });
    }

    return {
      getLoginStatus: getLoginStatus,
      login:          login,
      getUser:        getUser,
      getPhotoUrl:    getPhotoUrl,
      createPhoto:    createPhoto,
      uploadPhoto:    uploadPhoto,
      ui:             ui
    };
  }
);

