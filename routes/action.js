var config = require('./lib/config.js');
var express = require('express');
var UPYUN = require('node-upyun');
var should = require('should');

var router = express.Router();
var upyun = new UPYUN(config.bucket, config.operator, config.password, 'v0', 'legacy');

/* GET action page. */
router.get('/', function(req, res, next) {

  	upyun.listDir('/', 20, 'asc', 20, function(err, result) {
		//如果出错
		if(err) {
			res.render('result', {'message': '出错误啦!'});
		}

		res.render('action', {
			'result': result.data.files,
			'folder': result.data.location
		});
	});

});

module.exports = router;
