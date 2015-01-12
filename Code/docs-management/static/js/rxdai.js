//document.domain = "touna.cn";

//
var clientDomain = "";

var ____imageDomain____ = (("https:" == document.location.protocol) ? "https://www.touna.cn/" : "http://img.touna.cn/"); //用户上传的图片使用此域名
var ____domain____ = "";

var ____auth____ = "/auth.do";
var ____bbs_auth____ = "/auth.admin";
var ____bbsLogin____ = ____domain____ + "/auth.admin";
var ____bbsPost____ = ____domain____ + "/bbsPost.do";
var ____bbsSign____ = ____domain____ + "/bbsSign.do";
var ____bbsNotice____ = ____domain____ + "/bbsNotice.do";
var ____bbsApi____ = ____domain____ + "/bbsApi.do";
var ____licai____ = ____domain____ + "financing.do";
var ____bbsApi____ = "/bbsApi.do";

var ____upload____kindeditor____files____ = ____domain____ + "/bbsFileUpLoad.do";
var ____bbsfinancingFileUpLoad____ = ____domain____ + "/bbsfinancingFileUpLoad.do";

var ___invoke___interface___timeout___ = 10000;

var ___error___html___ = "http://cash.xunlei.com/error.html";
var ____account____html____ = ____domain____ + "/account.html";
var ____borrow____protocol____ = ____domain____ + "/borrow_protocol.html";

var rxdai = {};

rxdai.loadJsonData = function(url_src, callback, err_handle) { //调用JSON数据
	var timeOut = false;
	var ok = false;
	$.getJSON(url_src, function(jsondata) {
		if (!timeOut) {
			ok = true;
			callback(jsondata);
		}
	});
	setTimeout(function() {
		if (!ok) {
			timeOut = true;
			if (err_handle) err_handle(0);
		}
	}, ___invoke___interface___timeout___);
}

rxdai.loadData = function(url, data, success, error) {
	var timeOut = true;
	if (data && (typeof(data) == "object")) {
		data.subtime = new Date().getTime();
	} else {
		data = {
			subtime: (new Date().getTime())
		};
	}
	setTimeout(function() {
		if (timeOut && error) error(0);
	}, ___invoke___interface___timeout___);
	$.ajax({
		"url": url,
		"data": data,
		"cache": false,
		"success": function(rtnData) {
			timeOut = false;
			if (rtnData.status == 302) {
				rxdai.alert(rtnData.desc); // 
				if (rtnData.result) location = ____domain____ + rtnData.result;
			} else if (rtnData.status == 200) {
				if (success) {
					success(rtnData);
				}
			} else {
				if (error) {
					error(rtnData);
				} else {
					location = ___error___html___ + "?errMsg=" + rtnData.desc;
				}
			}
		},
		"error": function(rtnData, t, tt) {
			timeOut = false;
			if (error) {
				error(rtnData)
			} else {
				location = ___error___html___;
			} //这里改为server internal error.
		},
		dataType: "json"
	});
}

rxdai.postLoadData = function(url, data, success, error) {
	var timeOut = true;
	if (data && (typeof(data) == "object")) {
		data.subtime = new Date().getTime();
	} else {
		data = {
			subtime: (new Date().getTime())
		};
	}
	setTimeout(function() {
		if (timeOut && error) error(0);
	}, ___invoke___interface___timeout___);
	$.ajax({
		"url": url,
		"data": data,
		"type": "post",
		"success": function(rtnData) {
			timeOut = false;
			if (rtnData.status == 302) {
				rxdai.alert(rtnData.desc);
				if (rtnData.result) location = ____domain____ + rtnData.result;
			} else if (rtnData.status == 200) {
				if (success) {
					success(rtnData);
				}
			} else {
				if (error) {
					error(rtnData);
				} else {
					location = ___error___html___ + "?errMsg=" + rtnData.desc;
				}
			}
		},
		"error": function(rtnData, t, tt) {
			timeOut = false;
			if (error) {
				error(rtnData)
			} else {
				location = ___error___html___;
			} //这里改为server internal error.
		},
		dataType: "json"
	});
}

