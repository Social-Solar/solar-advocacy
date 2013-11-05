/* jshint node:true */
'use strict';

module.exports = function (app) {
  app.all('/channel', log);
  app.get('/asdf', get);
};

var test = '';

function log(req, res) {
  test += '\n\n';

  test += JSON.stringify(req.query);
  test += JSON.stringify(req.body);

  res.send(test);
}

function get(req, res) {
  res.send(test);
}
