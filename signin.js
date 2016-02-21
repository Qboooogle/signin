/*HW9_signin of web2.0, qiangbo_14331229,group 11*/
/*the .js of the signin*/

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var postData = "";
var info = "<h2>Sorry!The username has been regiested,Please input again!</h2>";


var message = {
	username: 'UserName',
	studentid: 'StudentID',
	Telephone: 'phone',
	email: 'E-mail'
};


function parse_name(_url){
  return querystring.parse(url.parse(_url).query).username;
}


function if_user_exist (username) {
	var exist = false;
	var data = fs.readFileSync('userdata/userdata.txt');
	data = String(data).split('\n');
	for (var i = 0; i < data.length; i++) {
		if (data[i].indexOf('username='+username+'&') != -1) {
			postData = data[i];
			exist = true;
			break;
		}
	};
	return exist;
}


function get_files (req, res) {
	var pathname = __dirname + url.parse(req.url).pathname;
	if (path.extname(pathname) == "") pathname += 'index.html';
	var extname = path.extname(pathname);
	if (extname == '.html') {
		res.writeHead(200, {'Content-Type': 'text/html'});
	}
	else if (extname == '.css') {
		res.writeHead(200, {'Content-Type': 'text/css'});
	}
	else if (extname == '.js') {
		res.writeHead(200, {'Content-Type': 'text/javascript'});
	};
	fs.readFile(pathname, function (err, data) {
		res.end(data);
	});
}


function heald_data (req, res) {
	res.writeHead(200, {'content-type': 'text/html'});
	req.setEncoding("utf8"); 
	req.addListener("data", function (postDataChunk) { 
		postData += postDataChunk; 
	}); 
	req.addListener("end", function () {
		var objectPostData = querystring.parse(postData); 
		var repeat = checkfun(postData, objectPostData); 		
		if (repeat) {
			returnSignup(res, objectPostData, repeat);
		}		
		else {
			return_user(res, objectPostData);
			save_date(postData);
		}
	}); 
}


function returnSignup (res, objectPostData, repeat) {
	fs.readFile('index.html', function (err, data) {
		if (err) throw err;
		data = String(data);
		for (var i in objectPostData) { 
			data = data.replace('""', '"'+objectPostData[i]+'"');
		} 
		data = data.replace("<h2></h2>", info.replace('--', message[repeat]));
		res.end(data);
	});
}


function return_user (res, objectPostData) {
	fs.readFile('signin.html', function (err, data) {
		if (err) throw err;
		data = String(data);
		for (var i in objectPostData) { 
			data = data.replace(i, objectPostData[i]);
		} 
		res.end(data);
	}); 
}


function save_date (postData) {
	postData = postData.replace('%40', '@');
	fs.appendFile('userdata/userdata.txt', postData+'&\n', function (err) {
		if (!err)
		   console.log('Save userdata successfully');
	});
}


function checkfun (postData, objectPostData) {
	var data = fs.readFileSync('userdata/userdata.txt');
	data = String(data).split(' ');
	if (data.length <= 0) return '';
	for (var i = 0; i < data.length; i++) {
		for (var j in objectPostData) { 
			if (data[i].indexOf(j+'='+objectPostData[j]+'&') != -1)
		    return j;
		} 		
	};
	return '';
}

http.createServer(function (req, res) {
	postData = "";
	var username = parse_name(req.url); 
	var exist = false;
	if (username) {
		exist = if_user_exist(username);
	}	
	if (exist) {
		res.writeHead(200, {'content-type': 'text/html'});
		var objectPostData = querystring.parse(postData); 
		return_user(res, objectPostData);
	}
	else if (req.method == "GET") {
		get_files(req, res);
	}	
	else if (req.method == "POST") { 		
		heald_data(req, res);
	} 
}).listen('8000'); 

console.log('Server running at http://127.0.0.1:8000/');