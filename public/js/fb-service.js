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

    function getCoverUrl(cb) {
      FB.api('/me', { width: '851', height: '315', fields: 'cover' }, function (res) {
        cb(res);
        $rootScope.$apply();
      });
    }

    function getProfileUrl(cb) {
      FB.api('/me/picture', {width: '200', height: '200', type: 'normal'}, function (res) {
        cb(res);
        $rootScope.$apply();
      });
    }

    function createProfilePhoto(url, id, cb) {
      $http.post(BASE_URL + '/createProfilePhoto', {
        url: url,
        id: id
      }).then(function (res) {
        cb(res.data);
      });
    }

    function createCoverPhoto(url, id, cb) {
      $http.post(BASE_URL + '/createCoverPhoto', {
        url: url,
        id: id
      }).then(function (res) {
        cb(res.data);
      });
    }

    function uploadPhoto(url, cb) {
      if (url.indexOf('//local') === 0)
        url = 'http://www.seia.org:3000/img/profile.jpg';
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
	
	function revokelogin() {
		FB.api('/me/permissions', 'delete', function(response) {
    	console.log(response); // true
		});			
	}
	
    return {
      getLoginStatus:     getLoginStatus,
      login:              login,
      getUser:            getUser,
      getProfileUrl:      getProfileUrl,
      getCoverUrl:        getCoverUrl,
      createProfilePhoto: createProfilePhoto,
      createCoverPhoto:   createCoverPhoto,
      uploadPhoto:        uploadPhoto,
      ui:                 ui,
      revokelogin:        revokelogin
    };
  }
);

