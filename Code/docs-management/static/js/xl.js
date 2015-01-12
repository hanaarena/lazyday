/** 
 * @fileoverview  xunlei JavaScript Library
 * @author Brice Li (brice_li@hotmail.com QQ: 19130696 RTX: lixin)
 * @version 0.5 
 * @date 2009-08-05
 */
//common tool
/**
 * 同document.getElementByID()
 * @namespace 常用工具
 * @param {String} e page element id
 * @return page element
 */
var xl = function(e){
	return document.getElementById(e);
}
/**
 * 返回当前URL上的变量 "http://a.xunlei.com/?name1=value1&name2=value2&...."
 * @param {String} n 变量名
 * @return 变量值
 */
xl.P = function(n){		
	var hrefstr, pos, parastr, para, tempstr;
	hrefstr = window.location.href;
	pos = hrefstr.indexOf("?");
	parastr = hrefstr.substring(pos + 1);
	para = parastr.split("&");
	tempstr = "";
	for (i = 0; i < para.length; i++) {
		tempstr = para[i];
		pos = tempstr.indexOf("=");
		if (tempstr.substring(0, pos).toLowerCase() == n.toLowerCase()) {
			return decodeURIComponent(tempstr.substring(pos + 1));
		}
	}
	return null;	
}
//cookie operation
/**
 * 添加或覆盖cookie
 * @param {String} name cookie变量名
 * @param {String} value cookie变量值
 * @param {Object} p cookie的其他附加参数 格式如下（没有则默认为null）<br/>
 * 	{"expires": [cookie存在的时间，可以是"session" "hour" "day" "week" "year" "forever" 或 毫秒数或 Date对象],<br/>
 * 		"path":null,<br/>
 * 		"domain":null,<br/>
 * 		"secure":null}<br/>
 */
xl._setCookie = function(name,value,p){
	  var sCookie = name + '=' + encodeURIComponent(value);
	  if(p){
	  	if(p.expires){
		  	if(p.expires!="session"){
				var etime = new Date();
				if(p.expires instanceof Date){ etime = p.expires}
				else if(!isNaN(p.expires)){etime.setTime(etime.getTime() + p.expires)}
				else if(p.expires=="hour"){etime.setHours(etime.getHours() + 1);}
				else if(p.expires=="day"){etime.setDate(etime.getDate() + 1)}
				else if(p.expires=="week"){etime.setDate(etime.getDate() + 7);}
				else if(p.expires=="year"){etime.setFullYear(etime.getFullYear() + 1);}
				else if(p.expires=="forever"){etime.setFullYear(etime.getFullYear() + 120);}//够了。。。
				else{etime = p.expires}
				sCookie += "; expires=" + etime.toGMTString();
			}
		  }
		  if(p.path){
		  	sCookie += "; path=" + p.path;
		  }else{
			sCookie += "; path=/";  
		  }
		  if(p.domain){
		  	sCookie += "; domain=" + p.domain;
		  }else{
		  	sCookie += "; domain=*";//TODO:调试状态
			//sCookie += "; domain=.xunlei.com";
		  }
		  if(p.secure){
		  	sCookie += "; secure=" + p.secure;
		  }
	  }
	  document.cookie=sCookie;
}
xl.setCookie = function(name,value,p){
	xl._setCookie(name,value,{"expires":""});	
}
/**
 * 删除cookie
 * @param {String} name cookie变量名
 */
xl.delCookie = function(name){
	xl.setCookie(name,'',{"expires":new Date(0)});
}
/**
 * 得到cookie值
 * @param {String} name cookie变量名
 * @return cookie 变量值
 */
xl.getCookie = function(objname){
	var arrstr = document.cookie.split("; ");
	for(var i = 0;i < arrstr.length;i ++)
	{
		var temp = arrstr[i].split("=");
		if(temp[0] == objname) return decodeURIComponent(temp[1]);
	}
	return null;
}
//json operation
/**
 * @namespace json工具需要使用到的常量和方法
 */
xl.json = {};
/**
 * @private 
 * @param {Object} n
 */
xl.json._toIntegersAtLease = function(n){
	return n < 10 ? '0' + n : n;
}
/**
 * @private 
 */
xl.json._escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
/**
 * @private 
 */
xl.json._meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
/**
 * @private 
 * @param {String} n
 */
