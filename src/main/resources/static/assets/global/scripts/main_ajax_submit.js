function AjaxSubmit(options){
    var defualt = {
        url:"",
        return_url:"",
        data:"",
        btnSubmit:""
    }
    this.options =$.extend(defualt,options);
}

AjaxSubmit.prototype.postSubmit = function(){
    var self = this;
    var btnSubmit = self.options.btnSubmit;
    var btn = null;
    if(btnSubmit!=""){
        btn = $("#"+btnSubmit);
        $(btn).val("正在提交……").attr("disabled","disabled");
    }
    //$.blockUI({ message: '正在处理中......' });
    var boxid = top.$(".jbox-body").attr("id");
    top.$("#"+boxid).remove();
    setTimeout(function(){
        $.ajax({
            url:self.options.url,
            type:'post',
            async: false,
            dataType:'json',
            data:self.options.data,
            success:function(res){
                if (res.code == "0") {
                    $.unblockUI();
                    top.$.jBox.prompt(res.msg,
                        '温馨提示',
                        'success',{ closed: function () {
                            window.location.href = self.options.return_url;
                        }
                    });
                }else{
                    $.unblockUI();
                    top.$.jBox.prompt(res.msg,
                        '温馨提示',
                        'error',{ closed: function () {
                            if(btn){
                                $(btn).val("保存")
                                $(btn).removeAttr("disabled");
                            }
                        }
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                top.$.jBox.prompt("HTTP "+XMLHttpRequest.status+" 请求错误",
                    '温馨提示',
                    'error',{ closed: function () {
                        if(btn){
                            $(btn).val("保存")
                            $(btn).removeAttr("disabled");
                        }
                        $.unblockUI();
                    }
                });
            }
        });
    },2000);
}


AjaxSubmit.prototype.getSubmit = function(){
    var self = this;
    var btnSubmit = self.options.btnSubmit;
    var btn = null;
    if(btnSubmit!=""){
        btn = $("#"+btnSubmit);
        $(btn).val("正在提交……").attr("disabled","disabled");
    }
    $.blockUI({ message: '正在处理中......' });
    var boxid = top.$(".jbox-body").attr("id");
    top.$("#"+boxid).remove();
    setTimeout(function(){
        $.ajax({
            url:self.options.url,
            type:'get',
            async: false,
            dataType:'json',
            data:self.options.data,
            success:function(res){
                if (res.code == "0") {
                    top.$.jBox.prompt(res.msg,
                        '温馨提示',
                        'success',{ closed: function () {
                            window.location.href = self.options.return_url;
                        }
                        });
                }else{
                    top.$.jBox.prompt(res.msg,
                        '温馨提示',
                        'error',{ closed: function () {
                            if(btn){
                                $(btn).val("保存")
                                $(btn).removeAttr("disabled");
                            }
                            $.unblockUI();
                        }
                        });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                top.$.jBox.prompt("HTTP "+XMLHttpRequest.status+" 请求错误",
                    '温馨提示',
                    'error',{ closed: function () {
                        if(btn){
                            $(btn).val("保存")
                            $(btn).removeAttr("disabled");
                        }
                        $.unblockUI();
                    }
                    });
            }
        });
    },2000);
}