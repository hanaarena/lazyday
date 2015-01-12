var placeholder = { 
	add: function (el) { 
		if (!('placeholder' in document.createElement('input'))) { 
			var self = placeholder; 
			el.each(function () {
				var e = $(this); 
				if (!e.val() || e.val() == e.attr('placeholder')) { 
					e.val(e.attr('placeholder')); 
					e.css('color', 'gray'); 
				} 
				else { 
					e.css('color', 'black'); 
				} 
			}); 
			el.bind('focus', self._onfocus); 
			el.bind('click', self._onfocus); 
			el.bind('blur', self._onblur); 
			el.bind('keyup', self._onkeyup); 
		} 
	}, 
	remove: function (el) { 
		if (!('placeholder' in document.createElement('input'))) { 
			var self = placeholder; 
			el.unbind('focus', self._onfocus); 
			el.unbind('click', self._onfocus); 
			el.unbind('blur', self._onblur); 
		} 
	}, 
	check: function (el) { 
		if (!('placeholder' in document.createElement('input'))) { 
			el.each(function () { 
				var tar = $(this); 
				if (!(tar.val())) { 
					tar.val(tar.attr('placeholder')); 
				} 
			}); 
		} 
	}, 
	clear: function () { 
		if (!('placeholder' in document.createElement('input'))) { 
			$('input[type="text"]').each(function () { 
				var el = $(this); 
				if (el.val() == el.attr('placeholder')) { 
					el.val(''); 
				} 
			}); 
			$('textarea').each(function (el) { 
				if (el.value() == el.attr('placeholder')) { 
					el.value(''); 
				} 
			}); 
		} 
	}, 
	_onfocus: function () { 
		if ($(this).val() == $(this).attr('placeholder')) 
			$(this).val(''); 
	}, 
	_onblur: function () { 
		if (!($(this).val()) || $(this).val() == $(this).attr('placeholder')) { 
			$(this).val($(this).attr('placeholder')); 
			$(this).css('color', 'gray'); 
		} 
		else { 
			$(this).css('color', 'black'); 
		} 
	}, 
	_onkeyup: function () { 
		if (!($(this).val())) { 
			$(this).css('color', 'gray'); 
		} 
		else { 
			$(this).css('color', 'black'); 
		} 
	} 
}; 

function print(text){
	window.console && console.log(window.dispatchEvent ? text : text + "");
}

jQuery.extend( jQuery.easing, {
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	}
});

