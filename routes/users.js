/* jshint node:true */
'use strict';

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Load Utilities +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

var verify = require('../utils/fb.js').verify;
var salsa = require('../utils/salsa.js');

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Public Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

module.exports = function (app) {
  app.post('/get/user', getUser);
  app.post('/save/user', postUser);
};

function getUser(req, res) {
  var data = req.body;
  verify(data.id, data.token, function (err) {
    if (err) return _fail(res, err);

    var id = data.id + '@koobecaf.com';

    salsa.get(id, function (err, user) {
      if (err) return _fail(res, err);
      user.id = data.id;
      res.send({
        success: true,
        user: user
      });
    });
  });
}

function postUser(req, res) {
  var data = req.body;
  verify(data.id, data.token, function (err) {
    if (err) return _fail(res, err);

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
