/* jshint node:true */
'use strict';

module.exports = function (app) {
  app.post('/', sendIndex);
};

function sendIndex(req, res) {
  res.sendfile('./public/index.html');
}
