/* global angular, console */
angular.module('i-like-solar').controller('fbCtrl',
  function ($scope, $timeout, fb, salsa) {
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
     		} else {	
				createAlert('error', 'Oops, Something went wrong. Try again!');
			}
		});
	};
	$scope.requestfriends = function(){
		var publish = {
  			method: 'apprequests',
			appId: '582937771761901',
  			message: 'Do your solar panels make a difference? Come and share your story on the I Like Solar page.',
  			title: 'Tell your friends about I Like Solar.'
		};
		fb.ui(publish,  function(res){
			 if (res.request && res.to) {
                var numFriends = res.to.length;
				var f=' friends';
				(numFriends >=2) ? f=" friends" : f=" friend";      
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
      $timeout(function () {
        var index = $scope.alerts.indexOf(alert);
        $scope.alerts.splice(index, 1);
      }, 2000);
    }
  }
);
