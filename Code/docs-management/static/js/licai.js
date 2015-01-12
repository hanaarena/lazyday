'use strict'

var userAgent = window.navigator.userAgent;
var broswerType = '';

var fileUrl = '';
var filecoverUrl = '';
var fileinfoType = '';

//typeof broswer
if(userAgent.indexOf('MSIE 7') >= 1 || userAgent.indexOf('MSIE 8') >= 1) {
    broswerType = 'LOW_IE_8';
    console.log(broswerType);
}

if(userAgent.indexOf('MSIE 9') >= 1) {
    broswerType = 'LOW_IE_9';
    console.log(broswerType);
} else if (userAgent.indexOf("MSIE") >= 1) {  
    broswerType = 'ie10';
} else if(userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("rv") > -1) {
    broswerType = 'ie11';
} else if(userAgent.indexOf("Firefox") >= 1) {  
    broswerType = 'ff';  
} else if(userAgent.indexOf("Chrome") >= 1) {  
    broswerType = 'chrome';  
}

(function() {

    $('.fileinfo-success').hide();
    
    var bar = $('.bar');
    var percent = $('.percent');

    /* get file type index */
    fileinfoType = $("#typeSelect").get(0).selectedIndex+1;
    console.log("file type: " + fileinfoType);
       
    /* 资料主体上传 ->return url */
    $('#fileupload').ajaxForm({
        url: "/bbsfinancingFileUpLoad.do?dir=file",
        dataType: 'text',
        beforeSend: function() {
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
            console.log(percentVal, position, total);
        },
        success: function() {
            var percentVal = '100%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        complete: function(xhr) {
            /* is login -> get file url */
            console.log("file Url: " + xhr.responseText);
            
            var data = JSON.parse(xhr.responseText);
            fileUrl = data.url
            console.log(fileUrl);

            if($('.loading')) {
                $('.loading').remove();
            }

            if (broswerType == 'ie10') {  
                $('.fileCtrl').html('').html('<li class="f30 fRight mr20 re-upload">返回上一步</li>').appendTo('.fileinfo-ctrl');
            } else {
                $('.fileCtrl').html('').html('<a href="javascript:void(0);" class="upbtnCommand f30 fRight mr20" onClick="reset();">返回上一步</a>').appendTo('.fileinfo-ctrl');
            }

            $('.progress').hide();
            //show upload file detail editor
            $('.up-info-append').css('display', 'block');
            $('.up-info').removeClass('h100').css({'text-align':'center', 'color': '#3399ff', 'margin': '45px'});
            $('.fileMsg').removeClass('mr20').html('<span class="f30">文档已上传完毕！</span><br /><span class="f20 ml20">请完善文档信息后点击\'完成上传\'</span>');            
        },
        error: function(e) {
            alert("上传失败");
            console.log(e);
        }
    });
    
    /* 资料封面上传 ->return url */
    $('#coverupload').ajaxForm({
        url: "/bbsFileUpLoad.do?dir=image",//cover 上传url
        dataType: 'text',
        beforeSend: function() {

        },
        uploadProgress: function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            console.log("fileinfo-cover: " + percentVal, position, total);
        },
        success: function() {
            
        },
        complete: function(xhr) {
            /* get file cover url */
            console.log("fileinfo-cover url: " + xhr.responseText);           

            var data = JSON.parse(xhr.responseText);
            filecoverUrl = data.url;
            console.log(filecoverUrl);

            alert("上传成功");

            /* display re-select */
            $('.fileinfo-cover-reselect').show();
            $('.fileinfo-cover-upbtnarea').hide();
        },
        error: function(e) {
            alert("上传失败");
            console.log(e);
        }
    });

    /* 资料整体上传 */
    // code..

    /* 反馈 img ->return url */
     $('#sugupload').ajaxForm({
        url: "",//snapshot 上传url
        beforeSend: function() {
            
        },
        uploadProgress: function(event, position, total, percentComplete) {          
            console.log(percentVal, position, total);
        },
        success: function() {
            
        },
        complete: function(xhr) {
            console.log(xhr.responseText);
        },
        error: function(e) {
            alert("上传失败");
            console.log(e);
        }
    }); 
})();

rxdai.fileUp = {};

rxdai.fileUp.upload = function() {
    var title = $('.fileinfo-title').val(),
        content = $('.fileinfo-desc').val(),
        source = $('.fileinfo-from').val(),
        author = $('.fileinfo-author').val(),
        labels = $('.fileinfo-tag').val();
    
    var params = {
        'method': 'addFinanc', 
        'title': title, 
        'content': content,
        'litPic': filecoverUrl,
        'localPath': fileUrl,
        'classify': fileinfoType,
        'source': source,
        'author': author,
        'labels': labels
    };

    rxdai.postLoadData(____licai____, params, 
        function(data) {
            //console.log(data);
            $('.fileinfo-pre').hide();
            $('.fileinfo-success').show();
        },
        function(data) {
            rxdai.doFailed(data);
    });
}

