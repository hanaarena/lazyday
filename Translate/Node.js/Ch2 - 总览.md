###  目录

- [总览](#synopsis)

<a name="synopsis"></a>
###  总览

一个用Node编写的简单web服务器例子：

    var http = require('http');
	http.createServer(function (request, response) {
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Hello World\n');
	}).listen(8124);

	console.log('Server running at http://127.0.0.1:8124/');

把上述代码保存到文件`example.js`，成功执行打开将会显示`Hello World`

	> node example.js
	Server running at http://127.0.0.1:8124/

本文档的所有例子将以同样的方式运行.