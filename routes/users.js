/* jshint node:true */
'use strict';

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Load Utilities +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

var verify     = require('../utils/fb.js').verify;
var db_config  = require('../knexfile.coffee').development;

var knex = require('knex')({
  client: db_config.client,
  connection: db_config.connection
});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true
});

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
  verify(data.fb_id, data.token, function (err) {
    if (err) return _fail(res, err);
    next();
  });
}

function getUser(req, res) {
  var data = req.body;
  var user = new User({fb_id: data.fb_id});
  user.fetch()
    .then(function(model){
      if (model == null) {
        _fail(res, 'No user available');
      }
      else {
        var attrs = {
          fb_id: data.fb_id,
          company: model.get('solar_company'),
          privacy: {}
        };
        try {
          attrs.privacy = user.get('privacy_settings') ? JSON.parse(user.get('privacy_settings')) : {};
        } catch (e) {
          console.error(e);
        }

        res.send({
          success: true,
          user: attrs
        });
      }
    });
}

function postUser(req, res) {
  var data = req.body;
  var attrs = {
    fb_id:      data.fb_id,
    solar_company: data.company,
    privacy_settings: JSON.stringify(data.privacy),
    source:  data.source
  };
  var user = new User({fb_id: attrs.fb_id})
  user.fetch()
  .then(function(model){
    if(model == null){
      model = user;
    };
    model.save(attrs)
    .then(function(model){
      if (model == null) {
        _fail(res, "Could not update user");
      }
      else {
        res.send({
          success: true
        });
      }
    });
  });
}

function deleteUser(req, res) {
  var data = req.body;
  var user = new User({fb_id: data.fb_id})
  user.fetch()
  .then(function(model){
    if (model != null){
      model.destroy();
    }

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
