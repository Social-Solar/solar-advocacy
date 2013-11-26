/* jshint node:true*/
'use strict';

var request = require('request'),
     Canvas = require('canvas'),
         fs = require('fs');

module.exports = function(app) {
  app.post('/createPhoto', createPhoto);
  app.get('/solarized/:name', getPhoto);
};

function getPhoto(req, res) {
  // maybe check id right here

  var url = 'solarized/' + req.params.name;
  res.sendfile(url);
}

function createPhoto(req, res) {
  // maybe check id right here

  var file = process.cwd() + '/solarized/' + req.body.id + '.jpg';
  var ws = fs.createWriteStream(file);

  request(req.body.url).pipe(ws);

  ws.on('close', function () {
    _solarize(file, function (err) {
      if (err) {
        res.send({
          success: false,
          err: err
        });
      } else {
        res.send({
          success: true,
          url: '/solarized/' + req.body.id + '.jpg'
        });
      }
    });
  });
}


function _solarize(file, cb) {
  fs.readFile(file, function (err, pic) {
    if (err) return cb(err);
    var img = new Canvas.Image();

    img.onload = function () {
      var canvas  = new Canvas(img.width, img.height);
      var ctx     = canvas.getContext('2d');
      var logo    = new Canvas.Image();
      logo.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.drawImage(logo, 5, 0, img.width / 2, 20);
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
