define([
       "jquery", "underscore", "backbone",
       "views/snippet", "views/temp-snippet",
       "helper/pubsub"
], function(
  $, _, Backbone,
  SnippetView, TempSnippetView,
  PubSub
){
  return SnippetView.extend({
    events:{
      "click"   : "preventPropagation" //stops checkbox / radio reacting.
      , "mousedown" : "mouseDownHandler"
    }

    , mouseDownHandler : function(mouseDownEvent){
      mouseDownEvent.stopPropagation();
      mouseDownEvent.preventDefault();
      var that = this, zNodes;
      var customjsdiv = $("<div id='customjs' style='margin:10px 0;'><label>自定义js</label><br><textarea class='form-control'></textarea></div>");
      var thatid,thatname;
      //console.log(searchs);
      if(this.model.get("title") !== "Form Name" && this.model.get("title") != "Section title" && this.model.get("title") != "customlayout2" && this.model.get("title") != "customlayout3"){
        $(this.$el).toggleClass("actived").siblings(".component").removeClass("actived");
        
        $("#event-type").remove();
        $("#customjs").remove();
        $("#rule-editor").empty();
        $(".controlinfo").remove();
        
        if($(this.$el).hasClass("actived")){

          if(!that.model.get("customjs")){
            that.model.attributes.customjs = {
              default:"",
              change:"",
            }
          }

          thatid = that.model.attributes.fields.name.value;
          if(that.model.attributes.columnName){
            if(that.model.attributes.columnName.indexOf("processVariables_")==0){
              thatname = that.model.attributes.columnName;
            } else {
              thatname = that.model.attributes.columnName+".id";
            }
          } else {
            thatname = "processVariables_"+that.model.attributes.fields.name.value;
          }
          $("#rule-editor").before('<div class="controlinfo" style="position:absolute; top:0; right:0; line-height:24px;">控件name：'+thatname+'</div>')

          // 生成事件选择下拉列表
          $("#rule-editor").before('<select name="" id="event-type" style="margin-bottom:10px;"><option value="none">选择联动事件类型</option><option value="default">无动作</option><option value="change">值改变</option></select>');
          $("#event-type").change(function(){
            zNodes = [{
              id: that.model.attributes.fields.id.value+"-events",
              pId: "0",
              name: "控件事件响应",
              type: "events"
            }];
            //从model中读取对应事件的联动数据，准备生成树
            switch($("#event-type").val()){
              case "default":
                $("#rule-editor").before(customjsdiv);
                $("#customjs textarea").val(that.model.get("customjs").default);

                if(that.model.get("eventjson") && that.model.get("eventjson").default){
                  zNodes = JSON.parse(that.model.get("eventjson").default);
                }
                that.treerender(zNodes);
                break;

              case "change":
                $("#rule-editor").before(customjsdiv);
                $("#customjs textarea").val(that.model.get("customjs").change);

                if(that.model.get("eventjson") && that.model.get("eventjson").change){
                  zNodes = JSON.parse(that.model.get("eventjson").change);
                }
                that.treerender(zNodes);

                break;

              default:
                $("#customjs").remove();
                $("#rule-editor").empty();
                return false;
            }
          })
        }
      };
    }
    , treerender: function(zNodes){
      var that = this;
      // ztree 配置项
      var setting = {
        check:{enable:true,nocheckInherit:true},
        view:{selectedMulti:false},
        data:{
          simpleData:{enable:true}
        },
        callback:{
          beforeClick:function(id, node){
            tree.checkNode(node, !node.checked, true, true);
            return false;
          },
          beforeEditName: function(event,treeId,treeNode){
            treeNode._name = treeNode.name;
            return true;
          },
          onRename: function(event,treeId,treeNode){
            // if((treeNode.name).trim() == ""){
            //   if(treeNode.getParentNode().type == "calop" || treeNode.getParentNode().type == "op"){
            //     treeNode.type = "HS";
            //   } else if(treeNode.getParentNode().type == "acthscalop"){
            //     treeNode.type = "calLHSchild";   
            //   } else if(treeNode.getParentNode().type == "set"){
            //     treeNode.type = "setLHSchild";   
            //   }
            //   if(treeNode.getNextNode()) {
            //     treeNode.name = "左侧表达式";
            //   } else {
            //     treeNode.name = "右侧表达式";
            //   }
            //   alert("请输入内容！"); 
            //   return false; 
            // } else 
            if(treeNode.getParentNode().type == "calop" || treeNode.getParentNode().type == "acthscalop"){
              if (!/^\-?[0-9]+.?[0-9]*$/.test(treeNode.name)) {
                if(treeNode.getParentNode().type == "calop"){
                  treeNode.type = "HS";
                } else if(treeNode.getParentNode().type == "acthscalop"){
                  treeNode.type = "calLHSchild";   
                }

                if(treeNode.getNextNode()) {
                  treeNode.name = "左侧表达式";
                } else {
                  treeNode.name = "右侧表达式";
                }
                alert("请输入数字！");
                return false;
              }
            } 

            if(treeNode.getParentNode().type == "set"){
              treeNode.type = "setLHS-textvalue";
            } else if(treeNode.getParentNode().type == "acthscalop"){
              treeNode.type = "calLHS-textvalue";
            } else {
              treeNode.type = "textvalue";    
            }
            tree.refresh();
            tree.expandAll(true); 
            return true;
          },
          onRightClick:function(event,id,node){
            var menu, date, submenu;

            // 刷新右键菜单列表
            $(".context-menu").remove();
            menu = $("<ul class='context-menu'></ul>");
            menu.css("left",event.pageX+"px");
            menu.css("top",(event.pageY-$(document).scrollTop())+"px");
            $(".ztree").append(menu);

            switch(node.type){  // 根据节点类型生成不同的右键菜单
              case "events":    // 在根节点上右键点击添加事件响应
                menu.append("<li class='exe add addresp'>添加事件响应</li>");
                break;

              case "response": case "control":   // 在响应节点上右键点击删除响应
                menu.append("<li class='exe del'>删除</li>");
                break;

              case "condition":   // 添加执行条件
                if(!node.children || node.children.length == 0){  // 每个响应只允许一个条件
                  menu.append("<li class='exe add addop rel'>></li><li class='exe add addop rel'>>=</li><li class='exe add addop rel'><</li><li class='exe add addop rel'><=</li><li class='exe add addop rel'>==</li><li class='exe add addop rel'>!=</li><li class='exe add addop rel'>&&</li><li class='exe add addop rel'>||</li><li class='exe add addop rel'>!</li>"); 
                }
                break;

              case "HS": case "objvalue": case "textvalue": case "curr":  // 添加在表达式上添加条件
                menu.append("<li class='expandable'>关系式<ul class='sublist'><li class='exe add hsaddop rel'>></li><li class='exe add hsaddop rel'>>=</li><li class='exe add hsaddop rel'><</li><li class='exe add hsaddop rel'><=</li><li class='exe add hsaddop rel'>==</li><li class='exe add hsaddop rel'>!=</li><li class='exe add hsaddop rel'>&&</li><li class='exe add hsaddop rel'>||</li><li class='exe add hsaddop rel'>!</li></ul></li>"
                  +"<li class='expandable'>计算式<ul class='sublist'><li class='exe add hsaddop cal'>+</li><li class='exe add hsaddop cal'>-</li><li class='exe add hsaddop cal'>*</li><li class='exe add hsaddop cal'>/</li></ul></li>"+
                  "<li class='expandable'>控件<ul class='sublist controls'></ul></li><li class='exe set'>输入值</li>");
                if(that.model.attributes.fields.datasourceEntityPath && that.model.attributes.fields.datasourceEntityPath.value == "com.thinkgem.jeesite.modules.sys.entity.User"){
                  menu.append("<li class='exe add curr'>当前用户</li>"); 
                };
                // if(that.model.attributes.fields.)
                for( var i in that.model.collection.models) {
                  var modelname = that.model.collection.models[i].get("title");
                  if(modelname != "Form Name" && modelname != "Section title" && modelname != "customlayout2" && modelname != "customlayout3" && that.getType(modelname) != "table") {
                    if(modelname == "Search Input"){
                      if(that.model.collection.models[i].attributes.columnName){
                        if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                          submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        } else {
                          submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                        }
                      } else {
                        submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                      }
                      /*
                       * 获取searchinput属性
                       */
                      submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>"); 
                      for(var j in searchs.controls){
                        if(that.model.collection.models[i].attributes.fields.name.value == searchs.controls[j].name){
                          if(searchs.controls[j].attributes){
                            for(var k in searchs.controls[j].attributes) {
                              submenu.find(".sublist").append("<li class='exe add addobjvalue' data-searchval='"+searchs.controls[j].attributes[k].value+"'>"+searchs.controls[j].attributes[k].label+"</li>");  
                            }
                          }
                        }
                      }
                    } else {
                      if(modelname == "Multiple Radios" || modelname == "Multiple Radios Inline"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.radios.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true'>"+that.model.collection.models[i].attributes.fields.radios.value[j]+"</li>");
                        }
                      } else if(modelname == "Multiple Checkboxes" || modelname == "Multiple Checkboxes Inline"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.checkboxes.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true'>"+that.model.collection.models[i].attributes.fields.checkboxes.value[j]+"</li>");
                        }
                      } else if(modelname == "Select Basic" || modelname == "Select Multiple"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>"); 
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>"); 
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.options.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true'>"+that.model.collection.models[i].attributes.fields.options.value[j]+"</li>");
                        }
                      } else {
                        submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                      }  
                    } 

                    $("ul.controls").append(submenu);
                  }
                }
                break;

              case "op": case "calop": case "acthscalop":   // 在响应节点上右键点击删除响应
                menu.append("<li class='exe clear'>清除</li>");
                break;

              case "actlist":   // 添加执行条件
                menu.append("<li data-op='hide' class='exe add addact'>隐藏</li><li data-op='show' class='exe add addact'>显示</li><li data-op='set' class='exe add addact'>设置值</li><li data-op='cal' class='exe add addact'>计算值</li>");
                if($("#event-type").val()=="change" && that.model.get("title") == "Search Input"){
                  menu.append("<li data-op='cas' class='exe add addact'>对象级联</li>");
                }
                break;

              case "hide": case "show":   // 执行动作隐藏节点
                for( var i in that.model.collection.models) {
                  var modelname = that.model.collection.models[i].get("title");
                  if(modelname != "Form Name" && modelname != "customlayout2" && modelname != "customlayout3") { 
                    if(modelname == "Search Input" || modelname == "Multiple Radios" || modelname == "Multiple Radios Inline" || modelname == "Multiple Checkboxes" || modelname == "Multiple Checkboxes Inline" || modelname == "Select Basic" || modelname == "Select Multiple"){
                      if(that.model.collection.models[i].attributes.columnName){
                        if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                          menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                        } else {
                          menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                        }
                      } else {
                        menu.append("<li class='exe add addcontrol' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                      }
                    } else if(that.getType(modelname) == "table" || modelname == "Section title") {
                      menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.title.value+"</li>");
                    } else {
                      menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                    }                  
                  }
                }
                menu.append("<li class='exe del'>删除</li>");
                break;

              case "set": case "cal": case "cas":  // 执行动作下设置值、计算值、对象级联节点
                menu.append("<li class='exe del'>删除</li>");
                break;

              case "setLHS": case "setLHS-objvalue": case "setLHS-textvalue":   // 执行动作设置值左侧表达式节点
                menu.append("<li class='exe set'>输入值</li>");
                for( var i in that.model.collection.models) {
                  var modelname = that.model.collection.models[i].get("title");
                  if(modelname != "Form Name" && modelname != "Section title" && modelname != "customlayout2" && modelname != "customlayout3" && that.getType(modelname) != "table") {                    
                    
                    if(modelname == "Search Input"){
                      if(that.model.collection.models[i].attributes.columnName){
                        if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                          submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        } else {
                          submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                        }
                      } else {
                        submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                      }
                      /*
                       * 需要获取searchinput属性
                       */
                      submenu.find(".sublist").append("<li class='exe add addobjvalue' data-javatype='"+that.model.collection.models[i].attributes.fields.datasourceEntityPath.value+"'>显示值</li>"); 
                      for(var j in searchs.controls){
                        if(that.model.collection.models[i].attributes.fields.name.value == searchs.controls[j].name){
                          if(searchs.controls[j].attributes){
                            for(var k in searchs.controls[j].attributes) {
                              submenu.find(".sublist").append("<li class='exe add addobjvalue' data-searchval='"+searchs.controls[j].attributes[k].value+"'>"+searchs.controls[j].attributes[k].label+"</li>");  
                            }
                          }
                        }
                      } 
                    } else {
                      if(modelname == "Multiple Radios" || modelname == "Multiple Radios Inline"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue' data-setdisable='true'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.radios.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true' data-setdisable='true'>"+that.model.collection.models[i].attributes.fields.radios.value[j]+"</li>");
                        }
                      } else if(modelname == "Multiple Checkboxes" || modelname == "Multiple Checkboxes Inline"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.checkboxes.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true'>"+that.model.collection.models[i].attributes.fields.checkboxes.value[j]+"</li>");
                        }
                      } else if(modelname == "Select Basic" || modelname == "Select Multiple"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue' data-setdisable='true'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.options.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true' data-setdisable='true'>"+that.model.collection.models[i].attributes.fields.options.value[j]+"</li>");
                        }
                      } else {
                        submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controlname='"+that.model.collection.models[i].attributes.title+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                      }
                    } 
                  }
                  menu.append(submenu);
                }
                menu.append("<li class='exe clear'>清除</li>");
                break;

              case "setRHS": case "setRHS-objvalue":    // 执行动作设置值右侧表达式节点
                if(node.getPreNode().type=="setLHS-objvalue" || node.getPreNode().type=="setLHS-textvalue") {
                  if(node.getPreNode().controlname == "Search Input" && node.getPreNode().name.split(".")[1]=="显示值"){
                    /* 
                     * 根据<LHS>节点的search控件的java类类型进行过滤,调用接口从后端获取
                     */
                    $.ajax({                                                                         
                      url: config.getContorlsByjavatype,
                      type: "get",
                      contentType: "application/json;charset=utf-8",
                      data:{
                        formId: that.model.collection.models[0].attributes.fields.name.id,
                        filterType: "Search Input",
                        filterJavaType: node.getPreNode().javatype
                      },
                      success:function(data,status){
                        var data = JSON.parse(data);
                        for(var i in data.controls){
                          for(x in that.model.collection.models){
                            if(that.model.collection.models[x].attributes.fields.name && data.controls[i].name == that.model.collection.models[x].attributes.fields.name.value) {
                              data.controls[i].columnName = that.model.collection.models[x].attributes.columnName;
                            }
                          }
                          if(data.controls[i].columnName && data.controls[i].columnName.indexOf("processVariables_")==0){
                            menu.append("<li class='exe add addcontrol' data-controlid='"+data.controls[i].columnName+"'>"+data.controls[i].viewName+"</li>"); 
                          } else {
                            menu.append("<li class='exe add addcontrol' data-controlid='"+data.controls[i].columnName+".id'>"+data.controls[i].viewName+"</li>"); 
                          }
                        }
                        // 为ajax回调生成的菜单绑定事件
                        $(".context-menu li.exe").on("click",function(){  // 菜单处理

                          if($(this).hasClass("add")){  // 添加节点
                            date = Date.parse(new Date())/1000;
                            if($(this).hasClass("addcontrol")){  // 添加一个对象节点
                              if($(this).data("setdisable")){
                                node.setdisable = $(this).data("setdisable");
                              } else if(node.setdisable){
                                delete node.setdisable;
                              }
                              if(node.type == "setRHS" || node.type == "setRHS-objvalue"){
                                node.type = "setRHS-objvalue";
                                node.name = $(this).text();
                                node.controlid = $(this).data("controlid");
                                tree.refresh();
                              } else if(node.type == "calRHS" || node.type == "calRHS-objvalue"){
                                node.type = "calRHS-objvalue";
                                node.name = $(this).text();
                                node.controlid = $(this).data("controlid");
                                tree.refresh();
                              } else {
                                tree.addNodes(node,[
                                  {
                                    id : "control-"+date,
                                    pId : node.id,
                                    type : "control",
                                    name : $(this).text(),
                                    controlid : $(this).data("controlid")
                                  }
                                ],false);  
                              } 
                            }
                          }
                           
                          tree.expandAll(true); 
                        });
                      },
                      error: function(data,status){
                        top.$.jBox.alert(data.message, status);
                      }
                    });
                    /* 
                     * 根据<LHS>节点的search控件的java类类型进行过滤 end
                     */
                  } else {
                    for( var i in that.model.collection.models) {
                      var modelname = that.model.collection.models[i].get("title");
                      if(modelname != "Form Name" && modelname != "Section title" && modelname != "Search Input" && modelname != "customlayout2" && modelname != "customlayout3" && that.getType(modelname) != "table") {                    
                        if(modelname == "Multiple Radios" || modelname == "Multiple Radios Inline" || modelname == "Select Basic" || modelname == "Select Multiple" || modelname == "Multiple Checkboxes" || modelname == "Multiple Checkboxes Inline"){
                          if(that.model.collection.models[i].attributes.columnName){
                            if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                              menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-setdisable='true' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                            } else {
                              menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-setdisable='true' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");  
                            }
                          } else {
                            menu.append("<li class='exe add addcontrol' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-setdisable='true' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                          }
                        } else {
                          menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");  
                        }
                      }
                    }
                  }
                  menu.append("<li class='exe clear'>清除</li>");
                } else {
                  alert("请先设置左侧表达式！");
                }
                break;

              case "calLHS":    // 执行动作计算值左侧表达式节点
                menu.append("<li class='exe add acthsaddop cal'>+</li><li class='exe add acthsaddop cal'>-</li><li class='exe add acthsaddop cal'>*</li><li class='exe add acthsaddop cal'>/</li><li class='exe clear'>清除</li>");
                break;

              case "calLHSchild": case "calLHS-objvalue": case "calLHS-textvalue":    // 执行动作计算值左侧表达式节点
                menu.append("<li class='expandable'>计算式<ul class='sublist'><li class='exe add acthsaddop cal'>+</li><li class='exe add acthsaddop cal'>-</li><li class='exe add acthsaddop cal'>*</li><li class='exe add acthsaddop cal'>/</li></ul></li>"+
                  "<li class='expandable'>控件<ul class='sublist controls'></ul></li><li class='exe set'>输入值</li><li class='exe clear'>清除</li>");
                for( var i in that.model.collection.models) {
                  var modelname = that.model.collection.models[i].get("title");
                  if(modelname != "Form Name" && modelname != "Section title" && modelname != "customlayout2" && modelname != "customlayout3" && that.getType(modelname) != "table") {
                    if(modelname == "Search Input"){
                      if(that.model.collection.models[i].attributes.columnName){
                        if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                          submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        } else {
                          submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                        }
                      } else {
                        submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                      }
                      /*
                       * 获取searchinput属性
                       */
                      submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>"); 
                      for(var j in searchs.controls){
                        if(that.model.collection.models[i].attributes.fields.name.value == searchs.controls[j].name){
                          if(searchs.controls[j].attributes){
                            for(var k in searchs.controls[j].attributes) {
                              submenu.find(".sublist").append("<li class='exe add addobjvalue' data-searchval='"+searchs.controls[j].attributes[k].value+"'>"+searchs.controls[j].attributes[k].label+"</li>");  
                            }
                          }
                        }
                      }
                    } else {
                      if(modelname == "Multiple Radios" || modelname == "Multiple Radios Inline"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.radios.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true'>"+that.model.collection.models[i].attributes.fields.radios.value[j]+"</li>");
                        }
                      } else if(modelname == "Multiple Checkboxes" || modelname == "Multiple Checkboxes Inline"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.checkboxes.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true'>"+that.model.collection.models[i].attributes.fields.checkboxes.value[j]+"</li>");
                        }
                      } else if(modelname == "Select Basic" || modelname == "Select Multiple"){
                        if(that.model.collection.models[i].attributes.columnName){
                          if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                          } else {
                            submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                          }
                        } else {
                          submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        }
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                        for(var j in that.model.collection.models[i].attributes.fields.options.value){
                          submenu.find(".sublist").append("<li class='exe add addobjvalue' data-showname='true'>"+that.model.collection.models[i].attributes.fields.options.value[j]+"</li>");
                        }
                      }  else {
                        submenu = $("<li class='expandable' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                        submenu.find(".sublist").append("<li class='exe add addobjvalue'>显示值</li>");
                      }
                    } 

                    $("ul.controls").append(submenu);
                  }
                }
                break;

              case "calRHS": case "calRHS-objvalue":    // 执行动作计算值右侧表达式节点
                for(var i in that.model.collection.models) {
                  var modelname = that.model.collection.models[i].get("title");
                  if(modelname != "Form Name" && modelname != "Section title" && modelname != "Search Input" && modelname != "customlayout2" && modelname != "customlayout3" && that.getType(modelname) != "table") {  
                    if(modelname == "Multiple Radios" || modelname == "Multiple Radios Inline" || modelname == "Select Basic" || modelname == "Select Multiple" || modelname == "Multiple Checkboxes" || modelname == "Multiple Checkboxes Inline"){
                      if(that.model.collection.models[i].attributes.columnName){
                        if(that.model.collection.models[i].attributes.columnName.indexOf("processVariables_")==0){
                          menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                        } else {
                          menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+".id' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                        }
                      } else {
                        menu.append("<li class='exe add addcontrol' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");
                      }
                    } else {
                      menu.append("<li class='exe add addcontrol' data-controlid='"+that.model.collection.models[i].attributes.columnName+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'>"+that.model.collection.models[i].attributes.fields.label.value+"</li>");  
                    }                 
                  }
                }
                menu.append("<li class='exe clear'>清除</li>");
                
                break;

              case "casLHS": case "casLHS-objvalue":   // 执行动作对象级联左侧表达式节点
                // for(var i in that.model.collection.models) {
                //   var modelname = that.model.collection.models[i].get("title"); 
                //   if(modelname == "Search Input"){
                //     var submenu = $("<li class='expandable' data-controlid='processVariables_"+that.model.collection.models[i].attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.collection.models[i].attributes.title)+"'><span>"+that.model.collection.models[i].attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                //     /*
                //      * 需要获取searchinput属性,右侧表达式需要根据上面<LHS>所选择的外键属性的对象过滤
                //      */
                //     for(var j in searchs.controls){
                //       if(that.model.collection.models[i].attributes.fields.name.value == searchs.controls[j].name){
                //         if(searchs.controls[j].attributes){
                //           for(var k in searchs.controls[j].attributes) {
                //             submenu.find(".sublist").append("<li class='exe add addobjvalue' data-searchval='"+searchs.controls[j].attributes[k].value+"' data-mappedby='"+searchs.controls[j].attributes[k].mappedBy+"' data-fktype='"+searchs.controls[j].attributes[k].fkType+"' data-datasourceEntitypath='"+searchs.controls[j].attributes[k].datasourceEntityPath+"' data-JoinColumnname='"+searchs.controls[j].attributes[k].JoinColumnName+"'>"+searchs.controls[j].attributes[k].label+"</li>");  
                //           }
                //         }
                //       }
                //     }
                //   } 
                //   menu.append(submenu);
                // }
                // menu.append("<li class='exe clear'>清除</li>");
                // break;
                if(that.model.attributes.columnName){ 
                  if(that.model.attributes.columnName.indexOf("processVariables_")==0){
                    submenu = $("<li class='expandable' data-controlid='"+that.model.attributes.columnName+"' data-controltype='"+that.getType(that.model.attributes.title)+"'><span>"+that.model.attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                  } else {
                    submenu = $("<li class='expandable' data-controlid='"+that.model.attributes.columnName+".id' data-controltype='"+that.getType(that.model.attributes.title)+"'><span>"+that.model.attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");
                  }
                } else {
                    submenu = $("<li class='expandable' data-controlid='"+that.model.attributes.fields.name.value+"' data-controltype='"+that.getType(that.model.attributes.title)+"'><span>"+that.model.attributes.fields.label.value+"</span><ul class='sublist'></ul></li>");  
                }
                /*
                 * 需要获取searchinput属性,右侧表达式需要根据上面<LHS>所选择的外键属性的对象过滤
                 */
                // for(var j in searchs.controls){
                //   if(that.model.attributes.fields.name.value == searchs.controls[j].name){
                //     if(searchs.controls[j].attributes){
                //       for(var k in searchs.controls[j].attributes) {
                //         submenu.find(".sublist").append("<li class='exe add addobjvalue' data-searchval='"+searchs.controls[j].attributes[k].value+"' data-mappedby='"+searchs.controls[j].attributes[k].mappedBy+"' data-fktype='"+searchs.controls[j].attributes[k].fkType+"' data-datasourceEntitypath='"+that.model.attributes.fields.datasourceEntityPath.value+"' data-JoinColumnname='"+searchs.controls[j].attributes[k].JoinColumnName+"' data-searchpath='"+searchs.controls[j].attributes[k].datasourceEntityPath+"' data-fkrelationtype='"+searchs.controls[j].attributes[k].fkRelationType+"'>"+searchs.controls[j].attributes[k].label+"</li>");  
                //       }
                //     }
                //   }
                // }
                // menu.append(submenu);
                // menu.append("<li class='exe clear'>清除</li>");
                $.ajax({                                                                         
                  url: config.getSearchsAttributes,
                  type: "get",
                  contentType: "application/json;charset=utf-8",
                  data:{
                    formId: that.model.collection.models[0].attributes.fields.name.id,
                    datasourceEntityPath: -1,
                    fkType: -1,
                    JoinColumnName: -1,
                    mappedBy: -1
                  },
                  success:function(data,status){
                    var data = JSON.parse(data);
                    for(var j in data.controls){
                      if(that.model.attributes.fields.name.value == data.controls[j].name){
                        if(data.controls[j].attributes){
                          for(var k in data.controls[j].attributes) {
                            submenu.find(".sublist").append("<li class='exe add addobjvalue' data-searchval='"+data.controls[j].attributes[k].value+"' data-mappedby='"+data.controls[j].attributes[k].mappedBy+"' data-fktype='"+data.controls[j].attributes[k].fkType+"' data-datasourceEntitypath='"+that.model.attributes.fields.datasourceEntityPath.value+"' data-JoinColumnname='"+data.controls[j].attributes[k].JoinColumnName+"' data-searchpath='"+data.controls[j].attributes[k].datasourceEntityPath+"' data-fkrelationtype='"+data.controls[j].attributes[k].fkRelationType+"'>"+data.controls[j].attributes[k].label+"</li>");  
                          }
                        }
                      }  
                    }
                    menu.append(submenu);
                    menu.append("<li class='exe clear'>清除</li>");
                    // 为ajax回调生成的菜单绑定事件
                    $(".context-menu li.exe").on("click",function(){  // 菜单处理

                      if($(this).hasClass("add")){  // 添加节点
                        date = Date.parse(new Date())/1000;
                        if($(this).hasClass("addcontrol")){  // 添加一个对象节点
                          if($(this).data("setdisable")){
                            node.setdisable = $(this).data("setdisable");
                          } else if(node.setdisable){
                            delete node.setdisable;
                          }
                          if(node.type == "setRHS" || node.type == "setRHS-objvalue"){
                            node.type = "setRHS-objvalue";
                            node.name = $(this).text();
                            node.controlid = $(this).data("controlid");
                            tree.refresh();
                          } else if(node.type == "calRHS" || node.type == "calRHS-objvalue"){
                            node.type = "calRHS-objvalue";
                            node.name = $(this).text();
                            node.controlid = $(this).data("controlid");
                            tree.refresh();
                          }  else if(node.type == "casRHS" || node.type == "casRHS-objvalue"){
                            node.type = "casRHS-objvalue";
                            node.name = $(this).text();
                            node.controlid = $(this).data("controlid");
                            if($(this).data("datasourceentitypath")){
                              node.datasourceentitypath = $(this).data("datasourceentitypath");
                            }
                            tree.refresh();
                          } else {
                            tree.addNodes(node,[
                              {
                                id : "control-"+date,
                                pId : node.id,
                                type : "control",
                                name : $(this).text(),
                                controlid : $(this).data("controlid")
                              }
                            ],false);
                          } 
                        }
                        if($(this).hasClass("addobjvalue")){  // 添加一个对象值节点
                          if(node.type=="setLHS" || node.type == "setLHS-objvalue" || node.type == "setLHS-textvalue"){
                            node.type = "setLHS-objvalue";
                            node.controlname = $(this).parent().parent().data("controlname");
                            // 设置值动作左侧表达式改变则清除右侧表达式
                            node.getNextNode().name = "右侧表达式";
                            node.getNextNode().type = "setRHS";
                          } else if(node.type=="calLHSchild" || node.type == "calLHS-objvalue" || node.type == "calLHS-textvalue") {
                            node.type = "calLHS-objvalue";
                          } else if(node.type=="casLHS" || node.type=="casLHS-objvalue") {
                            node.type = "casLHS-objvalue";
                          } else if(node.type=="casRHS" || node.type=="casRHS-objvalue") {
                            node.type = "casRHS-objvalue";
                          } else {
                            node.type = "objvalue";
                          }  

                          if($(this).data("searchval")){
                            node.searchval = $(this).data("searchval");
                          }
                          if($(this).data("showname")){
                            node.showname = $(this).data("showname");
                          } else if(node.showname){
                            delete node.showname;
                          }
                          if($(this).data("setdisable")){
                            node.setdisable = $(this).data("setdisable");
                          } else if(node.setdisable){
                            delete node.setdisable;
                          }
                          if($(this).data("javatype")){
                            node.javatype = $(this).data("javatype");
                          }
                          if($(this).data("mappedby")){
                            node.mappedby = $(this).data("mappedby");
                          }
                          if($(this).data("fktype")){
                            node.fktype = $(this).data("fktype");
                          }
                          if($(this).data("datasourceentitypath")){
                            node.datasourceentitypath = $(this).data("datasourceentitypath");
                          }
                          if($(this).data("searchpath")){
                            node.searchpath = $(this).data("searchpath");
                          }
                          if($(this).data("joincolumnname")){
                            node.joincolumnname = $(this).data("joincolumnname");
                          }
                          if($(this).data("fkrelationtype")){
                            node.fkrelationtype = $(this).data("fkrelationtype");
                          }

                          node.name = $(this).parent().parent().find("span").text()+"."+$(this).text();
                          node.controlid = $(this).parent().parent().data("controlid");
                          node.controltype = $(this).parent().parent().data("controltype");
                          tree.refresh();
                        }
                      }
                       
                      tree.expandAll(true); 
                    });
                  },
                  error: function(data,status){
                    top.$.jBox.alert(data.message, status);
                  }
                });
                
                break;

              case "casRHS": case "casRHS-objvalue":    // 执行动作对象级联右侧表达式节点
                if(node.getPreNode().type=="casLHS-objvalue") {
                  /* 
                   * 根据<LHS>节点的search控件的所有外键属性进行过滤,调用接口从后端获取
                   */
                  $.ajax({                                                                         
                    url: config.getSearchsAttributes,
                    type: "get",
                    contentType: "application/json;charset=utf-8",
                    data:{
                      formId: that.model.collection.models[0].attributes.fields.name.id,
                      datasourceEntityPath: node.getPreNode().searchpath?node.getPreNode().searchpath:-1,
                      fkType: node.getPreNode().fktype?node.getPreNode().fktype:-1,
                      JoinColumnName: node.getPreNode().joincolumnname?node.getPreNode().joincolumnname:-1,
                      mappedBy: node.getPreNode().mappedby?node.getPreNode().mappedby:-1
                    },
                    success:function(data,status){
                      var data = JSON.parse(data), controlEntityPath="";
                      for(var i in data.controls){
                        for(x in that.model.collection.models){
                          if(that.model.collection.models[x].attributes.title == "Search Input" && data.controls[i].name == that.model.collection.models[x].attributes.fields.name.value) {
                            controlEntityPath = that.model.collection.models[x].attributes.fields.datasourceEntityPath.value;
                            data.controls[i].columnName = that.model.collection.models[x].attributes.columnName;
                          }
                        }
                        if(data.controls[i].attributes){
                          if(data.controls[i].columnName && data.controls[i].columnName.indexOf("processVariables_")==0){
                            var submenu = $("<li class='expandable' data-controlid='"+ data.controls[i].columnName+"'><span>"+data.controls[i].viewName+"</span><ul class='sublist'></ul></li>");
                          } else {
                            var submenu = $("<li class='expandable' data-controlid='"+ data.controls[i].columnName+".id'><span>"+data.controls[i].viewName+"</span><ul class='sublist'></ul></li>");  
                          }
                          for(var k in data.controls[i].attributes) {
                            submenu.find(".sublist").append("<li class='exe add addobjvalue' data-searchval='"+data.controls[i].attributes[k].value+"' data-mappedby='"+data.controls[i].attributes[k].mappedBy+"' data-fktype='"+data.controls[i].attributes[k].fkType+"' data-datasourceEntitypath='"+controlEntityPath+"' data-JoinColumnname='"+data.controls[i].attributes[k].JoinColumnName+"'>"+data.controls[i].attributes[k].label+"</li>");  
                          }
                          menu.append(submenu);
                        } else {
                          menu.append("<li class='exe add addcontrol' data-controlid='"+ data.controls[i].columnName+".id' data-datasourceEntitypath='"+controlEntityPath+"'>"+data.controls[i].viewName+"</li>");
                        }
                      }
                      // 为ajax回调生成的菜单绑定事件
                      $(".context-menu li.exe").on("click",function(){  // 菜单处理

                        if($(this).hasClass("add")){  // 添加节点
                          date = Date.parse(new Date())/1000;
                          if($(this).hasClass("addcontrol")){  // 添加一个对象节点
                            if($(this).data("setdisable")){
                              node.setdisable = $(this).data("setdisable");
                            } else if(node.setdisable){
                              delete node.setdisable;
                            }
                            if(node.type == "setRHS" || node.type == "setRHS-objvalue"){
                              node.type = "setRHS-objvalue";
                              node.name = $(this).text();
                              node.controlid = $(this).data("controlid");
                              tree.refresh();
                            } else if(node.type == "calRHS" || node.type == "calRHS-objvalue"){
                              node.type = "calRHS-objvalue";
                              node.name = $(this).text();
                              node.controlid = $(this).data("controlid");
                              tree.refresh();
                            }  else if(node.type == "casRHS" || node.type == "casRHS-objvalue"){
                              node.type = "casRHS-objvalue";
                              node.name = $(this).text();
                              node.controlid = $(this).data("controlid");
                              if($(this).data("datasourceentitypath")){
                                node.datasourceentitypath = $(this).data("datasourceentitypath");
                              }
                              tree.refresh();
                            } else {
                              tree.addNodes(node,[
                                {
                                  id : "control-"+date,
                                  pId : node.id,
                                  type : "control",
                                  name : $(this).text(),
                                  controlid : $(this).data("controlid")
                                }
                              ],false);
                            } 
                          }
                          if($(this).hasClass("addobjvalue")){  // 添加一个对象值节点
                            if(node.type=="setLHS" || node.type == "setLHS-objvalue" || node.type == "setLHS-textvalue"){
                              node.type = "setLHS-objvalue";
                              node.controlname = $(this).parent().parent().data("controlname");
                              // 设置值动作左侧表达式改变则清除右侧表达式
                              node.getNextNode().name = "右侧表达式";
                              node.getNextNode().type = "setRHS";
                            } else if(node.type=="calLHSchild" || node.type == "calLHS-objvalue" || node.type == "calLHS-textvalue") {
                              node.type = "calLHS-objvalue";
                            } else if(node.type=="casLHS" || node.type=="casLHS-objvalue") {
                              node.type = "casLHS-objvalue";
                            } else if(node.type=="casRHS" || node.type=="casRHS-objvalue") {
                              node.type = "casRHS-objvalue";
                            } else {
                              node.type = "objvalue";
                            }  

                            if($(this).data("searchval")){
                              node.searchval = $(this).data("searchval");
                            }
                            if($(this).data("showname")){
                              node.showname = $(this).data("showname");
                            } else if(node.showname){
                              delete node.showname;
                            }
                            if($(this).data("setdisable")){
                              node.setdisable = $(this).data("setdisable");
                            } else if(node.setdisable){
                              delete node.setdisable;
                            }
                            if($(this).data("javatype")){
                              node.javatype = $(this).data("javatype");
                            }
                            if($(this).data("mappedby")){
                              node.mappedby = $(this).data("mappedby");
                            }
                            if($(this).data("fktype")){
                              node.fktype = $(this).data("fktype");
                            }
                            if($(this).data("datasourceentitypath")){
                              node.datasourceentitypath = $(this).data("datasourceentitypath");
                            }
                            if($(this).data("searchpath")){
                              node.searchpath = $(this).data("searchpath");
                            }
                            if($(this).data("joincolumnname")){
                              node.joincolumnname = $(this).data("joincolumnname");
                            }
                            if($(this).data("fkrelationtype")){
                              node.fkrelationtype = $(this).data("fkrelationtype");
                            }

                            node.name = $(this).parent().parent().find("span").text()+"."+$(this).text();
                            node.controlid = $(this).parent().parent().data("controlid");
                            node.controltype = $(this).parent().parent().data("controltype");
                            tree.refresh();
                          }
                        }
                         
                        tree.expandAll(true); 
                      });
                    },
                    error: function(data,status){
                      top.$.jBox.alert(data.message, status);
                    }
                  });
                  /* 
                   * 根据<LHS>节点的search控件的所有外键属性进行过滤 end
                   */
                  menu.append("<li class='exe clear'>清除</li>");
                } else {
                  alert("请先设置左侧表达式！");
                }
                break;

              default:
                console.log("尚未添加对应操作");
            }

            $(".context-menu li.exe").on("click",function(){  // 菜单处理

              if($(this).hasClass("clear")){   //清除当前节点
                if(node.getParentNode().type == "condition"){
                  tree.removeNode(node); 
                } else if(node.getParentNode().type == "set") {
                  if(node.getNextNode()) {
                    node.name = "左侧表达式";
                    node.type = "setLHS";
                  } else {
                    node.name = "右侧表达式";
                    node.type = "setRHS";
                  }
                } else if(node.getParentNode().type == "cal") {
                  if(node.getNextNode()) {
                    node.name = "左侧表达式";
                    node.type = "calLHS";
                    tree.removeChildNodes(node);
                  } else {
                    node.name = "右侧表达式";
                    node.type = "calRHS";
                  }
                } else if(node.getParentNode().type == "acthscalop"){
                  if(node.getNextNode()) {
                    node.type = "calLHSchild";
                    node.name = "左侧表达式";
                    tree.removeChildNodes(node);
                  } else {
                    node.type = "calLHSchild";
                    node.name = "右侧表达式";
                    tree.removeChildNodes(node);
                  }
                } else if(node.getParentNode().type == "cas"){
                  if(node.getNextNode()) {
                    node.type = "casLHS";
                    node.name = "左侧表达式";
                  } else {
                    node.type = "casRHS";
                    node.name = "右侧表达式";
                  }
                } else {
                  if(node.getNextNode()) {
                    node.name = "左侧表达式";
                    node.type = "HS";
                    tree.removeChildNodes(node);
                  } else {
                    node.name = "右侧表达式";
                    node.type = "HS";
                    tree.removeChildNodes(node);
                  }
                }
                tree.refresh();
              }

              if($(this).hasClass("set")){  // 设置当前节点，逻辑在callback.onRename
                tree.editName(node);
              }
              
              if($(this).hasClass("del")){  // 删除当前节点
                tree.removeNode(node);
                tree.refresh();
              }

              if($(this).hasClass("add")){  // 添加节点
                date = Date.parse(new Date())/1000;
                
                if($(this).hasClass("curr")){  // 添加当前用户节点
                  node.type="curr";
                  node.name="当前用户";
                  tree.refresh();
                }

                if($(this).hasClass("addresp")){  // 添加一个响应节点及条件、动作子节点
                  tree.addNodes(node,[
                    {
                      id : "resp-"+date,
                      pId : node.id,
                      type : "response",
                      name : "响应"
                    },
                    {
                      id: "resp-"+date+"-condition",
                      pId : "resp-"+date,
                      type : "condition",
                      name : "执行条件"  
                    },
                    {
                      id: "resp-"+date+"-actlist",
                      pId : "resp-"+date,
                      type : "actlist",
                      name : "执行动作" 
                    }
                  ],false);  
                }
                if($(this).hasClass("addop")){  //在条件节点下添加运算符
                  if($(this).text()=="!"){   // 单元关系运算符
                    tree.addNodes(node,[  
                      {
                        id : "op-"+date,
                        pId : node.id,
                        type : "op",
                        name : $(this).text()
                      },
                      {
                        id : "op-"+date+"-RHS",
                        pId : "op-"+date,
                        type : "HS",
                        name : "右侧表达式"
                      }
                    ],false);  
                  } else {   // 二元关系运算符
                    tree.addNodes(node,[
                      {
                        id : "op-"+date,
                        pId : node.id,
                        type : "op",
                        name : $(this).text()
                      },
                      {
                        id : "op-"+date+"-LHS",
                        pId : "op-"+date,
                        type : "HS",
                        name : "左侧表达式"
                      },
                      {
                        id : "op-"+date+"-RHS",
                        pId : "op-"+date,
                        type : "HS",
                        name : "右侧表达式"
                      }
                    ],false);  
                  }
                }
                if($(this).hasClass("hsaddop")){   // 在表达式内添加运算符
                  if($(this).hasClass("cal")){
                    node.type = "calop";
                  } else {
                    node.type = "op";  
                  }
                  node.name = $(this).text();
                  if($(this).text()=="!"){   // 单元关系运算符
                    tree.addNodes(node,[
                      {
                        id : "op-"+date+"-RHS",
                        pId : "op-"+date,
                        type : "HS",
                        name : "右侧表达式"
                      }
                    ],false);  
                  } else {   // 二元关系运算符
                    tree.addNodes(node,[
                      {
                        id : "op-"+date+"-LHS",
                        pId : node.id,
                        type : "HS",
                        name : "左侧表达式"
                      },
                      {
                        id : "op-"+date+"-RHS",
                        pId : node.id,
                        type : "HS",
                        name : "右侧表达式"
                      }
                    ],false);  
                  }
                  tree.refresh();
                }
                if($(this).hasClass("addobjvalue")){  // 添加一个对象值节点
                  if(node.type=="setLHS" || node.type == "setLHS-objvalue" || node.type == "setLHS-textvalue"){
                    node.type = "setLHS-objvalue";
                    node.controlname = $(this).parent().parent().data("controlname");
                    // 设置值动作左侧表达式改变则清除右侧表达式
                    node.getNextNode().name = "右侧表达式";
                    node.getNextNode().type = "setRHS";
                  } else if(node.type=="calLHSchild" || node.type == "calLHS-objvalue" || node.type == "calLHS-textvalue") {
                    node.type = "calLHS-objvalue";
                  } else if(node.type=="casLHS" || node.type=="casLHS-objvalue") {
                    node.type = "casLHS-objvalue";
                  } else if(node.type=="casRHS" || node.type=="casRHS-objvalue") {
                    node.type = "casRHS-objvalue";
                  } else {
                    node.type = "objvalue";
                  }  

                  if($(this).data("searchval")){
                    node.searchval = $(this).data("searchval");
                  }
                  if($(this).data("showname")){
                    node.showname = $(this).data("showname");
                  } else if(node.showname){
                    delete node.showname;
                  }
                  if($(this).data("setdisable")){
                    node.setdisable = $(this).data("setdisable");
                  } else if(node.setdisable){
                    delete node.setdisable;
                  }
                  if($(this).data("javatype")){
                    node.javatype = $(this).data("javatype");
                  }
                  if($(this).data("mappedby")){
                    node.mappedby = $(this).data("mappedby");
                  }
                  if($(this).data("fktype")){
                    node.fktype = $(this).data("fktype");
                  }
                  if($(this).data("datasourceentitypath")){
                    node.datasourceentitypath = $(this).data("datasourceentitypath");
                  }
                  if($(this).data("searchpath")){
                    node.searchpath = $(this).data("searchpath");
                  }
                  if($(this).data("joincolumnname")){
                    node.joincolumnname = $(this).data("joincolumnname");
                  }
                  if($(this).data("fkrelationtype")){
                    node.fkrelationtype = $(this).data("fkrelationtype");
                  }

                  node.name = $(this).parent().parent().find("span").text()+"."+$(this).text();
                  node.controlid = $(this).parent().parent().data("controlid");
                  node.controltype = $(this).parent().parent().data("controltype");
                  tree.refresh();
                }

                if($(this).hasClass("addact")){    // 添加执行动作
                  if($(this).data("op") == "hide" || $(this).data("op") =="show"){
                    tree.addNodes(node,[
                      {
                        id : "act-"+date,
                        pId : node.id,
                        type : $(this).data("op"),
                        name : $(this).text()
                      },
                    ],false);  
                  } else {
                    tree.addNodes(node,[
                      {
                        id : "act-"+date,
                        pId : node.id,
                        type : $(this).data("op"),
                        name : $(this).text()
                      },
                      {
                        id : "act-"+date+"-LHS",
                        pId : "act-"+date,
                        type : $(this).data("op")+"LHS",
                        name : "左侧表达式"
                      },
                      {
                        id : "act-"+date+"-RHS",
                        pId : "act-"+date,
                        type : $(this).data("op")+"RHS",
                        name : "右侧表达式"
                      }
                    ],false);
                  }
                }

                if($(this).hasClass("acthsaddop")){   // 在计算值动作左侧表达式下添加节点
                  node.type = "acthscalop";
                  node.name = $(this).text();
                  tree.addNodes(node,[
                    {
                      id : "op-"+date+"-LHS",
                      pId : node.id,
                      type : "calLHSchild",
                      name : "左侧表达式"
                    },
                    {
                      id : "op-"+date+"-RHS",
                      pId : node.id,
                      type : "calLHSchild",
                      name : "右侧表达式"
                    }
                  ],false);  
                  tree.refresh();  
                }

                if($(this).hasClass("addcontrol")){  // 添加一个对象节点
                  if($(this).data("setdisable")){
                    node.setdisable = $(this).data("setdisable");
                  } else if(node.setdisable){
                    delete node.setdisable;
                  }
                  if(node.type == "setRHS" || node.type == "setRHS-objvalue"){
                    node.type = "setRHS-objvalue";
                    node.name = $(this).text();
                    node.controlid = $(this).data("controlid");
                    node.controltype = $(this).data("controltype");
                    tree.refresh();
                  } else if(node.type == "calRHS" || node.type == "calRHS-objvalue"){
                    node.type = "calRHS-objvalue";
                    node.name = $(this).text();
                    node.controlid = $(this).data("controlid");
                    node.controltype = $(this).data("controltype");
                    tree.refresh();
                  } else {
                    tree.addNodes(node,[
                      {
                        id : "control-"+date,
                        pId : node.id,
                        type : "control",
                        name : $(this).text(),
                        controlid : $(this).data("controlid"),
                        controltype : $(this).data("controltype")
                      }
                    ],false);  
                  } 
                }
              }
               
              tree.expandAll(true); 
            });  
          }
        }
      };     

      // 初始化树结构
      var tree = $.fn.zTree.init($("#rule-editor"), setting, zNodes);

      // 默认展开全部节点
      tree.expandAll(true); 

      //树的保存和js生成
      $("#saveTree").remove(); // 每次重新生成保存按钮并重新绑定事件避免多次添加事件处理方法
      var newbtn = $("<a id='saveTree' href='javascript:' class='btn btn-primary btn-sm';>保存联动</a>");
      $("p.saveTree").append(newbtn);

      newbtn.click(function(){
        var treeArray = tree.transformToArray(tree.getNodes());
        // 对树进行遍历，生成js并执行验证，发现未设置完整则终止遍历并提示错误
        var firstcond, events = {}, eventjson = {}, eventsjs = [], eventTemp ={name:$("#event-type").val(),js:"",valid:true};

        if(!treeArray[0].children){
          switch($("#event-type").val()){
            case "default":
              that.model.attributes.customjs.default = $("#customjs textarea").val();
              // that.model.attributes.customjs.default = $("#customjs textarea").val().replace(/["']/g, function(qmark){
              //   return "\\"+qmark;}
              // );
              break;

            case "change":
              that.model.attributes.customjs.change = $("#customjs textarea").val();
              // that.model.attributes.customjs.change = $("#customjs textarea").val().replace(/["']/g, function(qmark){
              //   return "\\"+qmark;}
              // );
              break;

            default:
              $("#rule-editor").empty();
              return false;
          }
          console.log(that.model.attributes);  
          top.$.jBox.tip("保存成功！");  
        } else{
          for(var i in treeArray[0].children){
            eventTemp.js = "";

            if(treeArray[0].children[i].children[0].type == "condition"){   // 生成条件的代码
              if(treeArray[0].children[i].children[0].children && treeArray[0].children[i].children[0].children.length>0){
                firstcond = treeArray[0].children[i].children[0].children[0];   // 下面要开始生成用于判断一个checkbox是否被选中的代码
                if(firstcond.name=="=="&&firstcond.children[0].controlid==firstcond.children[1].controlid&&firstcond.children[0].controltype=="checkbox"&&firstcond.children[1].controltype=="checkbox"&&((firstcond.children[0].showname&&!firstcond.children[1].showname)||(firstcond.children[1].showname&&!firstcond.children[0].showname))){
                  if(firstcond.children[0].showname){
                    eventTemp.js = eventTemp.js + "var checkboxNeedJudge; $('[name=\"" + firstcond.children[0].controlid + "\"]').each(function(){if($(this).parents('.checker').next('label').text().trim()=='"
                    + firstcond.children[0].name.split(".")[1] +"'){checkboxNeedJudge=$(this);}}); if(checkboxNeedJudge.is(':checked')){";
                  } else {
                    eventTemp.js = eventTemp.js + "var checkboxNeedJudge; $('[name=\"" + firstcond.children[1].controlid + "\"]').each(function(){if($(this).parents('.checker').next('label').text().trim()=='"
                    + firstcond.children[1].name.split(".")[1] +"'){checkboxNeedJudge=$(this);}}); if(checkboxNeedJudge.is(':checked')){";
                  }
                } else if(firstcond.name=="!="&&firstcond.children[0].controlid==firstcond.children[1].controlid&&firstcond.children[0].controltype=="checkbox"&&firstcond.children[1].controltype=="checkbox"&&((firstcond.children[0].showname&&!firstcond.children[1].showname)||(firstcond.children[1].showname&&!firstcond.children[0].showname))){
                  if(firstcond.children[0].showname){
                    eventTemp.js = eventTemp.js + "var checkboxNeedJudge; $('[name=\"" + firstcond.children[0].controlid + "\"]').each(function(){if($(this).parents('.checker').next('label').text().trim()=='"
                    + firstcond.children[0].name.split(".")[1] +"'){checkboxNeedJudge=$(this);}}); if(!checkboxNeedJudge.is(':checked')){";
                  } else {
                    eventTemp.js = eventTemp.js + "var checkboxNeedJudge; $('[name=\"" + firstcond.children[1].controlid + "\"]').each(function(){if($(this).parents('.checker').next('label').text().trim()=='"
                    + firstcond.children[1].name.split(".")[1] +"'){checkboxNeedJudge=$(this);}}); if(!checkboxNeedJudge.is(':checked')){";
                  }
                } else {   // 其他绝大多数情况
                  eventTemp.js = eventTemp.js + "if(";
                  that.traverse(treeArray[0].children[i].children[0].children[0],eventTemp);
                  eventTemp.js = eventTemp.js + "){";
                } 
              } else {
                eventTemp.js = eventTemp.js + "{";
              }
            } else {
              alert("联动设置错误：每个响应的第一个子节点应该为执行条件！");
              return false;
            }

            if(treeArray[0].children[i].children[1].type == "actlist"){    // 生成动作的代码
              if(treeArray[0].children[i].children[1].children && treeArray[0].children[i].children[1].children.length>0){
                for(var j in treeArray[0].children[i].children[1].children){
                  if(treeArray[0].children[i].children[1].children[j].children && treeArray[0].children[i].children[1].children[j].children.length>0){
                    for(var s in treeArray[0].children[i].children[1].children[j].children){
                      if(!treeArray[0].children[i].children[1].children[j].children[s].children && treeArray[0].children[i].children[1].children[j].children[s].type.indexOf("value")==-1 && treeArray[0].children[i].children[1].children[j].children[s].type.indexOf("control")==-1){
                        alert(treeArray[0].children[i].children[1].children[j].children[s].name + "联动规则设置不完整，请完善后再保存！");
                        eventTemp.valid = false;
                      }  
                    }
                    
                    if(treeArray[0].children[i].children[1].children[j].type == "hide" || treeArray[0].children[i].children[1].children[j].type == "show"){ // 隐藏和显示动作
                      for(var k in treeArray[0].children[i].children[1].children[j].children){
                        if(treeArray[0].children[i].children[1].children[j].children[k].controltype=="title"){
                          eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[k].controlid + "\"]')." + treeArray[0].children[i].children[1].children[j].type + "();";
                        } else if(treeArray[0].children[i].children[1].children[j].children[k].controltype=="file"||treeArray[0].children[i].children[1].children[j].children[k].controltype=="image"){
                          eventTemp.js = eventTemp.js + "$('.upload_" + treeArray[0].children[i].children[1].children[j].children[k].controlid + "').parents('.form-group')." + treeArray[0].children[i].children[1].children[j].type + "();";
                        } else {
                          eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[k].controlid + "\"]').parents('.form-group')." + treeArray[0].children[i].children[1].children[j].type + "();";
                        }
                      }    
                    } else if(treeArray[0].children[i].children[1].children[j].type == "set"){     // 设定值动作
                      if(treeArray[0].children[i].children[1].children[j].children[1].setdisable && treeArray[0].children[i].children[1].children[j].children[0].setdisable){
                        for(var s in that.model.collection.models){
                          if(that.model.collection.models[s].attributes.fields.name && that.model.collection.models[s].attributes.fields.name.value == treeArray[0].children[i].children[1].children[j].children[1].controlid){
                            that.model.collection.models[s].attributes.fields.isEdit.value = true;
                            eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').removeAttr('disabled');";
                          } else if(that.model.collection.models[s].attributes.fields.isEdit){
                            that.model.collection.models[s].attributes.fields.isEdit.value = false;
                          }
                        }  
                      }
                      
                      if(treeArray[0].children[i].children[1].children[j].children[1].controltype=="radio"){  // 设定值 radio特殊处理
                        eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').each(function(){if($(this).parents('.radio').next('label').text().trim()==";
                        that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                        eventTemp.js = eventTemp.js + "){$(this).trigger('click');}});";
                      } else if(treeArray[0].children[i].children[1].children[j].children[1].controltype=="checkbox"){  // 设定值 checkbox特殊处理
                        eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').each(function(){if($(this).parents('.checker').next('label').text().trim()==";
                        that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                        eventTemp.js = eventTemp.js + "){$(this).trigger('click');}});";
                      } else if(treeArray[0].children[i].children[1].children[j].children[1].controltype=="select"){   // 设定值 select特殊处理
                        eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]>option').each(function(){if($(this).text().trim()==";
                        that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                        eventTemp.js = eventTemp.js + "){$(this).parents('select').val($(this).val());}});";
                      } else {
                        // if($("#event-type").val()=="default"){
                        //   eventTemp.js = eventTemp.js + "if(!$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').val()){";
                        //   eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').val(";
                        //   that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                        //   eventTemp.js = eventTemp.js + ");}";
                        // } else {
                          eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').val(";
                          that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                          eventTemp.js = eventTemp.js + ");";  
                        // } 
                      }
                    } else if(treeArray[0].children[i].children[1].children[j].type == "cal"){     //  计算值动作
                      if(treeArray[0].children[i].children[1].children[j].children[1].controltype=="radio"){  // 设定值 radio特殊处理
                        eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').each(function(){if($(this).parents('.radio').next('label').text().trim()==";
                        that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                        eventTemp.js = eventTemp.js + "){$(this).trigger('click');}});";
                      } else if(treeArray[0].children[i].children[1].children[j].children[1].controltype=="checkbox"){  // 设定值 checkbox特殊处理
                        eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').each(function(){if($(this).parents('.checker').next('label').text().trim()==";
                        that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                        eventTemp.js = eventTemp.js + "){$(this).trigger('click');}});";
                      } else if(treeArray[0].children[i].children[1].children[j].children[1].controltype=="select"){   // 设定值 select特殊处理
                        eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]>option').each(function(){if($(this).text().trim()==";
                        that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                        eventTemp.js = eventTemp.js + "){$(this).parents('select').val($(this).val());}});";
                      } else {
                        // if($("#event-type").val()=="default"){
                        //   eventTemp.js = eventTemp.js + "if(!$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').val()){";
                        //   eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').val(";
                        //   that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                        //   eventTemp.js = eventTemp.js + ");}";
                        // } else {
                          eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').val(";
                          that.traverse(treeArray[0].children[i].children[1].children[j].children[0],eventTemp);
                          eventTemp.js = eventTemp.js + ");";  
                        // }  
                      }
                    } else if(treeArray[0].children[i].children[1].children[j].type == "cas"){     //  对象级联
                      for(var s in that.model.collection.models){
                        if(that.model.collection.models[s].attributes.fields.name && that.model.collection.models[s].attributes.fields.name.value == treeArray[0].children[i].children[1].children[j].children[1].controlid){
                          that.model.collection.models[s].attributes.fields.isEdit.value = true;  
                        } else if(that.model.collection.models[s].attributes.fields.isEdit){
                          that.model.collection.models[s].attributes.fields.isEdit.value = false;
                        }
                      }
                      // eventTemp.js = eventTemp.js + "$('[name=\"" + treeArray[0].children[i].children[1].children[j].children[1].controlid + "\"]').removeAttr('disabled').val('').next('input').val('');";
                      eventTemp.js = eventTemp.js + "objectCascade('" + treeArray[0].children[i].children[1].children[j].children[0].controlid + "','"
                                    + treeArray[0].children[i].children[1].children[j].children[1].controlid + "','"
                                    + treeArray[0].children[i].children[1].children[j].children[0].datasourceentitypath + "','"
                                    + treeArray[0].children[i].children[1].children[j].children[0].fktype + "','"
                                    + treeArray[0].children[i].children[1].children[j].children[0].searchval;
                      if(treeArray[0].children[i].children[1].children[j].children[1].searchval){
                        eventTemp.js = eventTemp.js + "','" + treeArray[0].children[i].children[1].children[j].children[1].datasourceentitypath + "','" + treeArray[0].children[i].children[1].children[j].children[0].fkrelationtype + "','" + treeArray[0].children[i].children[1].children[j].children[1].searchval + "');";  
                      } else {
                        eventTemp.js = eventTemp.js + "','" + treeArray[0].children[i].children[1].children[j].children[1].datasourceentitypath + "','" + treeArray[0].children[i].children[1].children[j].children[0].fkrelationtype + "',-1);";
                      }
                    } 
                  } else {
                    alert("还没有添加"+treeArray[0].children[i].children[1].children[j].name+"动作的执行对象！");
                    return false;  
                  }
                  
                }
                eventTemp.js = eventTemp.js + "};"
              } else {
                alert("还没有添加联动响应执行动作！");
                return false;  
              }
            } else {
              alert("联动设置错误：每个响应的第二个子节点应该为执行动作！");
              return false;
            }

            if(eventTemp.valid==true){
              eventsjs.push({
                name: eventTemp.name,
                js: eventTemp.js
              });  
            } else {
              return false;
            }
          }

          if(that.model.attributes.eventjson){
            eventjson = that.model.attributes.eventjson;
          }
          if(that.model.attributes.events){
            events = that.model.attributes.events;
          }
          switch($("#event-type").val()){
            case "default":
              eventjson.default = JSON.stringify(tree.getNodes());
              events.default = eventsjs;
              that.model.attributes.customjs.default = $("#customjs textarea").val();
              // that.model.attributes.customjs.default = $("#customjs textarea").val().replace(/["']/g, function(qmark){
              //   return "\\"+qmark;}
              // );
              break;

            case "change":
              eventjson.change = JSON.stringify(tree.getNodes());
              events.change = eventsjs;
              that.model.attributes.customjs.change = $("#customjs textarea").val();
              // that.model.attributes.customjs.change = $("#customjs textarea").val().replace(/["']/g, function(qmark){
              //   return "\\"+qmark;}
              // );
              break;

            default:
              $("#rule-editor").empty();
              return false;
          }
          that.model.attributes.eventjson = eventjson; //将树以json形式保存到控件attributes中
          that.model.attributes.events = events;
          console.log(treeArray);
          console.log(that.model.attributes);  
          top.$.jBox.tip("保存成功！");
        }
      });
    }
    , traverse: function(node,strtemp){
      if(!node.children){
        if(node.type.indexOf("value")==-1 && node.type.indexOf("control")==-1 && node.type.indexOf("curr")==-1){
          alert(node.name+"节点联动规则设置不完整，请完善后再保存！");
          strtemp.valid = false;
        }
      }
      
      if(node.children&&node.children.length==2){
        this.traverse(node.children[0],strtemp);
      }
      // {if(node.getParentNode())}
      if((node.getParentNode().type=="calop"||node.getParentNode().type=="acthscalop")&&(!node.children||node.children.length==0)){
        if(node.showname){
          if(node.name.split('.')[1]){
            strtemp.js = strtemp.js + "parseFloat('" + node.name.split('.')[1] + "')";
          } else {
            alert(node.name+"控件选项值获取不正确，请完善后再保存！");
            strtemp.valid = false;  
          }
        } else if(node.controlid){
          if(node.controltype=="radio"){  // radio控件特殊处理
            strtemp.js = strtemp.js + "parseFloat($('[name=\"" + node.controlid +"\"]:checked')"; 
            if(node.name.split('.')[1]){
              if(node.searchval){
                strtemp.js = strtemp.js + ".attr('" + node.searchval + "'))";  
              } else {
                strtemp.js = strtemp.js + ".parents('.radio').next('label').text().trim())";
              }
            }   
          } else if(node.controltype=="select"){  // select控件特殊处理
            strtemp.js = strtemp.js + "parseFloat($('[name=\"" + node.controlid +"\"]>option:selected')"; 
            if(node.name.split('.')[1]){
              if(node.searchval){
                strtemp.js = strtemp.js + ".attr('" + node.searchval + "'))";  
              } else {
                strtemp.js = strtemp.js + ".text().trim())";
              }
            } 
          } else if(node.controltype=="checkbox"){  // checkbox控件特殊处理
            strtemp.js = strtemp.js + "parseFloat($('[name=\"" + node.controlid +"\"]:checked')"; 
            if(node.name.split('.')[1]){
              if(node.searchval){
                strtemp.js = strtemp.js + ".attr('" + node.searchval + "'))";  
              } else {
                strtemp.js = strtemp.js + ".parents('.checker').next('label').text().trim())";
              }
            }
          } else {
            strtemp.js = strtemp.js + "parseFloat($('[name=\"" + node.controlid +"\"]')"; 
            if(node.name.split('.')[1]){
              if(node.searchval){
                strtemp.js = strtemp.js + ".attr('" + node.searchval + "'))";  
              } else {
                strtemp.js = strtemp.js + ".val())";
              }
            }  
          } 
        } else {
          if(/^\-?[0-9]+.?[0-9]*$/.test(node.name)){
            strtemp.js = strtemp.js + node.name;
          } else {
            strtemp.js = strtemp.js + "parseFloat('" + node.name + "')";  
          }     
        }
      } else {
        if(node.type=="curr"){
          strtemp.js = strtemp.js + "'${UserUtils.getUser().getId()}'"; //${session.user.id}
        } else if(node.type=="textvalue"){
          if(/^\-?[0-9]+.?[0-9]*$/.test(node.name)){
            strtemp.js = strtemp.js + node.name;
          } else {
            strtemp.js = strtemp.js + "'" + node.name + "'";  
          }
        } else if(node.showname){
          if(node.name.split('.')[1]){
            strtemp.js = strtemp.js + "'" + node.name.split('.')[1] + "'";
          } else {
            alert(node.name+"控件选项值获取不正确，请完善后再保存！");
            strtemp.valid = false;  
          }
        } else if(node.controlid){
          if(node.controltype=="radio"){  // radio控件特殊处理
            strtemp.js = strtemp.js + "$('[name=\"" + node.controlid +"\"]:checked')"; 
            if(node.name.split('.')[1]){
              if(node.searchval){
                strtemp.js = strtemp.js + ".attr('" + node.searchval + "')";  
              } else {
                strtemp.js = strtemp.js + ".parents('.radio').next('label').text().trim()";
              }
            }   
          } else if(node.controltype=="select"){  // select控件特殊处理
            strtemp.js = strtemp.js + "$('[name=\"" + node.controlid +"\"]>option:selected')"; 
            if(node.name.split('.')[1]){
              if(node.searchval){
                strtemp.js = strtemp.js + ".attr('" + node.searchval + "')";  
              } else {
                strtemp.js = strtemp.js + ".text().trim()";
              }
            } 
          } else if(node.controltype=="checkbox"){  // checkbox控件特殊处理
            strtemp.js = strtemp.js + "$('[name=\"" + node.controlid +"\"]:checked')"; 
            if(node.name.split('.')[1]){
              if(node.searchval){
                strtemp.js = strtemp.js + ".attr('" + node.searchval + "')";  
              } else {
                strtemp.js = strtemp.js + ".parents('.checker').next('label').text().trim()";
              }
            }
          }
          // else if(node.controltype == "search" && node.getNextNode.type == "curr"){
          //   strtemp.js = strtemp.js + "$('[name=\"" + node.controlid +"\"]').next('.searchInput').val()";  
          // } 
          else {
            strtemp.js = strtemp.js + "$('[name=\"" + node.controlid +"\"]')"; 
            if(node.name.split('.')[1]){
              if(node.searchval){
                strtemp.js = strtemp.js + ".attr('" + node.searchval + "')";  
              } else {
                strtemp.js = strtemp.js + ".val()";
              }
            }  
          } 
        } else {
          if(/^\-?[0-9]+.?[0-9]*$/.test(node.name)||node.type=="op"||node.type=="calop"||node.type=="acthscalop"){
            strtemp.js = strtemp.js + node.name;
          } else {
            strtemp.js = strtemp.js + "'" + node.name + "'";  
          }     
        }  
      }
      
      if(node.children&&node.children.length==2){
        this.traverse(node.children[1],strtemp);
      } else if(node.children&&node.children.length==1){
        this.traverse(node.children[0],strtemp);
      }
    }
    , getType: function(title) {
      var type = null;
      var title = title.toLowerCase().replace(/\W/g,'');
      switch(title){
        case "dateinput":
          type = "date";
          break;
        case "datetimeinput":
          type = "datetime";
          break;
        case "filebutton":
          type = "file";
          break;
        case "imagebutton":
          type = "image";
          break;
        case "inputhidden":
          type = "hidden";
          break;
        case "multiplecheckboxes": case "multiplecheckboxesinline":
          type = "checkbox";
          break;
        case "multipleradios": case "multipleradiosinline":
          type = "radio";
          break;
        case "selectbasic": case "selectmultiple":
          type = "select";
          break;
        case "tablelist": case "flowtablelist":
          type = "table";
          break;
        case "textarea":
          type = "textarea";
          break;
        case "textinput":
          type = "text";
          break;
        case "searchinput":
          type = "search";
          break;
        case "sectiontitle":
          type = "title";
          break;
      }
      return type;
    }
    , preventPropagation: function(e) {
      e.stopPropagation();
      e.preventDefault();
    }
  });
});