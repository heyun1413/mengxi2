define([
       'jquery', 'underscore', 'backbone'
       , "collections/snippets"
       , "text!templates/app/tab-nav.html", "text!templates/app/form-option.html"

], function($, _, Backbone
           , SnippetsCollection
           ,_tabNavTemplate, _formOptTemplate){
  return Backbone.View.extend({
    tagName: "div"
    , className: "tab-pane"
    , initialize: function() {
      this.id = "forms";
      this.tabNavTemplate = _.template(_tabNavTemplate);
      this.formOptTemplate = _.template(_formOptTemplate);
      this.render();
    }
    , render: function(idx){
      // Render Snippet Views
      this.$el.empty();

      var that = this;

      var formSelect = $('<select id="form-select" class="form-control"><option value="">选择想要复用控件的表单</option></select><br>');
      _.each(this.options.list, function(item){
        formSelect.append(that.formOptTemplate({id: item.id, name: item.viewName}))  
      });
      $(formSelect).children("option").eq(idx).attr("selected","selected");

      this.$el.append(formSelect);

      $(formSelect).change(function(){      // 在列表中选择表单后获取表单json
        var optIdx = $(this).children("option:selected").index(); 
        if($(this).val()){
          $.ajax({                                                                         
            url: config.getFormUrl,
            type: "get",
            contentType: "application/json;charset=utf-8",
            data: {
              formId: $(this).val(),
              flag: 1
            },
            success: function(data,status){
              if(data){
                var editModels = _.rest(_.map(JSON.parse(data), function(item){
                  item.editMode = true;
                  return item;
                }));
                that.collection = new SnippetsCollection(editModels);
                that.render(optIdx); 
              }
            },
            error: function(data,status){
              alert(data.isSuccess + status + data.message); 
            }
          });  
        } else {
          that.collection = new SnippetsCollection(); 
          that.render(optIdx);  
        }
      })

      if (that.collection !== undefined) {
        _.each(this.collection.renderAll(), function(snippet){
          that.$el.append(snippet);
        });
      }

      // Render & append nav for tab
      if(!(idx >= 0)){
        $("#formtabs").append(this.tabNavTemplate({title: this.options.title, id: this.id}))
      };
      // Render tab
      this.$el.attr("id", this.id);
      this.$el.appendTo(".tab-content");
      this.delegateEvents();
    }
  });
});
