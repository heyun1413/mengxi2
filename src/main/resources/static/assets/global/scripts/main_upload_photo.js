function MainUploadPhoto(options){
    var defualt = {
        uploadId:"",
        name:"",
        extensions:"gif,jpg,jpeg,bmp,png",
        mimeTypes:"image/jpg,image/jpeg,image/png",
        fileSingleSizeLimit:10,
        fileNumLimit:10,
        input:"",
        value:"",
        ctxStatic:"",
        ctx:""
    }
    this.options =$.extend(defualt,options);
}

//初始化上传控件
MainUploadPhoto.prototype.initUploadPhoto = function(){
    var self = this;
    var $fileNumLimit = self.options.fileNumLimit;
    if($fileNumLimit!="" && parseInt($fileNumLimit)>0){
        var uploadId = self.options.uploadId;
        var uploadOpts = {
            name:self.options.name,
            fileNumLimit:self.options.fileNumLimit,
            extensions:self.options.extensions,
            mimeTypes:self.options.mimeTypes,
            fileSingleSizeLimit:self.options.fileSingleSizeLimit
        }
        self.multipleMultiUploadPhoto(uploadId,uploadOpts);
    }else{
        var uploadId = self.options.uploadId;
        var uploadOpts = {
            name:self.options.name,
            extensions:self.options.extensions,
            mimeTypes:self.options.mimeTypes,
            fileSingleSizeLimit:self.options.fileSingleSizeLimit
        }
        self.singleMultiUploadPhoto(uploadId,uploadOpts);
    }
}

MainUploadPhoto.prototype.initShowPhoto = function(){
    var self = this;
    var fileName = self.options.value;
    var input = self.options.input;
    var ctx = self.options.ctx;
    var isDel = self.options.isDel;
    var fileNumLimit = self.options.fileNumLimit;
    var fileNames = fileName.split(',');
    var $div_list = $("#uploader-list_"+input);
    if(isDel==""){
        isDel = "0";
    }
    for(var i=0;i<fileNames.length;i++) {
        var file0 = fileNames[i];
        if(file0!=""){
            if(file0.indexOf('/')!=0){
                file0 = "/"+file0;
            }
            var template = "";
            if(isDel=="0"){
                template = self.getUploadPhotoTemplateShow();
                $div_list.append(template.replace(new RegExp("#{imgId}", "g"), file0));
            }else{
                var lastName = file0.substring(file0.lastIndexOf('/')+1);
                template = self.getUploadPhotoDelTemplate(input,lastName,file0,file0,fileNumLimit,i);
                $div_list.append(template);
            }
        }
    }
}

//单图片上传
MainUploadPhoto.prototype.singleMultiUploadPhoto = function(id,uploadOpts){
    var self = this;
    var ctxStatic = self.options.ctxStatic;
    var ctx = self.options.ctx
    var input = self.options.input;
    (function (uploadId,uploadOpts) {
        var fileNumLimit = uploadOpts.fileNumLimit;
        var extensions = uploadOpts.extensions;
        var mimeTypes = uploadOpts.mimeTypes;
        var fileSingleSizeLimit = uploadOpts.fileSingleSizeLimit;
        var htmlId = '#' + uploadId;
        var uploader = WebUploader.create({
            auto: true,
            threads: 1,
            swf: ctxStatic+'/assets/webuploader-0.1.5/Uploader.swf',
            server: ctx+'/uploadFile/commonUpload',
            pick: {
                id: htmlId,
                multiple: true,
                label: ''
            },
            accept: {
                title: '图片',
                extensions: extensions,
                mimeTypes: mimeTypes
            },
            duplicate :true,
            resize : false,
            fileSingleSizeLimit: fileSingleSizeLimit * 1024 * 1024
        });

        var $div_list = $("#uploader-list_"+input);
        var fileIdName = uploadOpts.name;
        uploader.onUploadSuccess = function(file, res){
            var path = res.previewImgUrl;
            if(path.indexOf('/')!=0){
                path = "/"+path;
            }
            var img_template = self.getUploadPhotoTemplate(input,res.name,path,path);
            $div_list.html(img_template);
            $div_list.find('.mt-overlay a').click(function () {
                uploader.removeFile(uploader.getFile(file.id));
                $(this).parent().parent().parent().remove();
                $("#uploader-list_"+input).append('<input type="hidden" name="'+input+'" value="">');
            });
        },
        uploader.on("error", function (code) {
            return self.errorPrompt(code,fileNumLimit,fileSizeLimit,fileSingleSizeLimit);
        });
    })(id,uploadOpts);
}

