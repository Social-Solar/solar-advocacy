/* global angular, console, BASE_URL */
angular.module('i-like-solar').controller('fbCtrl',
  function ($scope, $location, $timeout, $window, fb, salsa) {
    'use strict';

    $scope.alerts    = [];
    $scope.company   = $location.search().company;
    $scope.companies = ['Vivint', 'Sungevity', 'Enphase', 'Other'];
    if ($scope.companies.indexOf($scope.company) === -1) {
      $scope.company = null;
    }
    $scope.showDrop  = $scope.company ? false : true;
    $scope.loggedIn  = false;
    $scope.loading   = true;

    $scope.milestones = [{
      img: 'ms1-filled.png',
      text: 'Sign in with Facebook'
    },{
      img: 'ms2.png',
      text: 'Solarize your profile'
    },{
      img: 'ms3.png',
      text: 'Share your solar story'
    }];

    $scope.picUrl = BASE_URL + '/img/profile.jpg';

    var id, token;

    fb.getLoginStatus(function (res) {
      $scope.loading = false;
      if (res.status === 'connected') {
        id = res.authResponse.userID;
        token = res.authResponse.accessToken;
        loadApp();
      }
    });

    $scope.scrollToTop = function() {
      $window.scrollTo($window.scrollX, 0);
    };

    $scope.login = function () {
      $scope.joining = true;
      fb.login(function (res) {
        $scope.joining = true;
        if (res.authResponse) {
          id = res.authResponse.userID;
          token = res.authResponse.accessToken;
          $scope.loggedIn = true;
          loadApp();
          // createAlert('success', 'Congrats! Thanks for joining!');
        } else {
          $scope.joining = false;
          // createAlert('error', 'Oops, Something went wrong. Try again!');
        }
      }, 'publish_actions');
    };

	$scope.postfeed = function(){
		var publish = {
        method: 'feed',
        message: 'Share your solar story',
        name: 'Share your solar story',
        caption: 'http://facebook.com/ilikesolar',
        description: (  'Do your solar panels make a difference? Share your story with your friends.'),
        link: 'http://facebook.com/ilikesolar/',
        //picture: 'http://www.fbrell.com/public/f8.jpg',
        user_message_prompt: 'Share your thoughts about solar'
		};

		fb.ui(publish,  function(res){
			if (res && res.post_id) {
          createAlert('success', 'Your post was successful');
          $scope.milestones[2].img = 'ms3-filled.png';
          $scope.$apply();
      } else {
				createAlert('error', 'Oops, Something went wrong. Try again!');
			}
		});
	};

	$scope.requestfriends = function(){
		var publish = {
      method: 'apprequests',
      message: 'Do your solar panels make a difference? Come and share your story on the I Like Solar page.',
      title: 'Tell your friends about I Like Solar.'
		};
		fb.ui(publish,  function(res){
			 if (res.request && res.to) {
        var numFriends = res.to.length;
        var f = numFriends >= 2 ? ' friends' : ' friend';
        createAlert('success', 'Your request was sent to '+numFriends+f+'.');
      } else {
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

    $scope.solarizePhoto = function () {
      $scope.solarizing = true;
      fb.getPhotoUrl(function (res) {
        var url = res.data.url;
        fb.createPhoto(url, $scope.userId, function (data) {
          var picUrl = BASE_URL + data.url;
          $scope.picUrl = picUrl;
          fb.uploadPhoto(picUrl, function (resp) {
            $scope.solarizing = false;
            if (resp.error) return createAlert('error', resp.error.message);
            $scope.solarized_url = 'https://www.facebook.com/photo.php?fbid=' + resp.id;
            $scope.milestones[1].img = 'ms2-filled.png';
            $scope.$apply();
          });
        });
      });
    };

    function loadApp() {
      var gotName = false;
      var gotOptions = false;

      $scope.loggedIn = true;
      $scope.loading = false;
      // fb.getUser(function (res) {
      //   $scope.userId = res.id || null;
      //   $scope.name = res.first_name || res.name;
      //   gotName = true;
      //   if (gotOptions) $scope.loading = false;
      // });

      // salsa.getOptions({ id: id, token: token }, function (err, data) {
      //   gotOptions = true;
      //   if (!gotName) $scope.loading = false;
      //   if (err) return console.error(err);
      //   $scope.company = data.company;

      //   $scope.swFriends = data.privacy.friends;
      //   $scope.swFoF = data.privacy.friendsOfFriends;
      // });
    }

    function createAlert(type, msg) {
      var alert = {
        type: type,
        msg: msg
      };

      $scope.alerts.push(alert);
      $timeout(function () {
        var index = $scope.alerts.indexOf(alert);
        $scope.alerts.splice(index, 1);
      }, 2000);
    }
  }
);