//unbind onbeforeunload event
function unbindBeforeLoad() {
    window.onbeforeunload = function() {};
}

/* when its IE8/7 listening the reupload operation when click */
$('.re-upload').live('click', function() {
    var file = $(".fileupload");
    file.after(file.clone().val(""));
    file.remove();

    $('.up-btn').show();
    $('.progress').appendTo('.up-btn-area').hide();
    $('.up-info').remove();

    $('.up-info-append').css('display', 'none');

    if($('.fileinfo-ctrl')) {
        $('.fileinfo-ctrl').html('');
    }

    unbindBeforeLoad();
});

$('.fileinfo-cover-reselect').live('click', function() {
    var file = $(".fileinfo-cover-filebtn");
    file.after(file.clone().val(""));
    file.remove();

    $('.fileinfo-cover-name').val('');
    $('.fileinfo-cover-reselect').hide();

    unbindBeforeLoad();
});

/* get doc/resource type index */
$('#typeSelect').live('change', function() {
    fileinfoType = $("#typeSelect").get(0).selectedIndex+1;
    console.log("file type: " + fileinfoType);
});

/* suggestion dialog control */
$('.showDialogs').live('click', function() {
    if(userAgent.indexOf('MSIE 7') >= 1 || userAgent.indexOf('MSIE 8') >= 1) {
        $('.dialogs').css({'top': '25%', 'left': '30%'});
    }
    $('.dialogs').show();
    $('.dialogs-shadow').show();
});

$('.sug-close').live('click', function() {
    $('.dialogs').hide();
    $('.dialogs-shadow').hide();
});

/* show loading animate instead uploadProgress if IE<10 */
function loading(){
    $('<div class="loading txtC pt30"><img style="width:200px;" src="static/img/pic/loading.gif" /></div>').appendTo('.up-btn-area');
    console.log("loading");
}

function check() {
    if($('.fileinfo-title').val() == '') {
        alert('标题不能为空');
        $('.fileinfo-title').focus();
        return false;
    } else if($('.fileinfo-from').val() == '') {
        alert('出处不能为空');
        $('.fileinfo-from').focus();
        return false;
    } else if($('.fileinfo-author').val() == '') {
        alert('作者不能为空');
        $('.fileinfo-author').focus();
        return false;
    } else if($('.fileinfo-cover-name').val() == '') {
        alert('封面不能为空');
    } else {
        return true
    }
}

/* when file input onchange */
function postFile(obj) {
    try {           
        if(obj !== null || obj !== '') {
            /*var userAgent = window.navigator.userAgent;
            var broswerType = '';*/

            var isAllow = false;
            var maxsize = 100*1024*1024; //2Mb
            
            var pos = obj.value.lastIndexOf('\\');
            var type = new Array('.doc', '.docx', '.pdf', '.ppt', '.txt', '.xls', '.xlsx');
            //print file name n type
            var fileName = obj.value.substring(pos + 1);
            var fileType = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
            //- del-> lvar fileType = obj.value.replace(/.+./, '');

            if(broswerType == 'ff' || broswerType == 'chrome') {
                var totalsize = obj.files[0].size;
            } else if (broswerType == 'ie10' || broswerType == 'LOW_IE_8' || broswerType == 'LOW_IE_9') {
                var totalsize = 0;
                var obj_img = document.getElementById('tempimg');  
                obj_img.DYNSRC = obj.value;  
                totalsize = obj_img.fileSize;
                alert('I am ie < 11');
            } else if(broswerType == 'ie11') {
                var totalsize = obj.files[0].size;
                alert('I am ie11');
            } else {
                alert("error");
            }

            //whether type in allow array
            for(var i = 0; i < type.length; i++) {
                if(fileType == type[i]) {
                    isAllow = true;
                    break;
                } else {
                    isAllow = false;
                }
            }

            if(isAllow) {
                if(totalsize < maxsize) {
                    if($('.file-next')) {
                        $('.file-pre').hide();
                        $('.file-next').show();
                        $('.update-file-name').html(fileName);
                    }

                    //hide upload btn
                    $('.up-btn').hide();
                    $('.fileinfo-success .up-btn').show();
                    //update upload area dom                 
                    $('.up-btn-area')
                        .append('<div class="up-info h100" style="height: auto;"><span class="fileMsg ml20 mr20">'+ fileName +'</span><span class="fileCtrl"><a href="javascript:void(0);" onClick="reset();">重新选择</a><a class="ml10"><input class="fileupload-submit-btn" type="submit" name="submit" onClick="showProgress();" value="确定上传"></a></span></div>');
                    //bug->点击'重新选择'显示上传按钮，但此时仍会绑定此事件 -- fixed->reset()中解绑该事件
                    window.onbeforeunload = function(e) {
                        var msg='重新加载将导致文件信息丢失';
                        e = e || window.event;
                        e.returnValue = msg;
                        //e.stopPropagation();
                        return msg;
                    };
                    console.log(fileName + ", " + fileType);
                } else if(totalsize >= maxsize) {
                    alert("文件过大");
                } else if(totalsize == -1) {
                    return false;
                }   
            } else if(!isAllow) {
                alert("文件格式不支持，请重新选择");
                //clear file field
                if($(".fileupload")) {
                    var file = $(".fileupload");
                }
                
                if($('.update-file-filebtn')) {
                    var file = $('.update-file-filebtn');
                }
                file.after(file.clone().val(""));
                file.remove();
            }        
        } else {
            return false;
        }
    } catch(e) {
        console.log(e);
    }
}

