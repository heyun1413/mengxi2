define([
       "jquery" , "underscore" , "backbone"
       , "collections/snippets" , "collections/my-form-snippets"
       , "views/tab", "views/tab-form" , "views/my-form"
       , "text!data/input.json", "text!data/radio.json", "text!data/select.json", "text!data/other.json"
], function(
  $, _, Backbone
  , SnippetsCollection, MyFormSnippetsCollection
  , TabView, TabFormView, MyFormView
  , inputJSON, radioJSON, selectJSON, otherJSON
){  
  return {   
    initialize: function(){
      var formCollection; 

      // 初始化左侧表单视图
      formCollection = new MyFormSnippetsCollection(config.formJson);
      //console.log(formCollection);
      var formView = new MyFormView({
        title: "Original"
        , collection: formCollection
      });
      $("#saveResult").show();
      $("#saveResult").click(function(){
        console.log(formCollection);
        $("#saveResult").text("正在提交……").attr("disabled","disabled");
        //将表单数据同步到后台  Backbone.sync("update",formCollection);
        $.ajax({
          url: config.setFormUrl,
          type: "post",
          contentType: "application/json;charset=utf-8",
          data: JSON.stringify(formCollection),
          success: function(data,status){
            top.$.jBox.tip("表单保存成功！");
            $("#saveResult").text("保存表单").removeAttr("disabled");
            if($("#backlist").attr("href")){
              window.location = $("#backlist").attr("href");  
            }
          },
          error: function(data,status){
            top.$.jBox.alert("表单保存失败！", status);
            $("#saveResult").text("保存表单").removeAttr("disabled");
          }
        });
      }); 
    }
  }
});