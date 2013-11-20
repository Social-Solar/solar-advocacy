/* global angular, FB, BASE_URL */
angular.module('i-like-solar').factory('fb',
  function ($rootScope, $http) {
    'use strict';

    var appId = '582937771761901';

    FB.init({
      appId: appId,
      channelUrl: BASE_URL + '/channel.html',
      status: true
    });

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/all.js#xfbml=1&appId=' + appId;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

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

    function getPhoto(id, cb) {
      $http.get('http://graph.facebook.com/' + id + '/picture?redirect=false&type=large')
        .then(function(res){
          $http.post(BASE_URL + '/getPhoto', {
            url: res.data.data.url,
            id: id
          })
            .then(function(res) {
              FB.api('/me/photos', 'post', {
                  message: 'photo description',
                  url:     res.data
                }, function(res) {
                  if (res.error) return cb(res);
                  cb(null, res);
              });
            });
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
      getPhoto:       getPhoto,
      ui:             ui
    };
  }
);

