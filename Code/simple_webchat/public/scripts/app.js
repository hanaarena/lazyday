window.onload = function() {
	var lazychat = new LazyChat();	
	lazychat.init();
};

var LazyChat = function() {
	this.socket = null;
};

/** Random avatar bg color **/
var	colors = ['Aqua', 'AntiqueWhite', 'Aquamarine', 'DarkSalmon', 'Green', 'LightCoral', 'LightSeaGreen', 'PaleGreen', 'StellBlue', 'Teal'];

/** @ **/
$(document).on('click', '#chatbox .avatar', function(){
	var textarea = document.getElementById('messageInput');
	textarea.value = textarea.value + '@' + $(this).attr('data-user') + ' ';
	textarea.focus();
    textarea.selectionStart =textarea.selectionEnd = textarea.value.length;
});

LazyChat.prototype = {
	init: function() {		
		var that = this;
		document.getElementById('nicknameInput').focus();
		this.socket = io.connect();
		this.socket.on('connect', function() {
			document.getElementById('info').textContent = 'Enter Your Nickname:';
			document.getElementById('nicknameWrapper').style.display = 'block';
			document.getElementById('nicknameInput').focus();
		});
		this.socket.on('nickExisted', function() {
			document.getElementById('info').textContent = 'Your nickname is taken,please choose another one';
			document.getElementById('nicknameInput').value = '';
			document.getElementById('nicknameInput').focus();
		});
		this.socket.on('loginSuccess', function(nickname) {
			document.title = 'lazychat | ' + document.getElementById('nicknameInput').value;
			document.getElementById('loginWrapper').style.display = 'none';
			document.getElementById('messageInput').focus();
			that._displayMsg('system ', 'Welcome ' + nickname, 'red');
		});
		this.socket.on('system', function(nickName, userCount, type) {
			var msg = nickName + (type == 'login' ? ' joined' : ' left');
			that._displayMsg('system ', msg, 'red');
		});
		this.socket.on('updateUserList',function(userCount) {
			document.getElementById('user-list').textContent = userCount + (userCount > 1 ? ' users' : ' user')+ ' online';
		});
		this.socket.on('newMsg', function(user, msg, color) {
			that._displayMsg(user, msg, color);
		});
		this.socket.on('newImg', function(user, dataURL) {
			that._displayImg(user, dataURL);
		});

		document.getElementById('loginBtn').addEventListener('click', function() {
			var nickname = document.getElementById('nicknameInput').value;
			if(nickname.trim().length != 0) {
				that.socket.emit('login', nickname);
			} else {
				document.getElementById('nicknameInput').style.backgroundColor = '#fef1f1';
				document.getElementById('nicknameInput').setAttribute('placeholder', 'Please enter your nickname');
				document.getElementById('nicknameInput').classList.add('errors');
				setTimeout('nicknameInput.setAttribute("placeholder","Enter your nickname")',1000);
				setTimeout('nicknameInput.style.backgroundColor=""',1000);
				document.getElementById('nicknameInput').focus();
			};
		}, false);
		document.getElementById('nicknameInput').addEventListener('keyup', function(e){
			if(e.keyCode == 13) {
				var nickname = document.getElementById('nicknameInput').value;
				if(nickname.trim().length != 0) {
					that.socket.on('login', nickname);
				} else {
					document.getElementById('nicknameInput').style.backgroundColor = '#fef1f1';
					document.getElementById('nicknameInput').setAttribute('placeholder', 'Please enter your nickname');
					document.getElementById('nicknameInput').classList.add('errors');
					setTimeout('nicknameInput.setAttribute("placeholder","Enter your nickname")',1000);
					setTimeout('nicknameInput.style.backgroundColor=""',1000);
					document.getElementById('nicknameInput').focus();
				};
			};
		}, false);
		document.getElementById('sendBtn').addEventListener('click', function() {
			var messageInput = document.getElementById('messageInput'),
				msg = messageInput.value,
				color = document.getElementById('colorSelect').value;
				messageInput.value = '';
				messageInput.focus();
			if(msg.trim().length != 0) {
				that.socket.emit('postMsg', msg, color);
				that._displayMsg('me', msg, color);
			} else {
				messageInput.focus();
			}
		}, false);
		document.getElementById('sendImg').addEventListener('change', function() {
			if(this.files.length != 0) {
				var reader = new FileReader(),
					file = this.files[0];
				if(!reader) {
					this.value = '';
					that._displayMsg('system', 'Your brower does\'t support FileReader.', 'red');
					return;
				}
				reader.onload = function(e) {
					this.value = '';
					that._displayImg('me', e.target.result);
					that.socket.emit('img', e.target.result);
				}
				reader.readAsDataURL(file);
			}		
		}, false);
		this._initEmo();
		document.getElementById('emo').addEventListener('click', function(e) {
			document.getElementById('emoWrapper').style.display = 'block';
			e.stopPropagation();
		}, false);
		document.body.addEventListener('click', function(e) {
			var emoWrapper = document.getElementById('emoWrapper');
			if(e.target != emoWrapper) {
				emoWrapper.style.display = 'none';
			};
		}, false);
		document.getElementById('emoWrapper').addEventListener('click', function(e) {
			var target = e.target;
			if(target.nodeName.toLowerCase() === 'img') {
				var messageInput = document.getElementById('messageInput');
				messageInput.focus();
				messageInput.value = messageInput.value + '[emo:' + target.title + ']';
			};
		}, false);
		document.getElementById('messageInput').addEventListener('keyup', function(e){
			var messageInput = document.getElementById('messageInput'),
				msg = messageInput.value,
				color = document.getElementById('colorSelect').value;		
			if(e.keyCode == 13 && msg.trim().length != 0){	
				messageInput.value = '';			
				that.socket.emit('postMsg', msg, color);
				that._displayMsg('me', msg, color);
				messageInput.focus();
			};
		}, false);
	},
	_initEmo: function() {
		var emoContainer = document.getElementById('emoWrapper'),
			docFragment = document.createDocumentFragment();
		for(i = 3; i > 0; i--) {
			var emoItems = document.createElement('img');
			emoItems.src = "../content/emo/" + i + '.gif';
			emoItems.title = i;
			docFragment.appendChild(emoItems);
		}
		emoContainer.appendChild(docFragment);
	},
	_displayMsg: function(user, msg, color) {
		var container = document.getElementById('chatbox'),
			msgToDisplay = document.createElement('li'),
			date = new Date().toTimeString().substr(0, 8),
			msg = this._displayEmo(msg);
		/*if(user.trim()==="system") {
		 *	msgToDisplay.style.backgroundColor = 'red';
		 *} else { ... }
		 */
		msgToDisplay.style.color = color || '#000';
		msgToDisplay.innerHTML = '<div class="avatar" style="background:'+ colors[Math.ceil(Math.random()*10)] +
		';" data-user="' + user +'"> ' + user.substr(0, 1).toUpperCase() + '</div><em class="boxleft"></em>' + 
		'<div class="body boxright">'+ '<div class="head">'+ user + date + '</div><div class="msgContent"><p>' + msg +'</p></div></div>';
		container.appendChild(msgToDisplay);
		container.scrollTop = container.scrollHeight;
		//console.log(document.getElementById('chatbox').children.length);
	},
	_displayImg: function(user, dataURL) {
		var container = document.getElementById('chatbox'),
        imgToDisplay = document.createElement('p'),
        date = new Date().toTimeString().substr(0, 8);

		imgToDisplay.innerHTML = user + ' <span class="timespan">(' + date + '):</span><br />' + '<a href="' + dataURL +
		 '" target="_blank"><img src="' + dataURL + '" /></a>';
		 container.appendChild(imgToDisplay);
		 container.scrollTop = container.scrollHeight;
	},
	_displayEmo: function(msg) {
		var match, result = msg,
			reg =/\[emo:\d+\]/g,
			emoIndex,
			totalEmoNum = document.getElementById('emoWrapper').children.length;
		while(match = reg.exec(msg)) {
			emoIndex = match[0].slice(5, -1);
			if(emoIndex > totalEmoNum) {
				result = result.replace(match[0], '[X]');
			} else {
				result = result.replace(match[0], '<img class="emo" src="../content/emo/' + emoIndex + '.gif" />');			
			};
		};
		return result;
	}
};

