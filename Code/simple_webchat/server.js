var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = [],
	colors = ['Aqua', 'AntiqueWhite', 'Aquamarine', 'DarkSalmon', 'Green', 'LightCoral', 'LightSeaGreen', 'PaleGreen', 'StellBlue', 'Teal'];

app.use('/', express.static(__dirname + '/public'));

server.listen(process.env.PORT || 3000);

io.sockets.on('connection', function(socket) {

	/**
	 *在connection事件的回调函数中，
	 *socket表示的是当前连接到服务器的那个客户端。
	 *所以代码socket.emit('foo')则只有自己收得到这个事件，
	 *而socket.broadcast.emit('foo')则表示向除自己外的所有人发送该事件，
	 *另外，上面代码中，io表示服务器整个socket连接，
	 *所以代码io.sockets.emit('foo')表示所有人都可以收到该事件。
	 */

	//User login
	socket.on('login', function(nickname) {
		if(users.indexOf(nickname) > -1) {
			socket.emit('nickExisted');
		} else {
			socket.userIndex = users.length;
			socket.nickname = nickname;
			socket.colors = colors[Math.ceil(Math.random()*10)];
			users.push(nickname);
			socket.emit('loginSuccess', nickname);
			socket.broadcast.emit('system', nickname, users.length, 'login');
			io.sockets.emit('updateUserList', users.length);
		};
	});
	socket.on('disconnect', function() {
		users.splice(socket.userIndex, 1);
		socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
	});
	socket.on('postMsg', function(msg) {
		socket.broadcast.emit('newMsg', socket.nickname, msg, socket.colors);
	});
	socket.on('img', function(dataURL) {
		socket.broadcast.emit('newImg', socket.nickname, dataURL, socket.colors);
	});
});