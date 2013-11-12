/* jshint node:true */
'use strict';

var     fs = require('fs'),
    config = require('config');

module.exports = function (app) {
  app.post('/', sendIndex);
  app.get('/', sendIndex);
  app.get('/index.html', sendIndex);
};

function sendIndex(req, res) {
  var url = config.url[req.protocol] || config.url.http;
  var indexFile = fs.readFileSync('./public/index.html', 'utf-8');
  indexFile = indexFile.replace(/\{\{BASEURL\}\}/g, url);
  res.send(indexFile);
}
