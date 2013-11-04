/* jshint node:true */
'use strict';

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Load Utilities +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

var verify = require('../utils/fb.js').verify;
var salsa  = require('../utils/salsa.js');

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Public Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

module.exports = function (app) {
  app.post('/get/user', fbVerify, getUser);
  app.post('/save/user', fbVerify, postUser);
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
    res.send({
      success: true,
      user: {
        id: data.id,
        token: user.fbtoken,
        company: user.solar_company,
        privacy: user.privacy_settings
      }
    });
  });
}

function postUser(req, res) {
  var data = req.body;
  var user = {
    id:      data.id + '@koobecaf.com',
    token:   data.token,
    company: data.company,
    privacy: data.privacy
  };
  salsa.save(user, function (err) {
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
