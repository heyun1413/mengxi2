define([
       "jquery" , "underscore" , "backbone"
       , "collections/snippets" , "collections/my-form-snippets"
       , "views/tab" , "views/my-form"
       , "text!data/input.json", "text!data/radio.json", "text!data/select.json", "text!data/other.json", "text!data/origin_form.json"
       , "text!templates/app/render.html"
], function(
  $, _, Backbone
  , SnippetsCollection, MyFormSnippetsCollection
  , TabView, MyFormView
  , inputJSON, radioJSON, selectJSON, otherJSON, formsJSON
  , renderTab
){
  return {
    initialize: function(){
      var originJson = null;
      var jsonId = 34535;
      var getUrl = "http://localhost:8080/formbuilder/assets/js/data/origin.json?hr=" + jsonId;
      var editResult = null;

      $.ajax({
        url:getUrl,
        success: function(data){       
          originJson = data.controls;
          editResult = new MyFormView({
            title: "Original"
            , collection: new MyFormSnippetsCollection(originJson)
          }); 
          $("#saveResult").show();
        },
        error: function(){
          //Bootstrap "My Form" with 'Form Name' snippet.  
          editResult = new MyFormView({
            title: "Original"
            , collection: new MyFormSnippetsCollection([
              { "title" : "Form Name"
                , "fields": {
                  "name" : {
                    "label"   : "表单名称"
                    , "type"  : "input"
                    , "value" : "表单名称"
                  }
                }
              }
            ])
          });
          $("#saveResult").show();
        } 
      });

      //Bootstrap tabs from json.
      new TabView({
        title: "文本框"
        , collection: new SnippetsCollection(JSON.parse(inputJSON))
      });
      new TabView({
        title: "单选框/复选框"
        , collection: new SnippetsCollection(JSON.parse(radioJSON))
      });
      new TabView({
        title: "下拉列表"
        , collection: new SnippetsCollection(JSON.parse(selectJSON))
      });
      new TabView({
        title: "其他"
        , collection: new SnippetsCollection(JSON.parse(otherJSON))
      });
      new TabView({
        title: "已有表单"
        , collection: new SnippetsCollection(JSON.parse(formsJSON).controls)
      });
      new TabView({
        title: "生成代码"
        , content: renderTab
      });

      //Make the first tab active!
      $("#components .tab-pane").first().addClass("active");
      $("#formtabs li").first().addClass("active");  

      $("#saveResult").click(function(){
        console.log(JSON.stringify(editResult.collection));
      });    
    }
  }
});