function postCover(obj) {
    try {
        if(obj !== null || obj !== '') {
            var isAllow = false;
            var maxsize = 100*1024*1024; //1Mb
            
            var pos = obj.value.lastIndexOf('\\');
            var type = new Array('.png', '.jpg', '.jpeg');
            //print file name n type
            var fileName = obj.value.substring(pos + 1);
            var fileType = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

            if(broswerType == 'ff' || broswerType == 'chrome') {
                var totalsize = obj.files[0].size;
            } else if (broswerType == 'ie10' || broswerType == 'LOW_IE_8' || broswerType == 'LOW_IE_9') {
                var totalsize = 0;
                var obj_img = document.getElementById('tempimg');  
                obj_img.DYNSRC = obj.value;  
                totalsize = obj_img.fileSize;
                alert('I am ie < 11');
            } else if(broswerType == 'ie11') {
                var totalsize = obj.files[0].size;
                alert('I am ie11');
            } else {
                alert("error");
            }

            //whether type in allow array
            for(var i = 0; i < type.length; i++) {
                if(fileType == type[i]) {
                    isAllow = true;
                    break;
                } else {
                    isAllow = false;
                }
            }

            if(isAllow) {
                if(totalsize < maxsize) {
                    if($('.fileinfo-cover-name')) {
                        $('.fileinfo-cover-name').val(fileName);
                    } 
                    if($('.update-cover-name')) {
                        $('.update-cover-name').html(fileName);
                    }

                    if($('.cover-next')) {
                        $('.cover-pre').hide();
                        $('.cover-next').show();
                        $('.update-cover-name').html(fileName);
                    }

                    $('.fileinfo-cover-upbtnarea').show();

                    window.onbeforeunload = function(e) {
                        var msg='重新加载将导致文件信息丢失';
                        e = e || window.event;
                        e.returnValue = msg;
                        //e.stopPropagation();
                        return msg;
                    };
                    console.log(fileName + ", " + fileType);
                } else if(totalsize >= maxsize) {
                    alert("文件过大");
                } else if(totalsize == -1) {
                    return false;
                }
            } else if(!isAllow) {
                alert("文件格式不支持，请重新选择");
                //clear file field
                if($(".fileinfo-cover-filebtn")) {
                    var file = $(".fileinfo-cover-filebtn");
                }
                if($('.update-cover-filebtn')) {
                    var file = $('.update-cover-filebtn');
                }
                file.after(file.clone().val(""));
                file.remove();
            }
        } else {
            return false;
        }       
    } catch(e) {
        console.log(e);
    }
}

function reset() {
    //clear file field
    var file = $(".fileupload");
    file.after(file.clone().val(""));
    file.remove();

    $('.up-btn').show();
    $('.progress').appendTo('.up-btn-area').hide();
    $('.up-info').remove();

    if($('.fileinfo-ctrl')) {
        $('.fileinfo-ctrl').html('');
    }

    /*$('.up-btn-area').html('').append('<div class="up-btn"><img id="tempimg" dynsrc="" src="" style="display:none" /><span style="text-align: center"><p>Upload</p></span><input id="fileupload" type="file" name="file" multiple onChange="getInfo(this);"></div>');*/

    $('.up-info-append').css('display', 'none');

    unbindBeforeLoad();
}

function reset2() {
    //clear file field
    var file = $(".fileinfo-cover-filebtn");
    file.after(file.clone().val(""));
    file.remove();

    $('.fileinfo-cover-name').val('');
    $('.fileinfo-cover-reselect').hide();

}

function showProgress() {
    if(userAgent.indexOf('MSIE 7') >= 1 ||userAgent.indexOf('MSIE 8') >= 1) {
        loading();
        console.log("works1");
    } else if (broswerType == 'LOW_IE_9') {
        loading();
        console.log("works2");
    } else {
        $('.progress').appendTo('.up-info').show();
        console.log("works3");
    }
}

//submit the resource file
$('.fileinfo-sub').click(function() {
    if(check()) {            
        rxdai.fileUp.upload();
    }
});

$('.sug-submit-btn').click(function() {
    /*$.ajax({

    });*/
});