
function MainUploadFile(options){
    var defualt = {
        uploadId:"",
        name:"",
        extensions:"gif,jpg,jpeg,bmp,png,pdf,doc,docx,txt,xls,xlsx,ppt,pptx",
        mimeTypes:"image/*,text/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf",
        fileSingleSizeLimit:10,
        fileNumLimit:10,
        input:"",
        value:"",
        ctxStatic:"",
        ctx:""
    }
    this.options =$.extend(defualt,options);
}

MainUploadFile.prototype.initUploadFile = function(){
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
        self.multipleMultiUpload(uploadId,uploadOpts);
    }else{
        var uploadId = self.options.uploadId;
        var uploadOpts = {
            name:self.options.name,
            extensions:self.options.extensions,
            mimeTypes:self.options.mimeTypes,
            fileSingleSizeLimit:self.options.fileSingleSizeLimit
        }
        self.singleMultiUpload(uploadId,uploadOpts);
    }
}

MainUploadFile.prototype.initShowFile = function(){
    var self = this;
    var fileName = self.options.value;
    var path = self.options.input;
    var ctx = self.options.ctx;
    var ctxPath = self.options.ctx;
    var isDel = self.options.isDel;
    var fileNames = fileName.split(',');
    var $div_list = $("#uploader-list_"+path);
    if(isDel==""){
        isDel = "0";
    }
    for(var i=0;i<fileNames.length;i++){
        var file0 = fileNames[i];
        if(file0!=""){
            if(file0.indexOf('/')!=0){
                file0 = "/"+file0;
            }
            var suffix = file0.substring(file0.lastIndexOf('.')+1);
            var lastName = file0.substring(file0.lastIndexOf('/')+1);
            var lastNameStart = file0.substring(0,file0.lastIndexOf('/'));
            var file = lastNameStart.substring(lastNameStart.lastIndexOf('/')+1) +"." + suffix;
            var previewImgUrl = "";
            if(suffix=="jpg" || suffix=="jpeg" || suffix=="png" || suffix=="bmp" || suffix=="gif"  || suffix=="tiff" || suffix=="tif" || suffix=="pdf"){
                previewImgUrl = lastNameStart + "/" + file;
            }else{
                previewImgUrl = file0;
            }
            var ind = lastName.indexOf("@_");
            if(ind>=0){
                lastName = lastName.substring(ind+2);
            }
            var template = self.getUploadTemplate(suffix,isDel,path,ctxPath,"1");
            $div_list.append(
                template.replace(new RegExp("#{previewImgUrl}", "g"),   previewImgUrl)
                    .replace(new RegExp("#{downloadImgUrl}", "g"), file0)
                    .replace(new RegExp("#{lastName}", "g"), lastName)
                    .replace(new RegExp("#{imgMsgTitle}", "g"), lastName)
                    .replace(new RegExp("#{imgId}", "g"), file0)
                    .replace(new RegExp("#{imgTitle}", "g"), lastName)
                    .replace(new RegExp("#{path}", "g"), path)
            );
        }
    }
}

MainUploadFile.prototype.singleMultiUpload = function(id,uploadOpts){
    var self = this;
    var ctxStatic = self.options.ctxStatic;
    var ctx = self.options.ctx;
    var ctxPath = self.options.ctx;
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
                title: '文件',
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
            if(res.code=="0"){
                var fileName = res.path;
                var suffix = res.suffix;
                var lastName = res.lastName;
                var path = res.previewImgUrl;
                if(path){
                    if(path.indexOf('/')!=0){
                        path = "/"+path;
                    }
                }
                var template = self.getUploadTemplate(suffix,"1",input,ctxPath,"0");
                $div_list.html(
                    template.replace(new RegExp("#{previewImgUrl}", "g"), path)
                        .replace(new RegExp("#{downloadImgUrl}", "g"), fileName)
                        .replace(new RegExp("#{lastName}", "g"), lastName)
                        .replace(new RegExp("#{path}", "g"), input)
                        .replace(new RegExp("#{imgId}", "g"), "/" + fileName)
                );
                $div_list.find('.xg').click(function () {
                    uploader.removeFile(uploader.getFile(file.id));
                    $(this).parent().parent().parent().remove();
                });
                $("a[name='gallery']").lightBox();
            }else{
                var content = '上传文件失败！！';
                top.$.jBox.prompt(content,
                    '温馨提示',
                    'error',{ closed: function () {}
                });
                return;
            }
        },
        uploader.on("error", function (code) {
              return self.errorPrompt(code,fileNumLimit,fileSingleSizeLimit,extensions);
        });
    })(id,uploadOpts);

}

