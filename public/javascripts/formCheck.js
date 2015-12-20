function checkForm() {
	var filename = document.getElementById('filename').value;
	//判断图片类型
	if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filename)) {
		alert('您上传的文件格式不正确!');
		return false;
	}

	//判断图片尺寸
	var image = new Image();
	image.src = filename;
	
	if (image.style.width > 10 || image.style.height > 10) {
		alert('您上传的图片尺寸过大!');
		return false;
	}
}