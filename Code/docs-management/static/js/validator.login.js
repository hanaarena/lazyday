'use strict'

;var f1 = $('.f1'),
     f2 = $('.f2'),
     sub = $('.sub');

    rxdai.bbsAuth = {};

/* clear alert message */
f1.bind('click', function() {
    $('.licai-login-form:first li:first-child').html('');
});

f2.bind('focus', function() {
    $('.licai-login-form:first li:first-child').html('');
});

/* f2 on foucs */
f2.focus(function() {
    var reg = /[a-zA-Z0-9_-]{5,16}/g;
    if ( f1.val() == '' ) {
        f1.css('background-color', '#fee').focus();
        validFailed(' 用户名不能为空');
        setTimeout(function() {
            f1.css("background-color", "");
        }, 1300);
    } else if( reg.exec(f1.val()) == null ) {
        f1.css('background-color', '#fee').focus();
        validFailed(' 用户名长度不正确');
        setTimeout(function() {
            f1.css("background-color", "");
        }, 1300);
    }
});

/* submit */
sub.click(function() {
    $('.licai-login-form:first li:first-child').html('');
    if (f1.val() == '') {
        f2.focus();
    } else if (f2.val() == '') {
        f2.css('background-color', '#fee').focus();
        validFailed(' 密码不能为空');
        setTimeout(function() {
            f2.css("background-color", "");
        }, 1000);
    } else {
        sub.html('')
            .css('background-color', "#fff")
            .append($('<img/>')
                .attr({
                    src: 'https://www.touna.cn/static/img/pic/loading.gif',
                    width: 55
                })
            );
        rxdai.bbsAuth.login();
    }
});

$(document).keydown(function(e) {
    if(e.keyCode == 13){  
        sub.click();
        return false;
    };
});

rxdai.bbsAuth.login = function() {
    var uname = $.trim(xl('username').value),
        upwd = $.trim(xl('upw').value);
    var md5Pwd = $.md5(upwd);

    var param = {
        'method': 'login',
        username: uname,
        //username: 'zhangyu', 
        md5Pwd: md5Pwd
        //md5Pwd: '9d2bb8dade87d37301723be1a80027a4'
    };

    rxdai.postLoadData(____bbsLogin____, param, function(data) {
        rxdai.bbsAuth.loginOk(data)
    }, function(data) {
        rxdai.bbsAuth.loginFailed(data)
        window.location = "/admin-html/login.html";
    });
}

rxdai.bbsAuth.loginOk = function(data) {
    //xl('btn_login').disabled = false;
    var result = data.result;
    if( result.adminType == 1 ) {
        window.location = "/admin-html/main.html#/";
    } else if ( result.adminType !== 1 ) {
        window.location = "http://172.168.20.247:14803/user-login.html";
    } else {
        window.location = "http://172.168.20.247:14803/user-login.html";
    }
}

rxdai.bbsAuth.loginFailed = function(data) {
    var desc = data.desc;
    rxdai.alert(desc);
}

function validFailed(msg) {
    $('.licai-login-form:first li:first-child')
        .append($('<div></div>')
            .attr({
                id: 'failedAlert'
            })
            .addClass('failed')
            .html('<strong>' + msg + '</strong>')
        );
}

function loginRedirect(data) {
    var user = data.result;
    if( user && user.username ) {
        if( user.adminType == 1 ) {
            window.location = "/admin-html/main.html#/";
        }
    } 
}

$(function() {
    $('#top-reg').html('').hide();

    //if is login
    //rxdai.bbs_isLogin(loginRedirect);

    var userAgent = window.navigator.userAgent;
    console.log(userAgent+'1');

    if (userAgent.indexOf("MSIE 8.0") >= 1){  
        console.log(userAgent+'2');

        $('.licai-login-form').css({'position': 'static', 'margin-top': '100px'});
    }
});