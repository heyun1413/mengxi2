define([
       'jquery', 'underscore', 'backbone'
       , "text!templates/app/tab-nav.html"

], function($, _, Backbone,
           _tabNavTemplate){
  return Backbone.View.extend({
    tagName: "div"
    , className: "tab-pane"
    , initialize: function() {
      switch(this.options.title){
        case "文本框":
          this.id = "input";
          break;
        case "单选框/复选框":
          this.id = "radioscheckboxes";
          break;
        case "下拉列表":
          this.id = "select";
          break;
        case "其他":
          this.id = "other";
          break;
        case "已有表单":
          this.id = "forms";
          break;
        case "生成代码":
          this.id = "rendered";
          break;
        default:
          this.id = this.options.title.toLowerCase().replace(/\W/g,'');
      }
      // this.id = this.options.title.toLowerCase().replace(/\W/g,'');
      this.tabNavTemplate = _.template(_tabNavTemplate);
      this.render();
    }
    , render: function(){
      // Render Snippet Views
      var that = this;
      if (that.collection !== undefined) {
        _.each(this.collection.renderAll(), function(snippet){
          that.$el.append(snippet);
        });
      } else if (that.options.content){
        that.$el.append(that.options.content);
      }
      // Render & append nav for tab
      $("#formtabs").append(this.tabNavTemplate({title: this.options.title, id: this.id}))
      // Render tab
      this.$el.attr("id", this.id);
      this.$el.appendTo(".tab-content");
      this.delegateEvents();
    }
  });
});