xl.json._quoteString = function(string){
	if (xl.json._escapeable.test(string)){
    	return '"' + string.replace(xl.json._escapeable, function (a){
                var c = xl.json._meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
}
/**
 * 把一个JSON对象转化成字符串<br/>
 * 和jquery得JSON插件完全相同
 * @param {Object} o json对象
 * @param {Object} compact 可以不输入
 * @returns {String} json字符串
 */
xl.toJSON = function(o, compact){
    var type = typeof(o);
    
    if (type == "undefined") 
        return "undefined";
    else 
        if (type == "number" || type == "boolean") 
            return o + "";
        else 
            if (o === null) 
                return "null";
	if (type == "object" && o instanceof Date){
		return o.getUTCFullYear() + '-' +
             xl.json._toIntegersAtLease(o.getUTCMonth()) + '-' +
             xl.json._toIntegersAtLease(o.getUTCDate());
	}
	// Is it a string?
    if (type == "string") {
        return xl.json._quoteString(o);
    }
    
    // Does it have a .toJSON function?
    if (type == "object" && typeof o.toJSON == "function") 
        return o.toJSON(compact);
		
    // Is it an array?
    if (type != "function" && typeof(o.length) == "number") {
        var ret = [];
        for (var i = 0; i < o.length; i++) {
            ret.push(xl.toJSON(o[i], compact));
        }
        if (compact) 
            return "[" + ret.join(",") + "]";
        else 
            return "[" + ret.join(", ") + "]";
    }
    
    // If it's a function, we have to warn somebody!
    if (type == "function") {
        throw new TypeError("Unable to convert object of type 'function' to json.");
    }
    
    // It's probably an object, then.
    var ret = [];
    for (var k in o) {
        var name;
        type = typeof(k);
        
        if (type == "number") 
            name = '"' + k + '"';
        else 
            if (type == "string") 
                name = xl.json._quoteString(k);
            else 
                continue; //skip non-string or number keys
        var val = xl.toJSON(o[k], compact);
        if (typeof(val) != "string") {
            // skip non-serializable values
            continue;
        }
        
        if (compact) 
            ret.push(name + ":" + val);
        else 
            ret.push(name + ": " + val);
    }
    return "{" + ret.join(", ") + "}";
}
/**
 * 等同于eval([json string])把json string转换为json 对象
 * @param {String} data json String
 * @returns {Object} json object
 */
xl.evalJSON = function(data){
	return eval(("(" + data + ")"));
}
/**
 * string.trim方法
 * @param {String} text
 * @returns {String}
 */
xl.trim = function(text){
	return (text || "").replace( /^\s+|\s+$/g, "" );
}
/**
 * 序列化json map 把{"a":1,"b":2} 转化为 a=1&b=2的形式 ，值默认都会被encode
 * @param {Object} params json map like {"a":1,"b":2}
 * @returns {String} 序列化的结果
 */
xl.param = function(params){
	var p = "";
	for(var pp in params)
		p += "&" + pp + "=" + encodeURIComponent(params[pp]);
	return p.length > 1 ? p.slice(1) : p ;
}
/**
 * 获取url上的参数
 * @param {String} params 字符串
 * @returns {String}
 */
xl.getURLParam = function(params){
	var arr = decodeURI(location.search.substring(1)).split('&');
	for(var i = 0, len = arr.length; i < len; i++){
		if(arr[i].substring(0,arr[i].indexOf('=')) == params){
			return arr[i].substring(arr[i].indexOf('=')+1);
		}
	}
}
/**
 * 把形如 "YYYY-MM-DD" 的字符串解析为Date对象
 * @param {String} str 字符串
 * @param {String} format 默认"yyyy-mm-dd"
 * @returns {Date}
 */
xl.parseDate = function(str,format){
	var vals = str.split("-");
	var td = new Date();
	td.setFullYear(vals[0]);
	if(vals[1].charAt(0)=='0') vals[1] = vals[1].charAt(1);
	td.setMonth(vals[1]-1);
	if(vals[2].charAt(0)=='0') vals[2] = vals[2].charAt(1);
	td.setDate(vals[2]);
	td.setHours(0);
	td.setMinutes(0);
	td.setMilliseconds(0);
	return td;
}
/**
 * 请求一段javascript脚本
 * @param {String} url 地址
 * @param {String} charset 编码
 * @param {Object} params json map形式的参数表
 * @param {Object} callback 请求成功后回调方法，会传入请求的变量
 */
xl.getScript = function(url,charset,params,callback){
	scriptBlock = document.createElement("script");
	scriptBlock.type = "text/javascript";
	if(charset)scriptBlock.charset = charset;
	if(params) scriptBlock.src = url + "?" +xl.param(params);
	else scriptBlock.src = url;
	if(window.navigator.userAgent.indexOf("MSIE")>=1){
		scriptBlock.onreadystatechange = function(){
			if(callback)callback();
		}
	}else{
		scriptBlock.onload = function(){
			if(callback)callback();
		}
	}
	document.getElementsByTagName("head")[0].appendChild(scriptBlock);
};
/**
 * 加载图片，用来实现图片预加载
 * @param {String} url 图片路径
 * @param {Function} callback 成功后回调，传入第一个参数为预加载的图片对象
 */
xl.loadImage = function(url, callback) {
    var img = new Image(); //创建一个Image对象，实现图片的预下载
    img.src = url;
	if(callback && typeof(callback) == 'function'){
		if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
			callback(img);
			return; // 直接返回，不用再处理onload事件
		}
		img.onload = function () { //图片下载完毕时异步调用callback函数。
			callback(img);//将回调函数的this替换为Image对象
		};
	}
	
};

//util class tools
/**
 * @class 
 * @constructor 
 * @param {String} str 可以接受一个字符串作为参数
 */
xl.StringBuffer = function(str){
	this._string = [];
	if(str) this._string.push(str); 
}
xl.StringBuffer.prototype = {
	/**
	 * 为buffer添加字符串
	 * @function  
	 * @param {String} str
	 * @returns {String} this
	 */
	append : function(str){
		this._string.push(str);
		return this;
	},
	/**
	 * @function
	 * @returns {String} 
	 */
	toString : function(){
		return this._string.join("");
	}
}

//object-oriented 
/**
 * @class 实现类机制
 * @constructor 
 * @param {Object} p 
 */
xl.Class = function(p){
	if(p.initialize) p.initialize();
	for(fn in p){
		if(funName!='initialize'){
			this.prototype[fn] = p[fn];
		}
	}
}
String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/gi,'');
}
String.prototype.lTrim=function(){
	return this.replace(/^\s*/gi,'');
}
String.prototype.rTrim=function(){
	return this.replace(/\s*$/gi,'');
}
String.prototype.Replace=function(oldV,newV){
	return this.replace(eval('/'+oldV.replace(/\\/gi,'\\\\').replace(/(\[|\]|\(|\)|\.|\*|\?)/gi,'\\$1')+'/gi'),newV);
}
String.prototype.isEmpty=function(){
	return (this===undefined || this===null || !this.trim());
}
String.prototype.isNumber=function(){
	return (!isNaN(this) && this!=undefined && this!=null);
}
String.prototype.bytes=function(){
	return this.replace(/[^\x00-\xff]/g, "  ").length;
}

