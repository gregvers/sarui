var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var sarscriptpath = __dirname + '/../../sarcli/sar.py'
var sarpartsfile = __dirname + '/../../sarcli/CatC-partslist.json'
var sarfile = ""
var sarfilepath = ""

router.post('/', function (req, res){
    console.log('post /');
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file){
        file.path = '/tmp/' + file.name;
    });
    form.on('file', function (name, file){
        sarfile = file.name
        sarfilepath = file.path
        console.log('Uploaded ' + file.path);
        console.log('render with SAR file: ' + sarfile);
        res.render('index', { title: 'SAR', sarfilename: sarfile })
    });
});

router.get('/', function(req, res, next) {
    console.log('get /');
    res.render('index', { title: 'SAR', sarfilename: sarfile })
});

function run_sar_script(sarcommand, res) {
  if (sarcommand == 'config') {
      res.writeHead(200,"OK",{"Content-Type":"json"});
  } else if (sarcommand == 'bom') {
      res.writeHead(200,"OK",{"Content-Type":"text/html"});
  } else if (sarcommand == 'diff') {
    res.writeHead(200,"OK",{"Content-Type":"text/html"});
  }
  var spawn = require("child_process").spawn;
  console.log('execute ' + sarscriptpath + ' for ' + sarfilepath);
  var scriptExecution = spawn(sarscriptpath, [sarcommand, sarfilepath, "--partsfile", sarpartsfile ]);
  scriptExecution.stdout.on('data', function(data) {
    console.log(data.toString());
    res.end(data.toString());
  });
  scriptExecution.stderr.on('data', (data) => {
    console.log(data.toString());
    res.end(data.toString());
  });
  scriptExecution.on('exit', (code) => {
    console.log("Process quit with code : " + code);
  });
}

router.get('/config', function(req, res, next) {
  console.log('get /config');
  run_sar_script('config', res);
});


router.get('/bom', function(req, res, next) {
    console.log('get /bom');
    run_sar_script('bom', res);
});

router.get('/diff', function(req, res, next) {
    console.log('get /diff');
    run_sar_script('diff', res);
});

module.exports = router;
