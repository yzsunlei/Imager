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
	//获取本月份的文件夹目录
	var date = new Date();
	var folder = '/' + date.getFullYear() + (date.getMonth() + 1);
	//列出最新上传的图片
  	upyun.listDir(folder, 20, 'asc', 20, function(err, result) {
		//如果出错
		if(err) {
			res.render('result', {'message': '出错误啦!'});
		}

		res.render('index', {
			'result': result.data.files,
			'folder': folder
		});
	});
});

/*  校验身份 */
router.post('/login', function(req, res) {
	var body = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk){ body += chunk });
	req.on('end', function(){
		var obj = qs.parse(body);
		console.log(obj);

	}); 
});

/* 上传文件 */
router.post('/', function(req, res) {

	var form = new formidable.IncomingForm();

	form.uploadDir = 'tmp'; 

	//输出表单提交的字段
	form.on('field', function(field, value){
		// console.log('1.' + field);
		// console.log(value);
	});

	//输出上传文件的参数
	form.on('file', function(name, file){

		//设置存放路径+文件名
		var pathName =  getPathName(file);

		//设置文件Conten-type
		var type = getType(file);

		//获取上传的文件源
		var data = file.path;

		//上传到又拍云
		upyun.uploadFile(pathName, data, type, true, function(err, result) {
			if (err) {
				res.render('result', {'message': '出错误啦!'});
			}

			console.log(result);

		});
	});

	//文件上传完毕
	form.on('end', function(){
		res.render('result', {'message': '上传成功!'});
	});

	form.parse(req);
})

// name: '222.png',
// type: 'image/png',

//设置存放路径+文件名函数
function getPathName(file) {
	//年月
	var date = new Date();
	var folder = '/' + date.getFullYear() + (date.getMonth() + 1);
	//随机命名
	var fileName = Math.random().toString().slice(-10);
	//后缀名
	var arr = file.name.split('.');
	var ext = arr[1];

	return folder + '/' + fileName + '.' + ext;
}

//设置文件Conten-type函数
function getType(file) {
	var arr = file.type.split('/');
	return arr[1];
}

module.exports = router;
