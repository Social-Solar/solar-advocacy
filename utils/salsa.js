/* jshint node:true */
'use strict';

// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+- Load Requires -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
// -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-

var request = require('request');

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
function getUser(id, cb) {
  cb('Not Implemented');
}

/*
 * Takes a user (see above for form) and a cb. Saves the user in salsa with the
 * id: user.id. cb is in the form cb(err) where err is a string. If no err is
 * passed, success is assumed.
 */
function saveUser(user, cb) {
  cb('Not Implemented');
}

module.exports = {
  get: getUser,
  save: saveUser
};
