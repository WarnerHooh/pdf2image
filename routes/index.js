var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var Busboy = require('busboy');
var pdf2image = require('../services/pdf2image');

require('../utils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// upload
router.get('/upload', function(req, res, next) {
  next();
}, function(req, res) {
  res.render('../views/upload');
});

// do upload
router.post('/upload', function(req, res) {
  console.log('Upload');

  var busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename);

    var chunks = [], len = 0, filePath;

    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      chunks.push(data);
      len += data.length;
    });

    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');

      var timeStamp = new Date().format('yyyy_MM_dd_hh_mm_ss');
      var dirPath = path.join(__dirname, '../public/files/', timeStamp);
      console.log(dirPath);

      filePath = path.join(dirPath, filename);
      fs.mkdirSync(dirPath);

      fs.writeFile(filePath, Buffer.concat( chunks, len ), {}, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('file saved!');

          pdf2image(filePath, function() {
            res.end(dirPath);
          });
        }
      });
    });
  });

  req.pipe(busboy);
});

module.exports = router;
