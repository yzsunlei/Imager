var config = require('./lib/config.js');
var express = require('express');
var UPYUN = require('node-upyun');
var should = require('should');
var formidable = require('formidable');
var fs = require('fs');

var router = express.Router();
var upyun = new UPYUN(config.bucket, config.operator, config.password, 'v0', 'legacy');

/* GET home page. */
router.get('/', function(req, res, next) {
  	upyun.listDir('/', 20, 'asc', 20, function(err, result) {
		//如果出错
		if(err) {
			res.render('result', {'message': '出错误啦!'});
		}

		res.render('index', {
			'result': result.data.files
		});
	});
});

router.post('/', function(req, res) {
	//用formidable初始化一个新的表单，然后进行解析
	var form = new formidable.IncomingForm();

	//临时文件存放路径 
	form.uploadDir = 'tmp'; 

	//输出表单提交的字段
	form.on('field', function(field, value){
		console.log('1.' + field);
		console.log(value);
	});

	//输出上传文件的参数
	form.on('file', function(name, file){
		// console.log('2.' + name);
		// console.log(file.path);
		//  path: 'tmp\\upload_e1d13e8e8182109c65e004d77a7e66ea',
		 // name: '222.png',
		 // type: 'image/png',
		var data = file.path;
		upyun.uploadFile('/111.png', data, 'image/png', true, function(err, result) {
			console.log('err:' + err);
			console.log(result);
		});
	});

	//文件上传完毕
	form.on('end', function(){
		res.render('result', {'message': '上传成功!'});
	});

	form.parse(req);

	//简式写法
	// form.parse(req, function(err, fields, files){
	// 	console.log('1.' + fields);
	// 	console.log('2.' + files);
	// 	res.end('upload complete!');
	// });

	// req.on('end',function(data){
	// 	upyun.uploadFile('/', data, 'text/plain', true, '', function(err, result) {
	// 		console.log(result);
	// 	});
	// });
})

module.exports = router;