//多图片上传
MainUploadPhoto.prototype.multipleMultiUploadPhoto = function(id,uploadOpts){
    var self = this;
    var ctxStatic = self.options.ctxStatic;
    var ctx = self.options.ctx;
    var input = self.options.input;
    (function (uploadId,uploadOpts) {
        var fileNumLimit = uploadOpts.fileNumLimit;
        var extensions = uploadOpts.extensions;
        var mimeTypes = uploadOpts.mimeTypes;
        var fileSingleSizeLimit = uploadOpts.fileSingleSizeLimit;
        var htmlId = '#' + uploadId;
        var uploader = WebUploader.create({
            auto: true,
            threads: 1,
            swf: ctxStatic+'/assets/webuploader-0.1.5/Uploader.swf',
            server: ctx + '/uploadFile/commonUpload',
            pick: {
                id: htmlId,
                multiple: true,
                label: ''
            },
            accept: {
                title: '图片',
                extensions: extensions,
                mimeTypes: mimeTypes
            },
            duplicate :true,
            resize : false,
            fileSingleSizeLimit: fileSingleSizeLimit * 1024 * 1024
        });

        var $div_list = $("#uploader-list_"+input);
        var fileIdName = uploadOpts.name;
        uploader.onUploadSuccess = function(file, res){
            if($("input[name='"+fileIdName+"']").length>=fileNumLimit){
                var content = '上传文件数不能超过'+fileNumLimit+'个！';
                top.$.jBox.prompt(content,
                    '温馨提示',
                    'error',{ closed: function () {}
                });
                return;
            }
            var path = res.previewImgUrl;
            if(path.indexOf('/')!=0){
                path = "/"+path;
            }
            var img_template = self.getUploadPhotoTemplate(input,res.name,path,path);
            var len = $("#uploader-list_"+input).find(".biaoji").length;
            if(len>0){
                $("#uploader-list_"+input).find(".biaoji").remove();
            }
            $div_list.append(img_template);

            $div_list.find('.mt-overlay a').click(function () {
                uploader.removeFile(uploader.getFile(file.id));
                $(this).parent().parent().parent().remove();
                var len = $("#uploader-list_"+input).find(".mt-element-overlay").length;
                if(len==0){
                    $("#uploader-list_"+input).html('<input class="biaoji" type="hidden" name="'+input+'" value="">');
                }
            });
        },
        uploader.on("error", function (code) {
            return self.errorPrompt(code,fileNumLimit,fileSizeLimit,fileSingleSizeLimit);
        });
    })(id,uploadOpts);
}

MainUploadPhoto.prototype.getUploadPhotoTemplate = function(input,name,path,basePath){
    var img_template = '<div class="img-list mt-element-overlay" style="height:150px;width:200px;margin-top:10px;">\
	                   <div class="mt-overlay-my4" >\
	                        <div>\
	                            <img src="'+basePath+'" class="image-list-img"/>\
	                        </div>\
	                        <div class="mt-overlay" style="width:200px;">\
                                <h2 title="'+name+'">'+name+'</h2>\
	                            <a class="mt-info btn default btn-outline" style="margin: 20px 0 0;" href="javascript: void(0);">删除</a>\
	                        </div>\
	                        <input type="hidden" name="'+input+'" value="'+path+'"/>\
	                    </div>\
	                </div>';
    return img_template;
}

MainUploadPhoto.prototype.getUploadPhotoDelTemplate = function(input,name,path,basePath,fileNumLimit,count){
    var img_template = '<div id="element-overlay-'+count+'" class="img-list mt-element-overlay" style="height:150px;width:200px;margin-top:10px;">\
	                   <div class="mt-overlay-my4" >\
	                        <div>\
	                            <img src="'+basePath+'" class="image-list-img"/>\
	                        </div>\
	                        <div class="mt-overlay" style="width:200px;">\
                                <h2 title="'+name+'">'+name+'</h2>\
	                            <a class="mt-info btn default btn-outline" style="margin: 20px 0 0;" onclick="delPic(\''+input+'\',\'element-overlay\',\''+count+'\',\''+fileNumLimit+'\')" href="javascript:;">删除</a>\
	                        </div>\
	                        <input type="hidden" name="'+input+'" value="'+path+'"/>\
	                    </div>\
	                </div>';
    return img_template;
}

function delPic(input,id,count,fileNumLimit){
    if(fileNumLimit!="" && parseInt(fileNumLimit)>0){
        $("#uploader-list_"+input).find("#"+id+"-"+count).remove();
        var len = $("#uploader-list_"+input).find(".mt-element-overlay").length;
        if(len==0){
            $("#uploader-list_"+input).html('<input class="biaoji" type="hidden" name="'+input+'" value="">');
        }
    }else{
        $("#uploader-list_"+input).find("#"+id+"-"+count).remove();
        $("#uploader-list_"+input).append('<input type="hidden" name="'+input+'" value="">');
    }
}

MainUploadPhoto.prototype.getUploadPhotoTemplateShow = function(){
    var img_template = '<div class="img-list mt-element-overlay" style="height:150px;width:200px;margin-top:10px;">\
                            \<div class="image-list mt-overlay-my4">\
                            \<a href="#{imgId}" name="gallery">\
                                \<div>\
                                    <img src="#{imgId}">\
                                \</div>\
                            \</a>\
                        \</div></div>';
    return img_template;
}

MainUploadPhoto.prototype.errorPrompt = function(code,fileNumLimit,fileSingleSizeLimit,extensions){
    var self = this;
    if(code=='F_DUPLICATE'){
        var content = '上传文件不能重复！！';
        self.showMsg(content);
        return false;
    }
    if(code=='Q_EXCEED_NUM_LIMIT'){
        var content = '上传文件数不能超过'+fileNumLimit+'个文件!';
        self.showMsg(content);
        return false;
    }
    if(code=='F_EXCEED_SIZE'){
        var content = '上传单个文件大小超过'+(fileSingleSizeLimit*1024)+'KB！';
        self.showMsg(content);
        return;
    }
    if(code=='Q_TYPE_DENIED'){
        var content = '上传文件格式只支持'+extensions+'！';
        self.showMsg(content);
        return false;
    }
}

MainUploadPhoto.prototype.showMsg = function(content){
    top.$.jBox.prompt(content,
        '温馨提示',
        'error',{ closed: function () {}
        });
}