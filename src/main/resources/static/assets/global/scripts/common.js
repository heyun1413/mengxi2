function maimDownloadFile(ctx,obj){
    var objcode = encodeURIComponent(encodeURIComponent(obj));
    $.post(ctx+"/uploadFile/downloadCheck", {
        "filePath": obj
    }, function (res) {
        if(res.isexists=="0"){
            window.location.href = ctx+"/uploadFile/download?filePath="+objcode;
        }else{
            top.$.jBox.prompt("文件不存在",
                '温馨提示',
                'error',{ closed: function () {}
                });
        }
    }, "json");
}