var isFunction = function(a){ return typeof a == "function"; };
var isNull     = function(a){ return typeof a == "object" && !a; };
var isNumber   = function(a){ return typeof a == "number" && isFinite(a);};
var isObject   = function(a){ return (a && typeof a == "object") || isFunction(a);};
var isString   = function(a){ return typeof a == "string";};
var isArray    = function(a){ return isObject(a) && a.constructor == Array; };
var isUndef    = function(a){ return typeof a == "undefined";};
var DoUnchanged= function(a){ return a;}
var DoNothing  = function(){};

var Browser = {
	
};
Browser.isFireFox = (window.navigator.appName == "Netscape");
Browser.isOpera = (window.navigator.userAgent.indexOf("opera") != -1);
Browser.isSaf = ((window.navigator.userAgent.indexOf("applewebkit") != -1) || (navigator.vendor == 'Apple Computer, Inc.'));
Browser.isMSIE = ((window.navigator.userAgent.toLowerCase().indexOf("msie") != -1) && (!Browser.isOpera) && (!Browser.isSaf));
Browser.getNocacheUrl = function(urlstr){
	var retUrl = "http://xiaozu.xunlei.com";
	var cachetime = new Date().getTime();
	var index = urlstr.indexOf("cachetime=");
	var param = urlstr.indexOf("?");
	if(index == -1){
		if(param == -1){
			retUrl = urlstr + "?cachetime=" + cachetime;
		}else{
			retUrl = urlstr + "&cachetime=" + cachetime;
		}
		
	}else{
		if(param == -1){
			retUrl = urlstr.substring(0,index) + "?cachetime=" + cachetime;
		}else{
			//无&
			retUrl = urlstr.substring(0,index) + "cachetime=" + cachetime;
		}
	}
	return retUrl;
};
Browser.refreshPage = function(url){
	url = url || top.location.href;
	top.location.href = Browser.getNocacheUrl(url);
};
Browser.getUrlParam = function(URL,name){
   var reg = new RegExp("(^|[&?])"+ name +"=([^&]*)(&|$)","i");
   var r = URL.match(reg);
   if (r!=null) {
    return r[2]; 
   }
   return null;
}
Browser.openpage = function(page){
	window.open(Browser.getNocacheUrl(page));
};
Browser.redirectpage = function(page){
	top.location.href = Browser.getNocacheUrl(page);
};
Browser.sendHttpPack = function(scripturl){
	var ifr=document.createElement("script");
	ifr.src=scripturl;
	if(ifr.attachEvent) {
	    ifr.attachEvent('onload',function (){});
	} else {
	    ifr.addEventListener('onload',function (){}, false);
	}
};
Browser.loadDynamicContent = function(url){
	var ifr=document.createElement('iframe');
   	document.body.appendChild(ifr);
   	ifr.id="result_frm";
   	ifr.style.visibility="hidden";
   	ifr.width="0";
   	ifr.height="0";
   	ifr.src=url;	
   	if(ifr.attachEvent) {
		ifr.attachEvent('onload',function (){
			document.body.removeChild(ifr);
		});		    
	} else {
		ifr.addEventListener('onload',function (){
    			document.body.removeChild(ifr);
    		}, false);
	}
};


xl.getRequest = function(){
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if(url.indexOf("?") != -1)
	{ 
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++)
		{ 
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
};