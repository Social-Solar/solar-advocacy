/* jshint node:true */
'use strict';

module.exports = function (app) {
  app.all('/', log);
  app.get('/asdf', get);
};

var test = '';

function log(req, res) {
  test += '\n\n';

  test += JSON.stringify(req.query);
  test += JSON.stringify(req.body);

  res.sendfile('./public/index.html');
}

function get(req, res) {
  res.send(test);
}
