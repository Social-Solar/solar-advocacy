/* jshint node:true */
'use strict';

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Load Requires -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

var request = require('request');
var url = 'https://graph.facebook.com/me?access_token=';

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Public Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

function verify(fb_id, token, cb) {
  request(url + token, function (err, resp, body) {
    if (err) return cb(err);
    body = JSON.parse(body);
    if (body.error) return cb(body.error.message);
    if (body.id != fb_id) return cb('Your id and the token\'s id don\'t match');
    cb();
  });
}

module.exports = {
  verify: verify
};
