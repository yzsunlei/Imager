var config = require('./lib/config.js');
var express = require('express');
var UPYUN = require('node-upyun');
var should = require('should');

var router = express.Router();
var upyun = new UPYUN(config.bucket, config.operator, config.password, 'v0', 'legacy');

/* GET detail page. */
router.get('/', function(req, res, next) {

	upyun.getUsage(function(err, result) {
		//如果出错
		if(err) {
			res.render('result', {'message': '出错误啦!'});
		}

		var detail = {
			server: result.headers.server,
			date: result.headers.date,
			connect: result.headers.connection,
			space: parseInt(result.data.space / 1024) + 'K'
		}

		//渲染
	    res.render('detail', {'detail': detail});
	});
	
});

module.exports = router;
