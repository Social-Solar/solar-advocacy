/* jshint node:true */
'use strict';

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Load Requires -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

var request = require('request'),
         sc = require('config').salsa;

var apiUrl  = 'https://hq-salsa.wiredforchange.com/';

var groupKeys = {
  Vivint:    67577,
  Sungevity: 67578,
  Enphase:   67579,
  Other:     67580
};

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Public Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

// note: for the following two functions, I've already converted the id. In
// other words, I'll be passing you the id as: FACEBOOK_ID@koobecaf.com.

/*
 * Takes in an id and queries salsa for the user with that id. Callback follows
 * the form: cb(err, user). err is a string. user is an object of the form:
 * {
 *   id:      String,
 *   token:   String,
 *   company: String,
 *   privacy: Object?
 * }
 */
function getUser(key, cb) {
  var cookieJar = request.jar();
  _authenticate(cookieJar, function (err) {
    if (err) return cb(err);
    _findUser(key, cookieJar, cb);
  });
}

/*
 * Takes a user (see above for form) and a cb. Saves the user in salsa with the
 * id: user.id. cb is in the form cb(err) where err is a string. If no err is
 * passed, success is assumed.
 */
function saveUser(user, cb) {
  var groupID = groupKeys[user.company] || groupKeys.Other;
  var jar     = request.jar();
  _authenticate(jar, function (err) {
    if (err) return cb(err);
    _createUser(user, jar, function (err, key) {
      if (err) return cb(err);
      _addToGroup(key, groupID, jar, cb);
    });
  });
}

function getGroup(key, cb) {
  var jar = request.jar();
  _authenticate(jar, function(err) {
    if (err) return cb(err);
    _findGroup(key, jar, function(err, res) {
      if (err) return cb(err);
      console.log(res);
      cb(null, res);
    });
  });
};

module.exports = {
  get: getUser,
  save: saveUser,
  getGroup: getGroup
};


// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Private Functions -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

function _authenticate(jar, cb) {
  var url = apiUrl + 'api/authenticate.sjs';
  request({
    url: url,
    qs: {
      email: sc.user,
      password: sc.pass,
      json: true
    },
    jar: jar
  }, function (err, resp, body) {
    if (err) return cb(err);
    body = JSON.parse(body);
    if (body.status !== 'success') return cb(body.message);
    cb();
  });
}

function _findGroup(key, jar, cb) {
  var url = apiUrl + 'api/getObjects.sjs';
  request({
    url: url,
    qs: {
      object:     'supporter_groups',
      condition:  'groups_KEY=' + key,
      json:        true
    },
    jar: jar
  }, function (err, res, body) {
    if (err) return cb(err);
    console.log("body: ", body);
    body = JSON.parse(body);
    if (!body.length) return cb('Not Found');
    cb(null, body);
  });
};

function _findUser(key, jar, cb) {
  var url = apiUrl + '/api/getObjects.sjs';
  request({
    url: url,
    qs: {
      object: 'supporter',
      condition: 'Email=' + key,
      include: 'fbtoken2,solar_company,privacy_settings2',
      json: true
    },
    jar: jar
  }, function (err, resp, body) {
    if (err) return cb(err);
    body = JSON.parse(body);
    if (!body.length) return cb ('Not Found');
    cb(null, body[0]);
  });
}

function _createUser(user, jar, cb) {
  request({
    url: apiUrl + 'save',
    method: 'POST',
    qs: {
      object:           'supporter',
      Email:            user.id,
      fbtoken2:          user.token,
      solar_company:    user.company,
      privacy_settings2: user.privacy,
      json:             true
    },
    jar: jar
  }, function (err, res, body) {
    if (err) return cb(err);
    body = JSON.parse(body)[0];
    if (body.result !== 'success') return cb(body.messages);
    cb(null, body.key);
  });
}

function _addToGroup(userKey, groupKey, jar, cb) {
  request({
    url: apiUrl + 'save',
    method: 'POST',
    qs: {
      object:        'supporter_groups',
      supporter_KEY: userKey,
      groups_KEY:    groupKey,
      json:          true
    },
    jar: jar
  }, function (err, res, body) {
    cb();
    // if (err) return cb(err);
    // body = JSON.parse(body)[0];
    // if (body.result !== 'success') return cb(body.messages);
    // cb();
  });
}
