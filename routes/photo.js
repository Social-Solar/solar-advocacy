/* jshint node:true*/
'use strict';

var request = require('request'),
     Canvas = require('canvas'),
         fs = require('fs');

module.exports = function(app) {
  app.post('/createProfilePhoto',     createProfile);
  app.post('/createCoverPhoto',       createCover);
  app.get('/solarized/profile/:name', getProfile);
  app.get('/solarized/cover/:name',   getCover);
};

function getProfile(req, res) {
  // maybe check id right here
  var url = 'solarized/profile/' + req.params.name;
  res.sendfile(url);
}

function getCover(req, res) {
  // maybe check id right here
  var url = 'solarized/cover/' + req.params.name;
  res.sendfile(url);
}

function createProfile(req, res) {
  // maybe check id right here

  var file = process.cwd() + '/solarized/profile/' + req.body.id + '.jpg';
  var ws = fs.createWriteStream(file);

  request(req.body.url).pipe(ws);

  ws.on('close', function () {
    _solarizeProfile(file, function (err) {
      if (err) {
        res.send({
          success: false,
          err: err
        });
      } else {
        res.send({
          success: true,
          url: '/solarized/profile/' + req.body.id + '.jpg'
        });
      }
    });
  });
}

function createCover(req, res) {
  // maybe check id right here

  var file = process.cwd() + '/solarized/cover/' + req.body.id + '.jpg';
  var ws = fs.createWriteStream(file);

  request(req.body.url).pipe(ws);

  ws.on('close', function () {
    _solarizeCover(file, req.body.offset, function (err) {
      if (err) {
        res.send({
          success: false,
          err: err
        });
      } else {
        res.send({
          success: true,
          url: '/solarized/cover/' + req.body.id + '.jpg'
        });
      }
    });
  });
}

function _solarizeProfile(file, cb) {
  fs.readFile(file, function (err, pic) {
    if (err) return cb(err);
    var img = new Canvas.Image();

    img.onload = function () {
      var canvas  = new Canvas(img.width, img.height);
      var ctx     = canvas.getContext('2d');
      var logo    = new Canvas.Image();
      logo.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.drawImage(logo, img.width - (logo.width + 10), img.height - (logo.height + 10), logo.width, logo.height);
        _saveCanvas(canvas, file, function (err) {
          if (err) return cb (err);
          cb();
        });
      };

      logo.src = process.cwd() + '/solarized/logo.png';
    };

    img.src = pic;
  });
}


function _solarizeCover(file, offset, cb) {
  fs.readFile(file, function (err, pic) {
    if (err) return cb(err);
    var img = new Canvas.Image();

    img.onload = function () {
      var canvas  = new Canvas(img.width, img.height);
      var ctx     = canvas.getContext('2d');
      var logo    = new Canvas.Image();
      logo.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.drawImage(logo, 0, img.height-offset-50, img.width, logo.height);
        _saveCanvas(canvas, file, function (err) {
          if (err) return cb (err);
          cb();
        });
      };

      logo.src = process.cwd() + '/solarized/cover-logo.png';
    };

    img.src = pic;
  });
}

function _saveCanvas(canvas, file, cb) {
  var out = fs.createWriteStream(file);
  var stream = canvas.jpegStream({
    quality : 100
  });

  stream.pipe(out);

  out.on('open', function () {
    cb(null);
  });
}
