window.onload = function() {
	var lazychat = new LazyChat();	
	lazychat.init();
};

var LazyChat = function() {
	this.socket = null;
};

/** Random avatar bg color **/
//var colors = ['Aqua', 'AntiqueWhite', 'Aquamarine', 'DarkSalmon', 'Green', 'LightCoral', 'LightSeaGreen', 'PaleGreen', 'StellBlue', 'Teal'];

/** @ **/
$(document).on('click', '#chatbox .avatar', function() {
	var textarea = document.getElementById('messageInput');
	textarea.value = textarea.value + '@' + $(this).attr('data-user') + ' ';
	textarea.focus();
    textarea.selectionStart =textarea.selectionEnd = textarea.value.length;
});

/** Emonicon **/
$(document).on('click', '#niconWrapper ul li', function() {
	var textarea = document.getElementById('messageInput');
	textarea.value = textarea.value + $(this).text();
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
		this.socket.on('newImg', function(user, dataURL, color) {
			that._displayImg(user, dataURL, color);
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
				msg = messageInput.value;
				/** 自定义文字颜色 **/
				//color = document.getElementById('colorSelect').value;
				messageInput.value = '';
				messageInput.focus();
			if(msg.trim().length != 0) {
				that.socket.emit('postMsg', msg);
				that._displayMsg('me', msg);
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
			var emoWrapper = document.getElementById('emoWrapper'),
				niconWrapper = document.getElementById('niconWrapper');
			if(e.target != emoWrapper) {
				emoWrapper.style.display = 'none';
			};
			if(e.target != niconWrapper) {
				niconWrapper.style.display = 'none';
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
		this._initEmonicon();
		document.getElementById('emonicon').addEventListener('click', function(e){
			document.getElementById('niconWrapper').style.display = 'block';
			e.stopPropagation();
		});
		document.getElementById('messageInput').addEventListener('keyup', function(e){
			var messageInput = document.getElementById('messageInput'),
				msg = messageInput.value;
				/** 自定义文字颜色 **/
				//color = document.getElementById('colorSelect').value;		
			if(e.keyCode == 13 && msg.trim().length != 0){	
				messageInput.value = '';			
				that.socket.emit('postMsg', msg);
				that._displayMsg('me', msg);
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
	_initEmonicon: function() {
		$.ajax({
			type: 'GET',
			url: '../yan.json',
			success: function(data) {
				var niconContainer = document.getElementById('niconWrapper'),
					docFragment = document.createDocumentFragment();

				var niconItems = document.createElement('div');
					for(var n = 0; n < data.list.length; n++) {						
						var niconItemUl1 = document.createElement('ul'),
							niconItemLi1 = document.createElement('li');
						niconItemLi1.innerHTML = data.list[n].title;
						niconItemUl1.appendChild(niconItemLi1);
						niconItems.appendChild(niconItemUl1);
						var niconItemUl2 = document.createElement('ul');
						for(var m = 0; m < data.list[n].yan.length; m++) {							
							niconItemLi2 = document.createElement('li');
							niconItemLi2.innerHTML = data.list[n].yan[m];
							niconItemUl2.appendChild(niconItemLi2);
						}
						niconItems.appendChild(niconItemUl2);	
						docFragment.appendChild(niconItems);
						//console.log(data.list);
					}
					niconContainer.appendChild(docFragment);

			},
			error: function(err) { console.log(err)}
		});
		
	},
	_displayMsg: function(user, msg, color) {
		var container = document.getElementById('chatbox'),
			msgToDisplay = document.createElement('li'),
			date = new Date().toTimeString().substr(0, 8),
			msg = this._displayEmo(msg);

		/** 文字颜色 **/
		//msgToDisplay.style.color = color || '#000';
		if(user.trim()==="system") {
			msgToDisplay.style.color = color;
			msgToDisplay.innerHTML = '<div class="avatar" style="background: red' +
			';" data-user="' + user +'"> ' + '！' + '</div><em class="boxleft"></em>' + 
			'<div class="body boxright">'+ '<div class="head">'+ user + date + '</div><div class="msgContent"><p>' + msg +'</p></div></div>';
		} else {
			msgToDisplay.innerHTML = '<div class="avatar" style="background:'+ color +
			';" data-user="' + user +'"> ' + user.substr(0, 1).toUpperCase() + '</div><em class="boxleft"></em>' + 
			'<div class="body boxright">'+ '<div class="head">'+ user + date + '</div><div class="msgContent"><p>' + msg +'</p></div></div>';
		}	
		container.appendChild(msgToDisplay);
		container.scrollTop = container.scrollHeight;
		//console.log(document.getElementById('chatbox').children.length);
	},
	_displayImg: function(user, dataURL, color) {
		var container = document.getElementById('chatbox'),
        imgToDisplay = document.createElement('li'),
        date = new Date().toTimeString().substr(0, 8);

		imgToDisplay.innerHTML = '<div class="avatar" style="background:'+ color +
		';" data-user="' + user +'"> ' + user.substr(0, 1).toUpperCase() + '</div><em class="boxleft"></em>' + 
		'<div class="body boxright">'+ '<div class="head">'+ user + date + '</div><br />' + '<a href="' + dataURL +
		 '" target="_blank"><img src="' + dataURL + '" /></a></div>';
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