MainUploadFile.prototype.multipleMultiUpload = function(id,uploadOpts){
    var self = this;
    var ctxStatic = self.options.ctxStatic;
    var ctx = self.options.ctx;
    var ctxPath = self.options.ctx;
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
                title: '文件',
                extensions: extensions,
                mimeTypes: mimeTypes
            },
            duplicate :true,
            resize : false,
            fileNumLimit: fileNumLimit,
            fileSingleSizeLimit: fileSingleSizeLimit * 1024 * 1024
        });
        var $div_list = $("#uploader-list_"+input);
        var fileIdName = uploadOpts.name;
        uploader.onUploadSuccess = function(file, res){
            if(res.code=="0"){
                var len = $div_list.find("input[name='"+fileIdName+"']").length;
                if(len>=fileNumLimit){
                    var content = '上传文件数不能超过'+fileNumLimit+'个！';
                    top.$.jBox.prompt(content,
                        '温馨提示',
                        'error',{ closed: function () {}
                    });
                    return;
                }
                var fileName = res.path;
                var suffix = res.suffix;
                var lastName = res.lastName;
                var previewImgUrl = res.previewImgUrl;
                if(previewImgUrl){
                    if(previewImgUrl.indexOf('/')!=0){
                        previewImgUrl = "/"+previewImgUrl;
                    }
                }
                var template = self.getUploadTemplate(suffix,"1",input,ctxPath,"0");
                $div_list.append(
                    template.replace(new RegExp("#{previewImgUrl}", "g"),  previewImgUrl)
                        .replace(new RegExp("#{downloadImgUrl}", "g"), fileName)
                        .replace(new RegExp("#{lastName}", "g"), lastName)
                        .replace(new RegExp("#{path}", "g"), input)
                        .replace(new RegExp("#{imgId}", "g"), "/" + fileName)
                );
                $div_list.find('.xg').click(function () {
                    uploader.removeFile(uploader.getFile(file.id));
                    $(this).parent().parent().parent().remove();

                });
            }else{
                var content = '上传文件失败！！';
                top.$.jBox.prompt(content,
                    '温馨提示',
                    'error',{ closed: function () {}
                });
                return;
            }
        },
        uploader.on("error", function (code) {
            return self.errorPrompt(code,fileNumLimit,fileSingleSizeLimit,extensions);
        });
    })(id,uploadOpts);
}

MainUploadFile.prototype.getUploadTemplate = function(suffix,isDel,path,ctx,sb){
    var template = '';
    var self = this;
    suffix = suffix.toLowerCase();
    if(isDel=="0"){
        template = self.getUploadTemplateNotDel(suffix,path,ctx);
    }else{
        template = self.getUploadTemplateDel(suffix,path,ctx,sb);
    }
    return template;
}

MainUploadFile.prototype.getUploadTemplateDel = function(suffix,path,ctx,sb){
    var template0 = '<div class="img-list mt-element-overlay" style="margin-bottom: 0px;width:100%;">'+
        '<div class="mt-overlay-3">'+
        '<div style="float:left;width: 90%;">'+
        '<label class="a_label">#{lastName}';
    var template1 = '';
    if(suffix=="jpg" || suffix=="jpeg" || suffix=="png" || suffix=="bmp" || suffix=="gif"  || suffix=="tiff" || suffix=="tif" || suffix=="pdf"){
        template1 = '<a target="_blank" href="#{previewImgUrl}" class="a_preview">预览</a>';
    }
    var template2 = '<a href="javascript:;" onclick="maimDownloadFile(\''+ctx+'\',\'#{downloadImgUrl}\')" class="a_upload">下载</a>';
    var template3 = '';
    if(sb=="0"){
        template3 = '<a href="javascript:;" class="xg a_preview">删除</a>';
    }else{
        template3 = '<a class="xg a_preview" onclick="delFilePic(this,\''+path+'\',\'#{downloadImgUrl}\')">删除</a>';
    }
    var template4 = '</label></div><input type="hidden" name="#{path}" value="#{imgId}"/></div></div>';
    var template = template0 + template1 + template2 + template3 + template4;
    return template;
}

function delFilePic(obj,path,downloadImgUrl){
    $(obj).parent().parent().parent().remove();
    var lastNameStart = downloadImgUrl.substring(0,downloadImgUrl.lastIndexOf('/'));
    var lastName = lastNameStart.substring(lastNameStart.lastIndexOf('/')+1)
    if($("."+lastName).length>0){
        $("."+lastName).remove();
    }
}

MainUploadFile.prototype.getUploadTemplateNotDel = function(suffix,path,ctx){
    var template0 = '<div class="img-list mt-element-overlay" style="margin-bottom: 0px;width:100%;">'+
        '   <div class="mt-overlay-3">'+
        '       <div style="float:left;width: 90%;">'+
        '           <label class="a_label">#{lastName}';
    var template1 = '';
    if(suffix=="jpg" || suffix=="jpeg" || suffix=="png" || suffix=="bmp" || suffix=="gif"  || suffix=="tiff" || suffix=="tif" || suffix=="pdf"){
        template1 = '<a target="_blank" href="#{previewImgUrl}" class="a_preview">预览</a>';
    }
    var template2 = '<a href="javascript:;" onclick="maimDownloadFile(\''+ctx+'\',\'#{downloadImgUrl}\')" class="a_upload">下载</a>'+
        '           </label>'+
        '           <input type="hidden" name="#{path}" value="#{imgId}"/>'+
        '       </div>'+
        '   </div>'+
        '</div>';
    var template = template0 + template1 + template2;
    return template;
}


MainUploadFile.prototype.errorPrompt = function(code,fileNumLimit,fileSingleSizeLimit,extensions){
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

MainUploadFile.prototype.showMsg = function(content){
    top.$.jBox.prompt(content,
        '温馨提示',
        'error',{ closed: function () {}
    });
}