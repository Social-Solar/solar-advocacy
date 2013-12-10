/* jshint node:true */
'use strict';

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Load Utilities +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

var verify  = require('../utils/fb.js').verify;
var salsa   = require('../utils/salsa.js');

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Public Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

module.exports = function (app) {
  app.post('/get/user', fbVerify, getUser);
  app.post('/save/user', fbVerify, postUser);
  app.post('/delete/user', deleteUser);
  app.post('/test/get', getUser);
  app.post('/test/save', postUser);
};

function fbVerify(req, res, next) {
  var data = req.body;
  verify(data.id, data.token, function (err) {
    if (err) return _fail(res, err);
    next();
  });
}

function getUser(req, res) {
  var data = req.body;
  var id = data.id + '@koobecaf.com';
  salsa.get(id, function (err, user) {
    if (err) return _fail(res, err);
    var user2 = {
      id: data.id,
      token: user.fbtoken2,
      company: user.solar_company,
      privacy: {}
    };
    try {
      user2.privacy = JSON.parse(user.privacy_settings2);
    } catch (e) {
      console.error(e);
    }
    res.send({
      success: true,
      user: user2
    });
  });
}

function postUser(req, res) {
  var data = req.body;
  var user = {
    id:      data.id + '@koobecaf.com',
    token:   data.token,
    company: data.company,
    privacy: JSON.stringify(data.privacy),
    source:  data.source
  };
  salsa.save(user, function (err) {
    if (err) return _fail(res, err);
    res.send({
      success: true
    });
  });
}

function deleteUser(req, res) {
  var data = req.body;
  salsa.remove(data.email, function(err) {
    if (err) return _fail(res, err);
    res.send({
      success: true
    });
  });
}

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Private Functions -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

function _fail(res, err) {
  res.send({
    success: false,
    err: err
  });
}
