define([
       "jquery", "underscore", "backbone"
      , "views/temp-snippet"
      , "helper/pubsub"
      , "text!templates/app/renderform.html"
], function(
  $, _, Backbone
  , TempSnippetView
  , PubSub
  , _renderForm
){
  return Backbone.View.extend({
    tagName: "fieldset"
    , initialize: function(){
      this.collection.on("add", this.render, this);
      this.collection.on("remove", this.render, this);
      this.collection.on("change", this.render, this);
      this.$build = $("#build");
      this.renderForm = _.template(_renderForm);
      this.render();
    }

    , render: function(){
      // Render Snippet Views 原render方法
      // this.$el.empty();
      // var that = this;
      // var containsFile = false;
      // _.each(this.collection.renderAll(), function(snippet){
      //   that.$el.append(snippet);
      // });
      // $("#render").val(that.renderForm({
      //   multipart: this.collection.containsFileType(),
      //   text: _.map(this.collection.renderAllClean(), function(e){return e.html()}).join("\n")
      // }));
      // this.$el.appendTo("#build form");
      // this.delegateEvents();
      // 原render方法 end

      // 自定义布局js代码
      var templist = [];
      // 自定义布局js代码 end

      //Render Snippet Views
      this.$el.empty();
      var that = this;
      var containsFile = false;
      _.each(this.collection.renderAll(), function(snippet){
        // 自定义布局js代码 原为：that.$el.append(snippet); 
        if($(snippet).data("customrow")>=0 && $(snippet).data("customcol")>=0){
          templist.push(snippet);  
        } else {
          that.$el.append(snippet);
        }
        // 自定义布局js代码 end
      });
      $("#render").val(that.renderForm({
        multipart: this.collection.containsFileType(),
        text: _.map(this.collection.renderAllClean(), function(e){return e.html()}).join("\n")
      }));

      // 自定义布局js代码
      for(var i in templist) {
        var rowidx = $(templist[i]).data("customrow"),
            colidx = $(templist[i]).data("customcol"),
            loc = $(templist[i]).data("customloc");
        this.$el.find(".customrow").eq(rowidx).find(".customcol").eq(colidx).children(".component").eq(loc).after(templist[i]);
      }
      templist = [];
      // 自定义布局js代码 end

      this.$el.appendTo("#build form");
      this.delegateEvents();
    }
  })
});
