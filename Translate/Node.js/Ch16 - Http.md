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

`function(exception, socket) { }`

如果一个客户端连接触发`error`事件，将会转发到这里.

`socket`是错误起源的`net.Socket`对象

<a name="server.listenport"></a>
**server.listen(port[,hostname][,backlog][,callback])**

在特定的端口号和主机名上接收连接.如果主机名被省略，服务器将会直接接收指向IPv4地址的连接(`INADDR_ANY`).

监听一个unix套接字，需要提供用一个文件名来代替端口号和主机名.

`backlog`参数表示等待连接队列的最大值.实际值将由你系统的sysctl设置比如在linux上的`tcp_max_syn_backlog`和`somaxconnn`来决定.默认为511(而不是512).

这个函数支持异步.最后一个参数`callback`将会作为监听者监听['listening'](#)事件.参见[net.Server.listen(port)](#).

<a name="server.listenpath"></a>
**server.listen(path[,callback])**

在所给的`path`上开启一个UNIX套接字服务器监听所有的连接.

这个函数支持异步.最后一个参数`callback`将会作为监听者监听['listening'](#)事件.参见[net.Server.listen(path)](#)

<a name="server.listenhandle"></a>
**server.listen(handle[,callback])**

-  `handle` Object
-  `callback` Function

`handle`对象可以被设置为一个服务器或者套接字(或者任何已下划线开头的`_handle`成员)，又或者一个`{fd: <n>}`对象.

这将导致服务器在特定的handle上接收连接，但是这假设文件描述者(file descriptor)或者handle已经准备好绑定在一个端口号或者域名套接字上.

在Windows上不支持监听文件描述者.

这个函数支持异步.最后一个参数`callback`将会作为监听者监听['listening'](#)事件.参见[net.Server.listen](#)

<a name="server.close"></a>
**server.close([callback))**

禁止服务器接收新的连接.详见[net.Server>close()](#)

<a name="server.maxheader"></a>
**server.maxHeadersCount**

限制最大的请求头部信息数，默认为1000.如果设为0将不受限制.

<a name="server.settimeout"></a>
**server.setTimeout(msecs, callback)**

-  `msecs` Number
-  `callback` Function

给套接字(socket)设置超时时间，同时在服务器对象上触发`timeout`事件，如果超时，传递套接字作为参数.

如果这时服务器对象上有一个`timeout`事件监听者，将会把超时套接字作为参数并调用.

默认情况下，服务器的超时时间为2分钟，一旦超时套接字将会自动消除.如果给服务器设置一个`timeout`事件的回调函数，则需要自己去处理超时套接字.

<a name="server.timeout"></a>
**server.timeout**

-  Number = 120000(2分钟)

一个套接字超时之前的静止毫秒数.

注意当连接成功时超时逻辑已启动，所以改变数字值只会影响服务器往后的新连接，而不是已存在的连接.

设为0时将会禁止所有请求连接的自动超时行为.


<a name="http.ServerResponse"></a>
### Class:http.ServerResponse

这个对象将会在HTTP服务器内部创建.传递第二个参数给`request`事件.

该相应实现了[Writeable Stream](http://nodejs.org/api/stream.html#stream_class_stream_writable)接口，这是一个[EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)，包括以下事件：

<a name="http_event_close"></a>
**Event:'close'**

`function() { }`

在[response.end()](http://nodejs.org/api/http.html#http_response_end_data_encoding)被调用或者清除前终止指定的优先连接.

<a name="http_event_finish"></a>
**Event:'finish'**

`function() { }`

响应发送时触发.特别的是，这个事件将会在响应头部和正文体的最后一个片段(segment)通过网络传输给操作系统时触发.但这并不意味着客户端已经接收到信息.

这个事件之后响应对象上将不会再有事件被触发.

<a name="http_response_writecontinue"></a>
**response.writeContinue()**

发送一个HTTP/1.1 100持续信息给客户端，指定的请求正文体将会被发送.参见[checkContinue](http://nodejs.org/api/http.html#http_event_checkcontinue)

<a name="http_response_writehead_statuscode"></a>
**response.writeHead(statusCode[,reasonPhrase][,headers])**

发送一个相应头给请求.状态是一个3-digit HTTP状态码，比如404.最后一个参数`headers`时相应头.可以传入一个可读的`reasonPhrase`作为第二个参数(可选).

例子：

```javascript
var body = 'hello world';
response.writeHead(200, {
	'Content-Length': body.length,
	'Content-Type': 'text/plain'
});
```
这个方法只能在当前请求中调用一次，而且必须在[response.end()](http://nodejs.org/api/http.html#http_response_end_data_encoding)之前调用.

如果你在调用这个方法之前调用[response.write()](http://nodejs.org/api/http.html#http_response_write_chunk_encoding)或者[response.end()](http://nodejs.org/api/http.html#http_response_end_data_encoding),将会调用这个函数，而且隐含/不定的头信息将会被计算.

注意：Content-Length的单位是字符(character)而不是字节(byte).上面的例子可以运行事因为`hello world`字符串只包含一个单字节大小的字符.如果body中多高阶编码的字符，`Buffer.byteLength()`将会来决定指定编码方式的字符串的字节数.Node不会去检查Content-Length和已传输body的长度是否相等.

<a name="http_response_settimeout_msecs"></a>
**response.setTimeout(msecs,callback)**

-  `msecs` Number
-  `callback` Function

设定套接字的超时值为`msecs`.如果有回调函数，那它将会做为响应对象上的`timeout`事件的监听者.

如果请求、响应或者服务器上没有`timeout`监听者，一旦超时套接字将会被移除.如果你在请求、响应或者服务器的`timeout`事件上声明一个handler，需要自行处理超时套接字.

<a name="http_response_statuscode"></a>
**response.statusCode**

当使用隐含的头部时(而不是调用[response.writeHead()](http://nodejs.org/api/http.html#http_response_writehead_statuscode_reasonphrase_headers))，当头部被刷新时，这个属性控制的状态码将会被发送给客户端.

例子：

    response.statusCode = 404;

当响应头部被发送到客户端后，这个属性将会显示已发送的状态码.

<a name="http_response_setheader"></a>
**response.setHeader(name,value)**

给隐含的头部设置一个单一的头部值.如果这个头部存在于即将发布的头部，它的值将会被代替.如果你需要发送名字相同的多个头部时可以使用一个字符串数组来代替.

例子：

    response.setHeader("Content-Type", "text/html");

或者：

    response.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);

<a name="http_response_headerssent"></a>
**response.headersSent**

布尔类型(只读).头部已发送时为`true`，否则为`false`.

<a name="http_response_senddate"></a>
**response.sendDate**

当它为`true`且当前头部没有Date信息时将会自动产生Date头部，并发送，默认为`true`.

测试时应该禁用它.HTTP响应需要Date头部.

<a name="http_response_getheader"></a>
**response.getHeader(name)**

