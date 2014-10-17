### 目录

-  [HTTP](#)
	- [http.STATUS_CODES](#)
	- [http.createServer([requestListener])](#)
	- [http.createClient([port],[host])](#)
	- [Class:http.Server](#)
		- [Event:'request'](#)
		- [Event:'connection'](#)
		- [Event:'close'](#)
		- [Event:'checkContinue'](#)
		- [Event:'connect'](#)
		- [Event:'upgrade'](#)
		- [Event:'clientError'](#)
		- [server:listen(port[,hostname][,backlog][,callback])](#)
		- [server:listen(path[,callback)]](#)
		- [server:listen(handle[,callback])](#)
		- [server:close([callback])](#)
		- [server.maxHeadersCount](#)
		- [server.setTimeout(msecs,callback)](#)
		- [server.timeout](#)
	- [Class:http.ServerResponse](#)
		- [Event:'close'](#)
		- [Event:'finish'](#)
		- [Event:'chunkedRemainingBytes'](#)
		- [response.writeContinue()](#)
		- [response.writeHead(statusCode[,reasonPhrase][,headers])](#)
		- [response.setTimeout(msecs,callback)](#)
		- [response.statusCode](#)
		- [response.setHeader(name,value)](#)
		- [response.headersSent](#)
		- [response.sendDate](#)
		- [response.getHeader(name)](#)
		- [response.removeHeader(name)](#)
		- [response.write(chunk[,encoding])](#)
		- [response.addTrailers(headers)](#)
		- [response.end([data)[,encoding])](#)
	- [http.request(options[,callback])](#)
	- [http.get(options[,callback])](#)
	- [Class:http.Agent](#)
		- [agent.maxSockets](#)
		- [agent.sockets](#)
		- [agent.requests](#)
	- [http.globalAgent](#)
	- [Class:http.ClientRequest](#)
		- [Event 'response'](#)
		- [Event:'socket'](#)
		- [Event:'connect'](#)
		- [Event:'upgrade'](#)
		- [Event:'continue'](#)
		- [request.write(chunk[,encoding])](#)
		- [request.end([data][,encoding])](#)
		- [request.about()](#)
		- [request.setTimeout(timeout[,callback])](#)
		- [request.setNoDelay([noDelay])](#)
		- [request.setSocketKeepAlive([enable][,initialDelay])](#)
	- [http.IncomingMessage](#)
		- [Event:'close'](#)
		- [message.httpVersion](#)
		- [message.headers](#)
		- [message.trailers](#)
		- [message.setTimeout(msecs,callback)](#)
		- [message.method](#)
		- [message.url](#)
		- [message.statusCode](#)
		- [message.socket](#)

## HTTP

使用HTTP服务器和客户端需要引入模块`require('http')`

Node的HTTP接口被设计用来支持那些原本难以使用的协议特性.特别是很大的、块编码的信息.这个接口不会缓存完整的请求(request)或者响应(response)，所以用户可以自己获取数据流.

HTTP头信息用对象的形式显示：

```
{
	'content-length': '123',
	'content-type': 'text/plain',
	'connection': 'keep-alive',
	'accept': '*/*'
}
```

键(key)为小写，值(value)不能修改.

为了支持更全面的HTTP应用，Node的HTTP API是很底层的.它只负责流处理和语法解析.它把信息解析成报头(header)和正文(body),并不解析实际的报头(header)和正文(body).

<a name="status_codes"></a>
### http.STATUS_CODES

- object

HTTP响应状态码集合和对应的描述信息.例子：

`http.STATUS_CODES[404] === 'Not Found'`


<a name="http.createServer"></a>
### http.createServer([requestListener])

返回一个新的web服务器对象

`requestListener`是一个可选的、可自动加入到`request`事件中的函数


<a name="http.createClient"></a>
### http.createClient([port][,host])

已废弃.请使用[http.request](#).构建一个新的HTTP客户端.`port`和`host`关联已连接的服务器.


<a name="http.Server"></a>
### Class:http.Server

这是一个包含以下事件的[EventEmitter](#)

<a name="event.request"></a>
**Event:'request'**

`function(request, response) { }`

每当发出一个请求时执行一次.注意这里可能每一个连接里有多个请求(比如keep-alive连接).`request`是[http.IncomingMessage](#)的一个实例，`response`是[http.ServerResponse](#)的一个实例.

<a name="event.connection"></a>
**Event:'connection'**

`function(socket) { }`

当一个TCP流建立时.`socket`是`net.Socket`的一个对象类型.一般情况下用户不需要处理这个事件.特别情况下，协议解析器连接的套接字不会触发`readable`事件.`socket`也可以处理`request.connection`.

<a name="event.close"></a>
**Event:'close'**

`function() { }`

服务器关闭时触发.

<a name="event.checkContinue"></a>
**Event:'checkContinue'**

`function(request, response) { }`

每当收到http Expect:100-continue时触发.如果这个事件没有被监听，服务器将会自动响应100 Continue.

如果客户端继续发送请求正文(request body)的话调用[response.writeContinue()](#)来处理这个事件，或者当客户端不再发送请求正文(request body)的话生成一个相应的HTTP响应(比如400 Bad Request).

注意当这个事件触发和被处理时，`request`事件不会被触发.

<a name="event.connect"></a>
**Event:'connect'**

`function(request, socket, head) { }`

当客户端请求一个http CONNECT方法时触发.如果这个事件没有被监听，客户端请求CONNECT方法时将关闭连接.

-  `request`参数表示http请求，与request事件相同
-  `socket`参数表示服务器与客户端之间的套接字
-  `head`参数是一个Buffer实例，隧道流的第一个包，可能为空.

当这个事件触发时，请求的套接字将不会有`data`事件监听者，这意味着你需要去绑定它以使其处理发送到服务器的套接字数据.

<a name="event.upgrade"></a>
**Event:'upgrade'**

`function(request, socket, head) { }`

当客户端请求一个http upgrade时触发.如果该事件没有被监听，客户端请求upgrade时将关闭连接.

-  `request`参数表示http请求，与request事件相同
-  `socket`参数表示服务器与客户端之间的套接字
-  `head`参数是一个Buffer实例，upgrade流的第一个包，可能为空.

当这个事件触发时，请求的套接字将不会有`data`事件监听者，这意味着你需要去绑定它以使其处理发送到服务器的套接字数据.

<a name="event.clienterror"></a>
**Event:'clientError'**

