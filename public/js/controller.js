/* global angular, console, BASE_URL */
angular.module('i-like-solar').controller('fbCtrl',
  function ($scope, $location, $timeout, $modal, $window, fb, salsa) {
    'use strict';

    $scope.alerts    = [];
    $scope.signedUp  = false;
    $scope.company   = $location.search().company;
    $scope.source    = $location.search().source;

    $scope.profileSolarized = false;
    $scope.coverSolarized   = false;

    $scope.companies = ['Clean Power Finance', 'Enphase', 'SolarCity', 'Sungevity', 'SunPower', 'Sunrun', 'Vivint', 'Other'];
    if ($scope.companies.indexOf($scope.company) === -1) {
      $scope.company = null;
    }
    $scope.showDrop  = $scope.company === null ? true : false;
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

    $scope.profileUrl = BASE_URL + '/img/profile.jpg';
    $scope.coverUrl   = BASE_URL + '/img/example-cover.png';

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
          createAlert('success', 'Congrats! Thanks for joining!');
        } else {
          $scope.joining = false;
          // createAlert('error', 'Oops, Something went wrong. Try again!');
        }
      }, 'publish_actions');
    };

	$scope.postFeed = function(){
    if (!$scope.signedUp) return createAlert('error', 'You haven\'t signed up yet!');
		var publish = {
         method: 'feed',
		 name: 'I LIKE SOLAR',
		 link: 'https://apps.facebook.com/i_like_solar/',
		 picture: 'http://www.seia.org:3000/img/sun.png',
		 caption: 'Share your story',
		 description: 'Solar is getting smarter! Did you know your friends could get solar 3x faster if they know you have solar? Share your solar story to help multiply solar power in your community. via I LIKE SOLAR.',
        //picture: 'http://www.fbrell.com/public/f8.jpg'
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

	$scope.requestFriends = function(){
    if (!$scope.signedUp) return createAlert('error', 'You haven\'t signed up yet!');
		var publish = {
		  method: 'apprequests',
		  message: 'Do your solar panels make a difference? Please join I LIKE SOLAR to share the benefits of your solar with your friends.',
		  title: 'Invite your friends with solar to I LIKE SOLAR'
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

    $scope.saveOptions = function (company, company2, swFriends, swFoF, source) {
      $scope.saving = true;
      var obj = {
        id:      id,
        token:   token,
        company: company !== 'Other' ? company : company2,
        source:  source,
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
        $scope.permissionModal.close();
        createAlert('success', 'Your info has been saved!');
      });
    };

    function solarizeProfilePhoto() {
      fb.getProfileUrl(function (res) {
        var profileUrl = res.data.url;
        fb.createProfilePhoto(profileUrl, $scope.userId, function (data) {
          var picUrl = BASE_URL + data.url;
          $scope.profileUrl = picUrl;
        });
      });
    }

    function solarizeCoverPhoto() {
      fb.getCoverUrl(function (res) {
        var coverUrl = res.cover.source;
        fb.createCoverPhoto(coverUrl, $scope.userId, function (data) {
          var picUrl = BASE_URL + data.url;
          $scope.coverUrl = picUrl;
        });
      });
    }

    $scope.uploadToFacebook = function(picture) {
      if (!$scope.signedUp) return createAlert('error', 'You haven\'t signed up yet!');
      $scope[picture + 'Uploading'] = true;
      var img = picture === 'profile' ? $scope.profileUrl : $scope.coverUrl;
      fb.uploadPhoto(img, function (resp) {
        if (resp.error) return createAlert('error', resp.error.message);
        $scope[picture + 'Solarized'] = true;
        $scope.uploading = false;
        $scope.solarized_url = 'https://www.facebook.com/photo.php?fbid=' + resp.id;
        $scope.milestones[1].img = 'ms2-filled.png';
        createAlert('success', 'Profile photo successfully uploaded!');
        $scope.$apply();
      });
    };

    function loadApp() {
      var gotName = false;
      var gotOptions = false;

      $scope.loggedIn = true;
      // $scope.loading = false;
      fb.getUser(function (res) {
        $scope.userId = res.id || null;
        $scope.name = res.first_name || res.name;
        gotName = true;
        $scope.signedUp = true;
        solarizeProfilePhoto();
        solarizeCoverPhoto();
        if (gotOptions) $scope.loading = false;
      });

      salsa.getOptions({ id: id, token: token }, function (err, data) {
        gotOptions = true;
        if (!gotName) $scope.loading = false;
        if (err) return showModal();
        $scope.company = data.company;

        $scope.swFriends = data.privacy.friends;
        $scope.swFoF = data.privacy.friendsOfFriends;
      });
    }

    function showModal() {
      $scope.permissionModal = $modal.open({
        templateUrl: 'permissions.html',
        scope: $scope
      });
    }

    $scope.unsubscribe = function() {
      salsa.deleteUser($scope.userId, function(err) {
        if (err) return createAlert('error', 'User does not exist or was not removed.');
        createAlert('success', 'You have successfully unsubscribed.');
      });
    };

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