rxdai.asyncFalseLoadData = function(url, data, success, error) {
	var timeOut = true;
	if (data && (typeof(data) == "object")) {
		data.subtime = new Date().getTime();
	} else {
		data = {
			subtime: (new Date().getTime())
		};
	}
	setTimeout(function() {
		if (timeOut && error) error(0);
	}, ___invoke___interface___timeout___);
	$.ajax({
		"url": url,
		"data": data,
		"async": false,
		"success": function(rtnData) {
			timeOut = false;
			if (rtnData.status == 302) {
				rxdai.alert(rtnData.desc);
				if (rtnData.result) location = ____domain____ + rtnData.result;
			} else if (rtnData.status == 200) {
				if (success) {
					success(rtnData);
				}
			} else {
				if (error) {
					error(rtnData);
				} else {
					location = ___error___html___ + "?errMsg=" + rtnData.desc;
				}
			}
		},
		"error": function(rtnData, t, tt) {
			timeOut = false;
			if (error) {
				error(rtnData)
			} else {
				location = ___error___html___;
			} //这里改为server internal error.
		},
		dataType: "json"
	});
}

rxdai.endWith = function(str, suffix) {
	if (str == null) return false;
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

rxdai.doFailed = function(data, selector) {
	var desc = data.desc;
	rxdai.alert(desc, selector);
}

rxdai.alert = function(str, selector) {
	if (selector) $(selector).html(str);
	else if (str) alert(str);
}

rxdai.confirm = function(str) {
	if (str) {
		return confirm(str);
	}
	return false;
}

//保存到小数点后两位  0.00
rxdai.fixMoney = function(price) {
	return (!price || price == "undefined" || price == 0) ? '0.00' : Number(price).toFixed(2);
}

//取整数 0
rxdai.fixMoney0 = function(price) {
	return (!price || price == "undefined" || price == 0) ? '0' : Number(price).toFixed(0);
}

//取金额，并格式化
rxdai.fixMoneyFormat = function(money) {
	var money = (!money || money == "undefined" || money == 0) ? '0.00' : Number(money).toFixed(2);
	money = money.toString();
	money = money.split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('');
	if (money.length > 0) {
		if (money.charAt(0) == ',') {
			money = money.substr(1);
		}
	}
	money = money.replace('.,', '.');
	return money;
}

rxdai.$html = function(id, content) {
	xl(id).innerHTML = content;
}

rxdai.encodeUrl = function(url) {
	if (url && url != "" && url != "undefined") {
		url = encodeURIComponent(url);
	}
	return url;
}
rxdai.decodeUrl = function(url) {
	if (url && url != "" && url != "undefined") {
		url = decodeURIComponent(url);
	}
	return url;
}

rxdai.checkPhone = function(phonenum) {
	if (!phonenum || phonenum == "") {
		return false;
	}
	//var reg = /^[0-9]{11,15}$/;
	var reg = /^1[3,4,5,7,8]\d{9}$/;
	if (reg.test(phonenum)) {
		return true;
	}
	return false;
}

rxdai.checkCard = function(card) {
	if (!card || card == "") {
		return false;
	}
	var reg1 = /^[1-9][0-7]\d{4}(((19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)$/;
	if (reg1.test(card)) {
		return true;
	}
	return false;
}
// 字母与数字的组合，长度为6-18位
rxdai.checkPwd = function(str) {
	if (/^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/.test(str) && !/\s/.test(str)) {
		return true;
	} else {
		rxdai.alert("密码6-20位，必须含有英文字母和数字，可以有特殊字符，不能有空格");
		return false;
	}
}

rxdai.showInCenter = function(obj) {
	var left = 0;
	var top = document.documentElement.scrollTop;
	left += document.documentElement.clientWidth / 2 - obj.clientWidth / 2;
	top += document.documentElement.clientHeight / 2 - obj.clientHeight / 2;
	obj.style.left = left + "px";
	obj.style.top = top + "px";
}

rxdai.loginOut = function() {
	var retUrl = "http://172.168.20.247:14803/user-login.html";
	var param = {
		'method':'logout'
	};
	rxdai.loadData(____auth____, param, function(data) { 
		window.location=retUrl
	}, function(data){
		rxdai.doFailed(data);
	}); 
}

rxdai.bbs_loginOut = function() {
	var retUrl = "/admin-html/login.html";
	var param = {
		'method': 'logout'
	};
	rxdai.loadData(____bbs_auth____, param, function(data) {
		window.location = retUrl
	}, function(data) { 
		rxdai.doFailed(data);
	});
}

rxdai.showpage = function(count, page, size) {
	_page = 18;
	//刚好整数就不要加1
	count = count || 1;
	var total = Math.ceil(count / size);
	var html;
	var pageList = '';
	var previous = page; //上一页
	var next = ''; //下一页
	var begin; //开始页数
	var end; //结束页数
	var end_page;
	page = page + 1;
	begin = page - 3;
	end = page + 3;
	if (page != 1) {
		previous = page - 1
		previous = '<span page="' + previous + '" class="page-link long">上一页</span>';
	} else {
		previous = '<span class="page-link long gray">上一页</span>';
	}

	if (begin < 1) {
		begin = 1;
	} else if (begin > 1) {
		//添加第一二页
		if (begin >= 2) {
			pageList += '<li class="fn-clear fLeft"><span page ="1" class="page-link">1</span></li>';
		}
		if (begin >= 3) {
			pageList += '<li class="fn-clear fLeft"><span page ="2" class="page-link">2</span></li>';
		}
		if (begin >= 4) {
			pageList += '<li class="fn-clear fLeft"><span class="page-link disabled">...</span></li>';
		}
	}
	//添加页码
	for (var i = begin; i <= page; i++) {
		if (page == i) {
			pageList += '<li class="fn-clear fLeft"><span class="page-link current">' + i + '</span></li>'
		} else {
			pageList += '<li class="fn-clear fLeft"><span page="' + i + '" class="page-link">' + i + '</span></li>'
		}
	}


	if (page < total) {
		next = page + 1
		next = '<span page="' + next + '" class="page-link long">下一页</span>';
	} else {
		next = '<span class="page-link long gray">下一页</span>';
	}

	if (end > total) {
		end = total;
	}

	for (var i = page + 1; i <= end; i++) {
		pageList += '<li class="fn-clear fLeft"><span page="' + i + '" class="page-link">' + i + '</span></li>'
	}
	end_page = total - end;
	end_page_second = total - 1;
	if (end_page > 0) {
		if (end_page >= 2) {
			pageList += '<li class="fn-clear fLeft"><span class="page-link disabled">...</span></li>';
			pageList += '<li class="fn-clear fLeft"><span page ="' + end_page_second + '" class="page-link">' + end_page_second + '</span></li>';
		}
		if (end_page >= 1) {
			pageList += '<li class="fn-clear fLeft"><span page ="' + total + '" class="page-link">' + total + '</span></li>';
		}
	}

	html = '<div id="page-list" class="page-list mt20 fn-clear">';
	html += '<ul class=" fRight">';
	html += previous;
	html += pageList;
	html += next;
	return html;
}

rxdai.getLoading = function() {
	return '<div class="loading txtC pt30"><img style="width:200px;" src="static/img/pic/loading.gif" /></div>';
}

/**
 * 弹出蒙层
 * @param {Object} zIndex
 */
function openLayer(zIndex) {
	$('#popupDiv').height(document.documentElement.clientHeight + document.documentElement.scrollTop);
	$('#popupDiv').width(document.documentElement.clientWidth);
	//	document.getElementById("popupDiv").style.filter = "alpha(opacity=10)"; 
	document.getElementById("popupDiv").style.opacity = 0.1;
	if (zIndex)
		document.getElementById("popupDiv").style.zIndex = zIndex;
	$('#popupDiv').show();
}

//关闭弹出层
function closeLayer() {
	$('#popupDiv').hide();
}

rxdai.recordLoginInfo = function(sessionid, uname, uid) {
	if (sessionid && sessionid != "" && sessionid != 'undefined') {
		xl.setCookie('sessionid', sessionid);
		xl.setCookie('sessionidcach', sessionid);
	}
	if (uname && uname != "" && uname != 'undefined') {
		xl.setCookie('username', uname);
	}
	if (uid && uid != "" && uid != 'undefined') {
		xl.setCookie('userid', uid);
	}
}

rxdai.isLoginByCookie = function() {
	var sessionid = xl.getCookie("sessionid");
	var sessionidcach = xl.getCookie("sessionidcach");
	if (sessionid) {
		sessionid = $.trim(sessionid);
		sessionidcach = $.trim(sessionidcach);
		if (sessionid != "" && sessionid != 'undefined') {
			if (!sessionidcach || sessionidcach == sessionid) {
				xl.setCookie('sessionid', sessionid);
				return true;
			} else
				return false;
		}
	}
	return false;
}

rxdai.removeLoginInfo = function() {
	var keys = new Array('sessionid', 'userid', 'username', 'sessionidcach');
	for (var i = 0; i < keys.length; i++) {
		xl.delCookie(keys[i]);
	}
}

rxdai.getUsername = function() {
	var retVar = (rxdai.isLogin() && xl.getCookie('username')) ? xl.getCookie('username') : "";
	return retVar;
}

rxdai.isLogin = function(success) {	   //判断是否登陆的方法
	var parameters = {
		'method':'isLogin'
	};
	rxdai.asyncFalseLoadData(____auth____, parameters, function(data) {
		success(data)
	}, function(data) { 
		rxdai.doFailed(data)
	});
}

rxdai.bbs_isLogin = function(success) {
	var parameters = {
		'method': 'isLogin'
	};
	rxdai.asyncFalseLoadData(____auth____, parameters, function(data) {
		success(data)
	}, function(data) {
		rxdai.doFailed(data)
	});
}

rxdai.getAccount = function(success) {
	var parameters = {
		'method': 'getAccount'
	};
	rxdai.loadData(____account____, parameters, function(data) {
		success(data)
	}, function(data) {
		rxdai.doFailed(data)
	});

}

rxdai.changStatus = function(data) {
	if (data.result) { //如果data.result有值
		var user = data.result;
		if (user && user.username) {
			$("#user-name").html(user.username);
			$("#msg-count").html(user.msgCount);
			$("#top-reg").hide();
			$("#top-link").show();
			if (user.msgCount > 0) {
				$("#msg-notice em").removeClass("title");
			}
			$("#msg-notice").show();
			if (user.isAdmin == 0) {
				$("#bbs-audit-li").remove();
				$("#bbs-blacklist").remove();
			}
			$("#userimg").attr("src", ____imageDomain____ + "/data/avatar/" + user.userid + "_avatar_middle.jpg")
		}
	} else {
		$("#top-reg").show();
		$("#top-link").hide();
	}
}

rxdai.loginLocation = function(data) {
	var user = data.result;
	if (!user) {
		window.location = "user-login.html";
	}
}

rxdai.loadProvinceData = function(success) {
	rxdai.loadJsonData(____domain____ + '/jsonfile/province.html', success, rxdai.doFailed);
}

//根据省id加载城市信息
rxdai.loadCityData = function(provid, success) {
	rxdai.loadJsonData(____domain____ + '/jsonfile/ct/ct_' + provid + '.html', success, rxdai.doFailed);
}

//一系列格式日期时间方法函数--使用时需要引入moment.min.js
rxdai.formatYYYYMMDD = function(unixtimestamp) {
	return rxdai.formatTime(unixtimestamp, 'YYYY-MM-DD');
}
rxdai.formatYYYYMMDDhhmmss = function(unixtimestamp) {
	return rxdai.formatTime(unixtimestamp, 'YYYY-MM-DD HH:mm:ss');
}
rxdai.formatYYYYMMDDhhmm = function(unixtimestamp) {
	return rxdai.formatTime(unixtimestamp, 'YYYY-MM-DD HH:mm');
}
rxdai.formatTime = function(unixtimestamp, formatter) {
	return moment.unix(unixtimestamp).format(formatter);
}
rxdai.searchPost = function() {
	window.location = '/bbs-search.html?content=' + $("#search-input").val();
};

rxdai.getNewNoticeNum = function() {
	if ( !! $("#user-name").html()) {
		var params = {
			"method": "getNewNoticeNum"
		};
		rxdai.loadData(____bbsNotice____, params, function(data) {
			rxdai.getNewNoticeNumOk(data)
		}, function(data) {});
	}
}

rxdai.getNewNoticeNumOk = function(data) {
	var result = data.result;
	if (result) {
		$("#msg_num").html(result.num);
		$("#msg_reminder").toggle(parseInt(result.num) > 0);

		setInterval(function() {
			$("#msg_icon").toggle();
		}, 200);
	}
}