$(document).ready(function(){
	$(".main-nav-son").hide();			   
	$(".main-nav li").hover(function(){
			$(this).children(".main-nav-son").show();
			$(this).children(".icon").toggleClass('icon-up');
		},function(){
			$(this).find(".main-nav-son").hide();
			$(this).children(".icon").toggleClass('icon-up');
		}
	);
	$(".account-nav-item-link").click(function(){
		var son = $(this).next(".account-nav-son");
		$(".nav-icon").removeClass("list");
		if(son.is(":hidden")){
			$(".account-nav-son").slideUp(300);
			$(this).children('.nav-icon').addClass('list');
			son.slideDown(300);			
		}
		else{
			$(".account-nav-son").slideUp(300);
		}			
	})
	$(".account-tab-item").click(function(){
		index = $(".account-tab-item").index($(this));	
		$(".account-tab-content").hide().eq(index).show();
		$(".account-tab-item").removeClass("current").find("a").removeClass("current");
		$(this).addClass("current").find("a").addClass("current");
	})
	$(".tips").hover(function(){
		$(this).next(".tips-shadow").show();						  
	},function(){
		$(this).next(".tips-shadow").hide();			
	})

	var id = setInterval(function() {
		var iframeContent = $(".server-center iframe").contents();
		var div = iframeContent.find("#launchBtn");
		if($(div).html() != null) {
			$(".server-center iframe").css({"width":"89px","height":"95px"});
			$(div).removeClass("bg").css({"background-image":"url(/static/img/icon/service-1.png)","width":"89px", "height":"95px"});
			$(div).hover(function(){
				$(div).css({"background-image":"url(/static/img/icon/service-2.png)"});
			}, function(){
				$(div).css({"background-image":"url(/static/img/icon/service-1.png)"});
			});
			$(div).click(function(){
				$(div).css({"background-image":"url(/static/img/icon/service-1.png)"});
			});
			$(".server-center").show();
			clearInterval(id);
		}
	}, 1);

	$(".pf01").hover(function(){
        $("#onlineser").show().animate({opacity: "1", marginLeft: "+=25"},400,'easeOutQuart');
    },function(){
        $("#onlineser").animate({opacity: "0", marginLeft: "-=25"},400,'easeOutQuart');
    });

	$(".pf02").hover(function(){
        $("#qqweisp").show();
    },function(){
        $("#qqweisp").hide();
    });

    $(".pf03").hover(function(){
        $("#totop").show().animate({opacity: "1", marginLeft: "+=25"},400,'easeOutQuart');
    },function(){
        $("#totop").animate({opacity: "0", marginLeft: "-=25"},400,'easeOutQuart');
    });

    $(".pf03").click(function(){
    	$(document).scrollTop(0);
    })

    $(".pf03").hide();
	$(window).scroll(function(){ 
      	var hidtop=$(document).scrollTop(); 
      	$(".pf03").toggle(hidtop!=0);	             
    });

	var intervalID = setInterval(function(){
    	var launchBtn = $("iframe").contents().find("#launchBtn");
    	if(launchBtn.length>0){
    		launchBtn.hide();
    		clearInterval(intervalID);
    	}
    },1);
    $(".qqser,.qqser02").click(function(){
      $("iframe").contents().find("#launchBtn").click();
    })

	setInterval(function(){
		$(".app-icon").addClass("shake");
		setTimeout(function(){
			$(".app-icon").removeClass("shake");
		},1500);
	},5000);


	$("input").live("keydown", function(e){
		if(e.keyCode==40 || e.which==40 || e.keyCode==13 || e.which==13){ 
			$("input").eq($("input").index($(this))+1).select();
		}
		if(e.keyCode==38 || e.keyCode==38){
			$("input").eq($("input").index($(this))-1).select();
		}
	});

	$("input").live("focus", function(){$(this).select()});

	$("body").keydown(function(e){
		if(e.keyCode==27 || e.which==27){
			$('#locked .span').trigger("click");
			return; 
		}
	});

	// 自动展开关于我们的栏目
    var path = location.pathname;
    $(".page-one-nav li").each(function(){
    	if($(this).attr("id")){
	    	var str = $(this).attr("id").replace("about-sidebar-", "");
	        if(path.indexOf(str)>-1){
	            $(this).children('a').addClass("current").parent().addClass("current").siblings().removeClass("current");
	        }
    	}
    });

    print("====================================================================\n");
	print(" 当你看到这行字的时候，改变互联网的机会就来了\n");
	print(" 也许你追求极致、挑战经典\n");
	print(" 也许你怀抱梦想、数次征战\n");
	print(" 也许你专注执着、力求完美\n");
	print(" 都是浮云\n");
	print(" 若你熟悉 前端/JAVA/Android/IOS开发\n");
	print(" 速发简历至 wanghu@touna.cn \n");
	print(" 挑战自己，迈开新篇\n");
	print(" 标题务必注明暗号：来自console的技术大拿 \n");
	print("=======================================================================================\n");
});


//是否登录，切换右上角登录按钮
function islogin($data,$username){
	if($data){
		$("#user-name").html($username);
		$("#top-reg").hide();
		$("#top-link").show();	
	}else{
		$("#top-reg").show();
	}
}
//获取cookies
function getCookie(objname){
	var arrstr = document.cookie.split("; ");
	for(var i = 0;i < arrstr.length;i ++)
	{
		var temp = arrstr[i].split("=");
		if(temp[0] == objname) return decodeURIComponent(temp[1]);
	}
	return null;
}
//根据siteid返回列表页地址
function getNewList(site){
	var html = ''
	
	if(site==22){
		html = "/notice.html";	
	}else if(site == 104){
		html = "/news.html";
	}else if(site == 67){
		html = "/media.html";
	}else{
		html = "#";	
	}
	return html;
}

function addBookmark(){
    var title = document.title;
    var URL = document.URL;

    try {
        window.external.addFavorite(URL, title);          //ie
    } catch(e) {
        try {
              window.sidebar.addPanel(title, URL, "");     //firefox
        } catch(e) {
              alert("该浏览器不支持，请使用Ctrl+D进行添加");     //chrome opera safari
        }
    }
} 

