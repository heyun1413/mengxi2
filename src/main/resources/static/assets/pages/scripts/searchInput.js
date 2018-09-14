function rowIdGen(tbl){
    for(var i = 0; i < $(tbl).find("tr").length; i++){
        $(tbl).find("tr").eq(i).find(".rowid").text(i);    
    }
}

$(document).ready(function(){
	//新增table(业务table)
	$(".tableAddRowForAccountAdd").click(function(){
		var index=0;
		var url = $(this).data("url");
		var isedit = $(this).siblings("a").eq(0).data("isedit");
		var title = $(this).text();
		var thisBtn = $(this);
		var tableName = $(this).data("columnname");
		var tbl = $(this).parent("p").siblings("table"),tmp;//找table
		var isRollBack = tbl.data("isrollback");
		tmp = tbl.find("th").eq(1);//找第1个th
		var thCount = 0;
		var columnnames = [];
		tbl.find("th").each(function(){
			if(thCount > 0) {
				var columnname = $(this).data("columnname");
				if(typeof(columnname) != 'undefined'){
					columnnames.push(columnname);
				}
			}
			thCount++;
		});
		top.$.jBox.open("iframe:"+url, title, $(top.window).width()-200, $(top.window).height()-200, {
          buttons:{"确定":"ok"}, submit:function(v, h, f){
            if (v=="ok"){
            	var entityId = h.find("iframe").contents().find("#entityId").val();
                var entityPath = h.find("iframe").contents()[0].URL.split("/")[5];
                var upperEntityPath = entityPath.substring(0,1).toUpperCase() + entityPath.substring(1);
                var wholePath = "com.thinkgem.jeesite.accountModules."+entityPath+"AutoModules.entity."+upperEntityPath;
                if(entityPath.indexOf("account") == -1){
                	wholePath = "com.thinkgem.jeesite.modules." + entityPath.toLowerCase() + ".entity." + upperEntityPath;
                }
                
                if(entityId) {
                    $.ajax({
                        type : "POST",
                        url : contextRoot+"/commonController/getEntityData",
                        data : {
                            id: entityId,
                            entityPath: wholePath,
                            entityColumnName: columnnames.join(","),
                            flag:'1',
                            columnName:tableName
                        },
                        success : function(data) {
                        	var data0=JSON.parse(data);
                            var newTr=$("<tr data-middleid='" + data0.middleId + "'></tr>");
                            newTr.attr("id",entityId);
                            newTr.append("<td style='display:none;'><input type='hidden' name='"+tmp.data("name")+"["+index+"].id' value='"+entityId+"'></input></td>");
                            newTr.append("<td style='vertical-align:middle;'><span onclick='javascript:var tbl=$(this).parents(&apos;table&apos;); removeRow($(this));rowIdGen(tbl);return false;' class='close'></span></td>");
                            newTr.append("<td class='rowid' style='vertical-align:middle;width:40px;text-align:center;'></td>");

                            // 处理ajax请求数据
                            for(columnname in columnnames) {
                                for(var i in data0){
                                    if(i==columnnames[columnname] && i!="status"){
                                        newTr.append("<td>"+ data0[i] +"</td>");
                                    }
                                    if(i==columnnames[columnname] && i=="status"){
                                        newTr.append("<td>"+ data0.status +"</td>");
                                    }
                                }
                            }

                            var iseditStr = "<td>";
                            var editUrl = url.replace("auto_account_entities/AutoAccountEntity/getAccountType", entityPath + "/form");
                            if(isedit == true) {
                            	if(editUrl.indexOf("flag=0") > -1){
                        			editUrl = editUrl.replace("flag=0", "flag=1");
                        		}
                            	if(editUrl.indexOf("isRollBack=") == -1){
                            		editUrl += "&isRollBack=" + isRollBack;
                            	}
                                iseditStr += "<a  class='tableAddRowForMoreAccountEdit' data-type='0' data-columnname='" + tableName + "' data-entityPath='" + wholePath + "' data-columnnames='" + columnnames + "' data-id='" + entityId +"' data-path='" + entityPath + "' data-url='"+editUrl + "&id=" + entityId + "&type=0'>编辑</a>";
                            }
                            var seeUrl = "";
                            if(url.indexOf("auto_account_entities/AutoAccountEntity/getAccountType") > -1){
                            	seeUrl = url.replace("auto_account_entities/AutoAccountEntity/getAccountType", entityPath + "/getCheckform");
                            } else{
                            	seeUrl = url.replace("form", "getCheckform");
                            }
                            if(seeUrl.indexOf("id=") == -1){
                        		seeUrl += "&id=" + entityId;
                        	}
                            
                            iseditStr += "   <a  class='tableView' data-url='" + seeUrl + "'>查看</a>";
                            
                            //iseditStr +="   <a  class='tableDelete' data-url='/zbitil/a/auto_business_middle_table/autoBusinessMiddleTable/doDelete" + 
                    		//"' onclick='javascript:removeRow($(this));return false;' data-isrollback='" + isRollBack + "' data-id='" + entityId + "' data-classpath='" + wholePath + "'>删除</a></td>";
                            newTr.append(iseditStr);
                            tbl.append(newTr);
                            rowIdGen(tbl);     
                        },
                        error : function() {
                            top.$.jBox.info('请求数据失败');
                        }
                    });
                }
            }  
          }, loaded:function(h){
        	  var framecode = "jbox-iframe"+(new Date().getTime()); 
              h.find("iframe").attr("name", framecode);
              h.find("iframe").attr("id", framecode);
              top.document.getElementById(framecode).contentWindow.name = framecode;
        	  
              $(".jbox-content", top.document).css("overflow-y","hidden");
              h.find("iframe").contents().find("#frameId").val(window.name);
              $(".jbox-button", top.document).addClass("hidden");
          }
        });
	});
	
	$("body").on("click",".tableAddRowForAccountEdit",function(){
		var index=0;
		var aUrl = $(this).siblings("a").data("url");
		var url = $(this).data("url");
		var thisTr= $(this).parent().parent();
		var tbl= $(this).parent().parent().parent().parent();
		//var tbl = $(this).siblings("table"),tmp;//找table
		tmp = tbl.find("th").eq(1);//找第1个th
		var title = "编辑" + tbl.siblings("a").eq(0).text().substring(2);
		var isedit = tbl.siblings("a").eq(1).data("isedit");
		var isRollBack = tbl.data("isrollback");
		var isDelete = tbl.data("isdelete");
		var path = $(this).data("path");
		var tableName = $(this).data("columnname");
		var thCount = 0;
		var columnnames = [];
		tbl.find("th").each(function(){
			if(thCount > 0) {
				var columnname = $(this).data("columnname");
				if(typeof(columnname) != 'undefined'){
					columnnames.push(columnname);
				}
			}
			thCount++;
		});
		top.$.jBox.open("iframe:"+url, title, $(top.window).width()-200, $(top.window).height()-200, {
          buttons:{"确定":"ok"}, submit:function(v, h, f){
            if (v=="ok"){
            	var selectedIds = thisTr.attr("id");
            	if(typeof(selectedIds) != 'undefined') {
                    var ajaxurl = contextRoot+"/commonController/getEntityData?path=" + path;
	            	$.ajax({
	                    type : "POST",
	                    url : ajaxurl,
	                    data : {
	                        id: selectedIds,
	                        entityColumnName: columnnames.join(","),
	                        columnName:tableName
	                    },
	                    success : function(data) {
	                    	var data0=JSON.parse(data);
                            var newTr=$("<tr data-middleid='" + data0.middleId + "'></tr>");
	                        newTr.attr("id",selectedIds);
	                        newTr.append("<td style='display:none;'><input type='hidden' name='"+tmp.data("name")+"["+index+"].id' value='"+selectedIds+"'></input></td>");
	                        newTr.append("<td style='vertical-align:middle;'><span onclick='javascript:var tbl=$(this).parents(&apos;table&apos;); removeRow($(this));return false;' class='close'></span></td>");    
	                        newTr.append("<td class='rowid' style='vertical-align:middle;width:40px;text-align:center;'></td>");
	
	                        for(columnname in columnnames) {
	                            for(var i in data0){
	                                if(i==columnnames[columnname] && i!="status"){
	                                    newTr.append("<td>"+ data0[i] +"</td>");
	                                }
	                                if(i==columnnames[columnname] && i=="status"){
	                                    newTr.append("<td>"+ data0.status +"</td>");
	                                }
	                            	if(columnnames[columnname] == "状态" && i=="status"){
	                            		statusTd.text(data0.status);
	                            	}
	                            }
	                        }
	                        
	                        var entityPath = data0.entityPath;
	                            if(viewurlid){
	                                var iseditStr = "<td>";
	                                	var editUrl = url;
	                            		if(editUrl.indexOf("flag=0") > -1){
	                            			editUrl = editUrl.replace("flag=0", "flag=1");
	                            		}
	                            		editUrl = editUrl.replace("auto_account_entities/AutoAccountEntity/getAccountType", entityPath + "/form");
	                                    iseditStr += "<a  class='tableAddRowForMoreAccountEdit' data-columnname='" + tableName + "' data-columnnames='" + columnnames + "' data-id='" + entityId +"' data-path='" + entityPath + "' data-url='"+editUrl + "&id=" + selectedIds +"'>编辑</a>";
	                                
	                                var seeUrl = aUrl.replace("auto_account_entities/AutoAccountEntity/getAccountType", entityPath + "/getCheckform");
	                                
	                                console.log("seeUrl:" + seeUrl);
	                                iseditStr += "   <a class='tableView' data-url='"+seeUrl + "&id=" + selectedIds +"'>查看</a>";
	                                
	                                if(isRollBack == '1'){
                                		var modifiedUrl = url.replace("form", "formModified");
                                        iseditStr += "   <a class='tableModified' data-url='"+modifiedUrl + "&id=" + selectedIds +"&type=1'>比较</a>";
                                	}
	                                
	                                var upperEntityPath = entityPath.substring(0,1).toUpperCase() + entityPath.substring(1);
	                                var wholePath = "com.thinkgem.jeesite.accountModules."+entityPath+"AutoModules.entity."+upperEntityPath;
	                                if(isDelete == "1"){
	                                	iseditStr +="   <a  class='tableDelete' data-url='/zbitil/a/auto_business_middle_table/autoBusinessMiddleTable/doDelete" + 
	                                		"' onclick='javascript:removeRow($(this));return false;' data-isrollback='" + isRollBack + "' data-id='" + selectedIds + "' data-classpath='" + wholePath + "'>删除</a></td>";
	                                }
	                                
	                                newTr.append(iseditStr);
	                            }
	                        thisTr.remove();
	                        tbl.append(newTr);
	                        rowIdGen(tbl);  
	                    },
	                    error : function() {
	                        alert('请求数据失败');
	                    }
	                });
            	  }
//                newTr.attr("id",entityId);
//                newTr.append("<td style='display:none;'><input type='hidden' name='"+tmp.data("name")+"["+index+"].id' value='"+entityId+"'></input></td>");
//                newTr.append("<td style='vertical-align:middle;'><span onclick='var tbl=$(this).parents(&apos;table&apos;); $(this).parents(&apos;tr&apos;).remove();rowIdGen(tbl);' class='close'></span></td>");
//                newTr.append("<td class='rowid' style='vertical-align:middle;width:40px;text-align:center;'></td>");
//
//                for(columnname in columnnames) {
//                	var obj = h.find("iframe").contents().find("[name='" + columnnames[columnname] + "']");
//                	var value = obj.val();
//                	if(typeof(value) == 'undefined'){//处理后缀为.id的情况
//                		obj = h.find("iframe").contents().find("[name='" + columnnames[columnname] + ".id']");
//                		value = obj.val();
//                	}
//                	if(typeof(value) == 'undefined'){
//                		value = "";
//                	}
//                	if(obj.attr("id") == "servicesubcategoryIdValue") {//searchIput
//                		value = obj.siblings("#servicesubcategoryId").val();
//                	}
//                	newTr.append("<td>"+ value +"</td>");
//                }
//	       		newTr.append(thisTr.children().last());
//                thisTr.remove();
//                tbl.append(newTr);
//                rowIdGen(tbl); 
            }  
          }, loaded:function(h){
        	  	var framecode = "jbox-iframe"+(new Date().getTime()); 
        	  	h.find("iframe").attr("name", framecode);
        	  	h.find("iframe").attr("id", framecode);
        	  	top.document.getElementById(framecode).contentWindow.name = framecode;
              
	            $(".jbox-content", top.document).css("overflow-y","hidden");
	            h.find("iframe").contents().find("#frameId").val(window.name);
	            $(".jbox-button", top.document).addClass("hidden");
          }
        });
	});

	$("body").on("click",".tableAddRowForMoreAccountEdit",function(){
		var index=0;
		var aUrl = $(this).siblings("a").data("url");
		var url = $(this).data("url");
		var type = $(this).data("type");
		//var isedit = $(this).data("isedit");
		var title = $(this).data("title");
		var thisBtn = $(this);
		var tbl = $(this).parents("table"),tmp;//找table
		var isRollBack = tbl.data("isrollback");
		var isDelete = tbl.data("isdelete");
		var selectedIds = $(this).data("id");
		var selectedPath = $(this).data("path");
		var entityPath = $(this).data("entitypath");
		var tableName = $(this).data("columnname");
		var columnnamesTemp = $(this).data("columnnames");
		var columnnames = columnnamesTemp.split(",");
		if(tbl.find("#deleteId").length>0){
            tmp = tbl.find("th").eq(1); //找第1个th 
        } else {
            tmp = tbl.find("th").eq(0);
        }
		var ths = tbl.find("th");
		var statusIndex = 0;
		for(var i = 1; i < ths.length; i++){
			if(ths.eq(i).text() == "状态"){
				statusIndex = i;
				break;
			}
		}
		var statusTd = $(this).parents("tr").find("td").eq(statusIndex + 1);
		var thisTr = $(this).parents("tr");
//		var ids="";
//		tbl.find("tbody>tr").each(function(){
//			if($(this).attr("id")){
//				ids += $(this).attr("id")+",";
//			}	
//		})
//		if(ids.charAt(ids.length-1) == ',') {
//			// ids = ids.slice(0,-1);
//        } 
//        var columnnames = [];
//        tbl.find("th").each(function(){
//            if($(this).data("columnname")) {
//                var columnname = $(this).data("columnname");
//                columnnames.push(columnname);
//            }
//        });
        var viewurlid = tbl.find("#viewurlid").data("url");

		top.$.jBox.open("iframe:"+url, title, $(top.window).width()-200, $(top.window).height()-200, {
          buttons:{"确定":"ok"}, submit:function(v, h, f){
            if (v=="ok"){
                var selectedIds = h.find("iframe").contents().find("#entityId").val();//表格实体的id

                if(typeof(selectedIds) != 'undefined') {
                    var ajaxurl = contextRoot+"/commonController/getEntityData?entityPath=" + entityPath;
                    
                    $.ajax({
                        type : "POST",
                        url : ajaxurl,
                        data : {
                            id: selectedIds,
                            entityColumnName: columnnames.join(","),
                            columnName:tableName
                        },
                        success : function(data) {
                        	var data0=JSON.parse(data);
                            var newTr=$("<tr data-middleid='" + data0.middleId + "'></tr>");
                            newTr.attr("id",selectedIds);
                            newTr.append("<td style='display:none;'><input type='hidden' name='"+tmp.data("name")+"["+index+"].id' value='"+selectedIds+"'></input></td>");
                            newTr.append("<td style='vertical-align:middle;'><span onclick='javascript:var tbl=$(this).parents(&apos;table&apos;); removeRow($(this));return false;' class='close'></span></td>");    
                            newTr.append("<td class='rowid' style='vertical-align:middle;width:40px;text-align:center;'></td>");

                            for(columnname in columnnames) {
                                for(var i in data0){
                                    if(i==columnnames[columnname] && i!="status"){
                                        newTr.append("<td>"+ data0[i] +"</td>");
                                    }
                                    if(i==columnnames[columnname] && i=="status"){
                                        newTr.append("<td>"+ data0.status +"</td>");
                                    }
                                	if(columnnames[columnname] == "状态" && i=="status"){
                                		statusTd.text(data0.status);
                                	}
                                }
                            }
                            
                            var entityPath = data0.entityPath;
                            var tempType = "1";
                            if(type == '0'){
                            	tempType = 0;
                            }
                            //if(type == "account") {
                                if(viewurlid){
                                    var iseditStr = "<td>";
                                    //if(isedit == true) {
                                    	var editUrl = url;
                                		if(editUrl.indexOf("flag=0") > -1){
                                			editUrl = editUrl.replace("flag=0", "flag=1");
                                		}
                                		editUrl = editUrl.replace("auto_account_entities/AutoAccountEntity/getAccountType", entityPath + "/form");
                                        iseditStr += "<a  class='tableAddRowForMoreAccountEdit' data-columnname='" + tableName + "' data-entityPath='" + entityPath + "' data-type='" + tempType + "' data-columnnames='" + columnnames + "' data-id='" + entityId +"' data-path='" + entityPath + "' data-url='"+editUrl + "&id=" + selectedIds +"'>编辑</a>";
                                   // }
                                    
                                    var seeUrl = aUrl.replace("auto_account_entities/AutoAccountEntity/getAccountType", entityPath + "/getCheckform");
                                    
                                    console.log("seeUrl:" + seeUrl);
                                    iseditStr += "   <a class='tableView' data-url='"+seeUrl + "&id=" + selectedIds +"'>查看</a>";
                                    
                                    
                                    
                                    if(type != '0'){
                                    	if(isRollBack == '1'){
                                    		var modifiedUrl = url.replace("form", "formModified");
	                                        iseditStr += "   <a class='tableModified' data-url='"+modifiedUrl + "&id=" + selectedIds +"&type=1'>比较</a>";
                                    	}
                                        
                                    	var upperEntityPath = entityPath.substring(0,1).toUpperCase() + entityPath.substring(1);
                                    	var wholePath = "com.thinkgem.jeesite.accountModules."+entityPath+"AutoModules.entity."+upperEntityPath;
                                    	if(isDelete == "1"){
                                    		iseditStr +="   <a  class='tableDelete' data-url='/zbitil/a/auto_business_middle_table/autoBusinessMiddleTable/doDelete" + 
                                    		"' onclick='javascript:removeRow($(this));return false;' data-isrollback='" + isRollBack + "' data-id='" + selectedIds + "' data-classpath='" + wholePath + "'>删除</a></td>";
                                    	}
                                    	
                                    }
                                    
                                    newTr.append(iseditStr);
                                }
//                            } else if(type != "account") {//流程table 需写为if(type == "flow")                           	
//                                if(viewurlid){
//                                    var iseditStr = "<td>";
//                                    if(isedit == true) {
//                                         iseditStr += "<a  class='tableAddRowForAccountEdit' data-url='"+aUrl + "?id=" + selectedIds +"'>编辑</a>";
//                                    }
//                                    var seeUrl = aUrl.substring(0,aUrl.length-4) + "myTicketCheckFormForTable";
//                                    iseditStr += "<a class='tableView' data-url='"+viewurlid+selectedIds+"'>查看</a></td>";
//                                    newTr.append(iseditStr);
//                                }
//                            	
//                            }thisTr
                            thisTr.remove();
                            tbl.append(newTr);
                            rowIdGen(tbl);  
                        },
                        error : function() {
                            alert('请求数据失败');
                        }
                    });
                }
            }  
          }, loaded:function(h){
        	  	var framecode = "jbox-iframe"+(new Date().getTime()); 
        	  	h.find("iframe").attr("name", framecode);
        	  	h.find("iframe").attr("id", framecode);
        	  	top.document.getElementById(framecode).contentWindow.name = framecode;
              	
	            $(".jbox-content", top.document).css("overflow-y","hidden");
	            h.find("iframe").contents().find("#frameId").val(window.name);
	            $(".jbox-button", top.document).addClass("hidden");
          }
        });
	})
	
    $("body").on("click",".tableView",function(){
        var url = $(this).data("url");
        var tbl= $(this).parent().parent().parent().parent();
        var title = "查看" + tbl.siblings("a").eq(0).text().substring(2);
        top.$.jBox.open("iframe:"+url, title, $(top.window).width()-200, $(top.window).height()-200, {
          buttons:{"确定":"ok"}, loaded:function(h){
        	  var framecode = "jbox-iframe"+(new Date().getTime()); 
              h.find("iframe").attr("name", framecode);
              h.find("iframe").attr("id", framecode);
              top.document.getElementById(framecode).contentWindow.name = framecode;
              
              $(".jbox-content", top.document).css("overflow-y","hidden");
          }
        });
    });
	
	$("body").on("click",".tableModified",function(){
        var url = $(this).data("url");
        var tbl= $(this).parent().parent().parent().parent();
        var title = "比较" + tbl.siblings("a").eq(0).text().substring(2);
        top.$.jBox.open("iframe:"+url, title, $(top.window).width()-200, $(top.window).height()-200, {
          buttons:{"确定":"ok"}, loaded:function(h){
        	  var framecode = "jbox-iframe"+(new Date().getTime()); 
              h.find("iframe").attr("name", framecode);
              h.find("iframe").attr("id", framecode);
              top.document.getElementById(framecode).contentWindow.name = framecode;
              
              $(".jbox-content", top.document).css("overflow-y","hidden");
          }
        });
    });
	
	/* 
     * 新增的table控件 (至少流程在使用)
    */
	$(".tableAddRowForBusiness").click(function(){
		var index=0;
		var url = $(this).data("url");
		var title = $(this).text();
		var thisBtn = $(this);
		var tbl = $(this).parent("p").siblings("table"),tmp,delth;//找table
        if(tbl.find("#deleteId").length>0){
            tmp = tbl.find("th").eq(1); //找第1个th 
            delth = true;   
        } else {
            tmp = tbl.find("th").eq(0);
            delth = false;
        }
		
		var columnnames = [];
		tbl.find("th").each(function(){
			if($(this).data("columnname")) {
				var columnname = $(this).data("columnname");
				columnnames.push(columnname);
			}
		});
        var viewurlid = tbl.find("#viewurlid").data("url");
		
        top.$.jBox.open("iframe:"+url, title, $(top.window).width()-200, $(top.window).height()-200, {
            buttons:{"确定":"ok"}, submit:function(v, h, f){
                if (v=="ok"){
                	var entityId = h.find("iframe").contents().find("#entityId").val();
                	var entityName = h.find("iframe").contents().find("#entityName").val();
                	var list = [];
                	var newTr=$("<tr></tr>");
                    newTr.attr("id",entityId);
                    
                    $.ajax({
                        type : "POST",
                        url : contextRoot+"/"+entityName+"/getByIdJson",
                        data : {
                            id: entityId,
                            entityColumnName: columnnames.join(",")
                        },
                        success : function(data) {
                            newTr.append("<td style='display:none;'><input type='hidden' name='"+tmp.data("name")+"["+index+"].id' value='"+entityId+"'></input></td>");
                            if(delth){
                                newTr.append("<td style='vertical-align:middle;'><span onclick='var tbl=$(this).parents(&apos;table&apos;); $(this).parents(&apos;tr&apos;).remove();rowIdGen(tbl);' class='close'></span></td>");    
                            }
                            newTr.append("<td class='rowid' style='vertical-align:middle;width:40px;text-align:center;'></td>");
                            // 处理ajax请求数据
                            for(columnname in columnnames) {
                            	var data0=JSON.parse(data);
                            	for(var i in data0){
                            		if(i==columnnames[columnname]){
                            			newTr.append("<td>"+ data0[i] +"</td>");
                            		}
                            	}
                            }

                            if(viewurlid){
                                newTr.append("<td><a class='tableView' data-url='"+viewurlid+entityId+"'>查看</a></td>");
                            }
                            tbl.append(newTr); 
                            rowIdGen(tbl);     
                        },
                        error : function() {
                            alert('请求数据失败');
                        }
                    });
                }  
            }, loaded:function(h){
            	var framecode = "jbox-iframe"+(new Date().getTime()); 
                h.find("iframe").attr("name", framecode);
                h.find("iframe").attr("id", framecode);
                top.document.getElementById(framecode).contentWindow.name = framecode;
            	
                $(".jbox-content", top.document).css("overflow-y","hidden");
                h.find("iframe").contents().find("#frameId").val(window.name);
                $(".jbox-button", top.document).addClass("hidden");
            }
        });
	});
	
	$(".tableInput,.businessTableInput").click(function(){
		//var classes = $(this)[0].classList.value;
		//console.log(classes);
		var index=0;
		var aUrl = $(this).siblings("a").data("url");
		var url = $(this).data("url");
		var classFlag = 0;//流程table
		var treeFlag = 0;//关联是否是多台账
		/*if(classes.indexOf("businessTableInput") > -1){
			classFlag = 1;
		}*/
		if($(this).hasClass("businessTableInput")){
			classFlag = 1;
			if(url.indexOf("autoSource") == -1){
				treeFlag = 1;
			}
		}
		

		var orderId = $(this).data("orderid");
		var tableName = $(this).data("tablename");
		var entityPath = $(this).data("path");
		var type = $(this).data("type");
		var isedit = $(this).data("isedit");
		var title = $(this).data("title");
		var thisBtn = $(this);
		var tbl = $(this).parent("p").siblings("table"),tmp,delth;//找table
		var isRollBack = tbl.data("isrollback");
		var isDelete = tbl.data("isdelete");
		if(tbl.find("#deleteId").length>0){
            tmp = tbl.find("th").eq(2); //找第1个th 
            delth = true;   
        } else {
            tmp = tbl.find("th").eq(0);
            delth = false;
        }
		var ids="";
		tbl.find("tbody>tr").each(function(){
			if($(this).attr("id")){
				ids += $(this).attr("id")+",";
			}	
		})
		if(ids.charAt(ids.length-1) == ',') {
			// ids = ids.slice(0,-1);
        } 
        var columnnames = [];
        tbl.find("th").each(function(){
            if($(this).data("columnname")) {
                var columnname = $(this).data("columnname");
                columnnames.push(columnname);
            }
        });
        var viewurlid = tbl.find("#viewurlid").data("url");
        
        if(treeFlag == 1){
        	ids = "";
		}
        

		top.$.jBox.open("iframe:"+url+ids, title, $(top.window).width()-200, $(top.window).height()-200, {
          buttons:{"确定":"ok"}, submit:function(v, h, f){
            if (v=="ok"){
            	var list = [];
            	if(treeFlag == 1){
            		var selectedIds = h.find("iframe").contents().find("#treeFrame").contents().find("#contentTable tr.success").data("id");//表格实体的id
	                var selectedPath = h.find("iframe").contents().find("#treeFrame").contents().find("#contentTable tr.success").data("entityclassname");//表格实体的id
	                console.log(selectedIds);
            	} else {
	            	var selectedIds = h.find("iframe").contents().find("#popTable tr.success").data("id");//表格实体的id
	                var selectedPath = h.find("iframe").contents().find("#popTable tr.success").data("entityclassname");//表格实体的id	
            	}

                if(typeof(selectedIds) != 'undefined') {
                    var entityName = selectedPath.substring(0,1).toLowerCase()+selectedPath.substring(1);
                    if(thisBtn.hasClass("businessTableInput")){
                        var ajaxurl = contextRoot+"/commonController/getEntityData?path=" + entityPath + "&editFlag=1&isRollBack=" + isRollBack +
                        	"&columnName=" + tableName + "&orderId=" + orderId;

                    } else {
                        var ajaxurl = contextRoot+"/"+entityName+"/getByIdJson";   
                    }
                    
                    $.ajax({
                        type : "POST",
                        url : ajaxurl,
                        data : {
                            id: selectedIds,
                            entityColumnName: columnnames.join(",")
                        },
                        success : function(data) {
                        	var data0=JSON.parse(data);
                            var newTr=$("<tr data-middleid='" + data0.middleId + "'></tr>");
                            newTr.attr("id",selectedIds);
                            newTr.append("<td style='display:none;'><input type='hidden' name='"+tmp.data("name")+"["+index+"].id' value='"+selectedIds+"'></input></td>");
                            if(delth){
                            	if(classFlag == 1){
                            		newTr.append("<td style='vertical-align:middle;'><span onclick='javascript:var tbl=$(this).parents(&apos;table&apos;); removeRow($(this));rowIdGen(tbl); return false;' class='close'></span></td>");    
                            	} else{
                            		newTr.append("<td style='vertical-align:middle;'><span onclick='var tbl=$(this).parents(&apos;table&apos;); $(this).parents(&apos;tr&apos;).remove();rowIdGen(tbl); ' class='close'></span></td>");    
                            	}
                            	newTr.append("<td class='rowid' style='vertical-align:middle;width:40px;text-align:center;'></td>");
                            }

                            for(columnname in columnnames) {
                                for(var i in data0){
                                    if(i==columnnames[columnname] && i!="status"){
                                        newTr.append("<td>"+ data0[i] +"</td>");
                                    }
                                    if(i==columnnames[columnname] && i=="status"){
                                        newTr.append("<td>"+ data0.status +"</td>");
                                    }
                                }
                            }
                            
                            var entityPath = data0.entityPath;
                            if(type == "account") {
                                if(viewurlid){
                                    var iseditStr = "<td>";
                                    if(isedit == true) {
                                    	var editUrl = "";
                                    	if(classFlag == 1 && aUrl.indexOf("auto_account_entities/AutoAccountEntity/getAccountType") > -1){
                                    		editUrl = aUrl;
                                    		if(editUrl.indexOf("flag=0") > -1){
                                    			editUrl = editUrl.replace("flag=0", "flag=1");
                                    		}
                                    		editUrl = editUrl.replace("auto_account_entities/AutoAccountEntity/getAccountType", entityPath + "/form") + "&isRollBack=" + isRollBack;
                                    		iseditStr += "<a  class='tableAddRowForMoreAccountEdit' data-type='-1' data-columnnames='" + columnnames + "' data-id='" + selectedIds +"' data-path='" + entityPath + "' data-url='"+editUrl + "&id=" + selectedIds +"'>编辑</a>";
                                    	} else{
                                    		editUrl = aUrl;
                                    		editUrl = editUrl.replace("flag=0", "flag=1");
                                    		iseditStr += "<a  class='tableAddRowForAccountEdit' data-columnname='" + tableName + "' data-path='" + entityPath + "' data-url='"+editUrl + "&id=" + selectedIds +"'>编辑</a>";
                                    	}
                                    }
                                    var seeUrl = "";
                                    if(classFlag == 1 && aUrl.indexOf("auto_account_entities/AutoAccountEntity/getAccountType") > -1){
                                    	seeUrl = aUrl.replace("auto_account_entities/AutoAccountEntity/getAccountType", entityPath + "/getCheckform");
                                    } else{
                                    	seeUrl = aUrl.replace("form", "getCheckform");
                                    	if(seeUrl.indexOf("id=") == -1){
                                    		seeUrl += "&id=" + selectedIds;
                                    	}
                                    }
                                    iseditStr += "   <a class='tableView' data-url='"+seeUrl + "&id=" + selectedIds +"'>查看</a>";
                                    
                                    var upperEntityPath = entityPath.substring(0,1).toUpperCase() + entityPath.substring(1);
                                    var wholePath = "com.thinkgem.jeesite.accountModules."+entityPath+"AutoModules.entity."+upperEntityPath;
                                    if(isDelete == "1"){
                                    	iseditStr +="   <a  class='tableDelete' data-url='/zbitil/a/auto_business_middle_table/autoBusinessMiddleTable/doDelete" + 
                                    		"' onclick='javascript:removeRow($(this));return false;' data-isrollback='"+ isRollBack + "' data-id='" + selectedIds + "' data-classpath='" + wholePath + "'>删除</a></td>";
                                    }
                                    
                                    newTr.append(iseditStr);
                                }
                            } else if(type != "account") {//流程table 需写为if(type == "flow")                           	
                                if(viewurlid){
                                    var iseditStr = "<td>";
                                    if(isedit == true) {
                                         iseditStr += "<a  class='tableAddRowForAccountEdit' data-url='"+aUrl + "?id=" + selectedIds +"'>编辑</a>";
                                    }
                                    var seeUrl = aUrl.substring(0,aUrl.length-4) + "myTicketCheckFormForTable";
                                    iseditStr += "<a class='tableView' data-url='"+viewurlid+selectedIds+"'>查看</a></td>";
                                    newTr.append(iseditStr);
                                }
                            	
                            }

                            tbl.append(newTr);
                            rowIdGen(tbl); 
                                
                        },
                        error : function() {
                            alert('请求数据失败');
                        }
                    });
                }
            }  
          }, loaded:function(h){
        	  var framecode = "jbox-iframe"+(new Date().getTime()); 
              h.find("iframe").attr("name", framecode);
              h.find("iframe").attr("id", framecode);
              top.document.getElementById(framecode).contentWindow.name = framecode;  
        	
              $(".jbox-content", top.document).css("overflow-y","hidden");
              h.find("iframe").contents().find("#frameId").val(window.name);
          }
        });
	})
	
	$(".tableAddRow").click(function(){
		var index=0;
		var tbl = $(this).parent("p").siblings("table"),
			len = tbl.find("th").length,
			selTd, sel,
			tmp;
		var editTr = $("<tr><td style='vertical-align:middle;'><span onclick='var tbl=$(this).parents(&apos;table&apos;); $(this).parents(&apos;tr&apos;).remove();rowIdGen(tbl);' class='close'></span></td><td class='rowid' style='vertical-align:middle;width:40px;text-align:center;'></td></tr>");

		for(var i = 1; i<len; i++){
			tmp = tbl.find("th").eq(i);
			if(tmp.data("type")=="search"){
				editTr.append('<td><div class="input-append searchInputDiv"><input type="hidden" id="servicesubcategoryIdValue" name="'+
						tmp.data("name")+"["+index+"]"+"."+tmp.data("columnname")+".id"+
						'"><input id="servicesubcategoryId" readonly="readonly" type="text" class="form-control searchInput" data-url="'+ctx+'/autoSource/queryNewSource?id='+ 
						tmp.data("datasource")+
						'&newSource=yes&isProcessVariable=0" data-title="'+tmp.data("viewname")+
						'"><a href="javascript:" class="btn"><i class="fa fa-search"></i></a></div></td>');
				
			} else if(tmp.data("type")=="select"){
				selTd = $("<td></td>");
				sel = tbl.find("th").eq(i).data("select").replace(/#/g, "'");
				sel = sel.replace(/_theindex_/g, index);
				selTd.append(sel);
				editTr.append(selTd);     
			} else {  
				editTr.append("<td><input name='"+tmp.data("name")+"["+index+"]."+tmp.data("columnname")+"'  class='form-control'></td>");
			}	
		}
		tbl.append(editTr);
        rowIdGen(tbl);
		$(".searchInputDiv").click(function(){
			searchCtrl($(this));
		})
	});
	
	
	// table控件结束
    
	// search控件的功能
	function searchCtrl(control){
    	//var url = control.find(".searchInput").data("url");
		//用.data()只能取到第一次的url
		var url = control.find(".searchInput").attr("data-url");
		var title = control.find(".searchInput").data("title");
		var thisDiv =control;
        var frameId = window.name;
        var idTemp, labelTemp;

        if(control.find("input[type=hidden]").eq(0).attr("disabled")||control.find("input[type=hidden]").eq(0).attr("readonly")){
            return false;
        } else {
            // 追加的更改，增加弹出层选择结果缓存域
            if(!thisDiv.find(".searchtemp").length){
                idTemp = $("<input type='hidden' disabled='disabled' class='searchtemp' id='"+thisDiv.find("input[type=hidden]").eq(0).attr("name").split(".")[0]+"tempid'>");
                labelTemp = $("<input type='hidden' disabled='disabled' class='searchtemp' id='"+thisDiv.find("input[type=hidden]").eq(0).attr("name").split(".")[0]+"templabel'>");
                thisDiv.append(idTemp);
                thisDiv.append(labelTemp);    
            } else {
                idTemp = thisDiv.find("#"+thisDiv.find("input[type=hidden]").eq(0).attr("name").split(".")[0]+"tempid");
                labelTemp = thisDiv.find("#"+thisDiv.find("input[type=hidden]").eq(0).attr("name").split(".")[0]+"templabel");
            } 
            idTemp.val(thisDiv.find("input[type=hidden]").eq(0).val()); 
            labelTemp.val(thisDiv.find("input[type=hidden]").eq(0).next(".searchInput").val())   

            // 追加更改结束
            top.$.jBox.open("iframe:"+url, title, $(top.window).width()-200, $(top.window).height()-200, {
                buttons:{"确定":"ok"}, submit:function(v, h, f){
                    if (v=="ok"){
                        // 追加的更改，增加弹出层选择结果缓存域
                        thisDiv.find("input[type=hidden]").eq(0).val(idTemp.val());
                        thisDiv.find("input.searchInput").val(labelTemp.val());
                        if(idTemp.val()){
                            thisDiv.find("input[type=hidden]").eq(0).attr("data-paramlist",idTemp.data("paramlist"));
                            thisDiv.find("input[type=hidden]").eq(0).attr("data-paramobject",idTemp.data("paramobject"));    
                        } else {
                            thisDiv.find("input[type=hidden]").eq(0).removeAttr("data-paramlist");
                            thisDiv.find("input[type=hidden]").eq(0).removeAttr("data-paramobject");
                            //thisDiv.find("input[type=hidden]").eq(0).removeAttr(
                        } 

                        idTemp.remove();
                        labelTemp.remove();
                        // 追加更改结束

                        thisDiv.find("input[type=hidden]").trigger("change");
                        thisDiv.find("input.searchInput").trigger("change");
                        thisDiv.find("input.searchInput").trigger("blur");
                    }  
                }, loaded:function(h){
                    var framecode = "jbox-iframe"+(new Date().getTime()); 
                    h.find("iframe").attr("name", framecode);
                    h.find("iframe").attr("id", framecode);
                    top.document.getElementById(framecode).contentWindow.name = framecode;

                    $(".jbox-content", top.document).css("overflow-y","hidden");
                    //var selectedId = thisDiv.find("input[type=hidden]").eq(0).val().split("#");
                    var selectedId = idTemp.val().split("#"); 
                    h.find("iframe").contents().find("#selectedIds").val(thisDiv.find("input[type=hidden]").eq(0).attr("name"));
                    h.find("iframe").contents().find("#frameId").val(frameId);
                    h.find("iframe").contents().find("#popTable tr").each(function(){
                        for(var i in selectedId){
                            if($(this).data("id") == selectedId[i]){
                                $(this).addClass("success");
                            }
                        }
                    })
                }
            });    
        }
    }
	
	/* 
     * 新增的搜索框控件 
    */
	$(".searchInputDiv").click(function(){
		searchCtrl($(this));
	});

    // 特殊search控件的功能
    function searchCtrlEx(control){
        var url = control.find(".searchInput").data("url");
        var title = control.find(".searchInput").data("title");
        var thisDiv =control;
        var frameId = window.name;

        if(control.find("input[type=hidden]").attr("disabled")||control.find("input[type=hidden]").attr("readonly")){
            return false;
        } else {
            top.$.jBox.open("iframe:"+url, title, $(top.window).width()-200, $(top.window).height()-200, {
              buttons:{"确定":"ok"}, submit:function(v, h, f){
                if (v=="ok"){
                    var list = [];
                    var selectedIds = h.find("iframe").contents().find("#popTable tr.success").data("id");
                    var selectedLabels = h.find("iframe").contents().find("#popTable tr.success").children("[searched]").text();
                    thisDiv.find("input[type=hidden]").val(selectedIds);
                    // thisDiv.find("input[type=hidden]").val(selectedLabels.trim());
                    thisDiv.find("input.searchInput").val(selectedLabels.trim()).trigger("change");
                    thisDiv.find("input.searchInput").trigger("blur");
                }  
              }, loaded:function(h){
                $(".jbox-content", top.document).css("overflow-y","hidden");
                var selectedId = thisDiv.find("input[type=hidden]").val(); 
                h.find("iframe").contents().find("#frameId").val(frameId);
                h.find("iframe").contents().find("#popTable tr").each(function(){
                    if(control.data("id") == selectedId){
                        control.addClass("success");
                    }
                })
              }
            });    
        }
    }

    // 特殊search控件
    $(".searchInputDivEx").click(function(){
        searchCtrlEx($(this));
    });
	
    /* 
     * 禁止提交按钮连续点击
    */
    // var validation = $("#inputForm").Validform({
    //     tiptype:3,
    //     ignoreHidden:true
    // });
    // $("#inputForm").submit(function(){
    //     if(validation.check()){
    //         console.log("统一提交");
    //         var r=confirm("确定提交？");
    //         if (r==true){
    //             var btn = $(this).find("#btnSubmit");
    //             var btnText = $(btn).val();
    //             $(btn).val("正在提交……").attr("disabled","disabled");    
    //         } else {
    //             jBox.tip('取消提交', 'info');
    //             return false;
    //         }    
    //     }      
    // });
    // 禁止提交按钮连续点击 end

 
    /* 
     * 加入到dashboard
    */
    $(".adddash").click(function(){
        // 进入编辑模式，禁止搜索等其他操作
        $(this).attr("disabled","disabled");
        $(".dashable").addClass("editdash");
        $(".dashable #searchForm input").attr("disabled","disabled");
        $(".dashable #searchForm select").attr("disabled","disabled");
        $(".dashable").append("<div class='dashtips'> 请选择要在面板中显示的数据列&nbsp;&nbsp;&nbsp;<a href='javascript:;' class='btn dark btn-outline btn-sm submitdash'>选好了</a> <a href='javascript:;' class='btn dark btn-outline btn-sm canceldash'>取消</a></div>")
        
        // 取消加入面板
        $(".dashtips .canceldash").click(function(){
            $(".dashable").removeClass("editdash");
            $(".dashtips").remove();
            $(".adddash").removeAttr("disabled");
            $(".dashable #searchForm input").removeAttr("disabled");
        $(".dashable #searchForm select").removeAttr("disabled");
        });

        // 确认加入面板
        $(".dashtips .submitdash").click(function(){
            var collist = [], 
                searchlist = '';
            
            if($(".dashable.editdash th :checkbox:checked").length==0){
                top.$.jBox.alert("你没有选择任何数据列！", "不能加入到面板"); 
                return false;   
            } else{
                $(".dashable.editdash th :checkbox").each(function(){
                    if($(this).is(':checked')){
                        collist.push({colName: $(this).attr("name"), colKey: $(this).val()});
                    }
                });     
            }

            $(".dashable.editdash #searchForm .form-group :disabled").each(function(){
                if($(this).attr('type') !='submit' && $(this).attr('type') !='button' && $(this).val()){
                    searchlist += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
                }
            });
            
            if(searchlist){
                if(searchlist.charAt(searchlist.length-1) == ',') {
                    searchlist = searchlist.slice(0,-1);
                } 
                searchlist = '{' + searchlist + '}';    
            } else {
                searchlist = null;
            }
            

            $.ajax({
                url: ctx+"/DashTable/save",
                type: "post",
                data:{
                    name: $('h3.page-title').text().trim(),
                    entity: $('.adddash').data('entity'),
                    standaryType:$('.adddash').data('type'),
                    morelink: window.location.pathname.toString(),
                    cols: JSON.stringify(collist),
                    searchs: searchlist
                },
                dataType:"json",
                success: function(data,status){
                    if(data.result == "设置成功") {
                        top.$.jBox.tip("已添加到面板！");
                        top.window.location = ctx;      
                    } else {
                        top.$.jBox.alert("添加到面板失败！", data.result);
                        $(".dashtips .canceldash").trigger("click");
                    }
                },
                error: function(data,status){
                    top.$.jBox.alert("添加到面板失败！", status);
                    $(".dashtips .canceldash").trigger("click");
                }
            });
        })
    });
    // 加入到dashboard的编辑模式 end

    // input 模糊查询
    $(".input-enquirable").each(function(){
        var ul = $("<ul class='list-unstyled input-enquirable-list'></ul>");
        ul.hide();
        $(this).after(ul);
    }).keyup(function(){
        var val = $(this).val(), that = $(this), width = $(this).width(), paddingR = $(this).css("paddingRight"), paddingL = $(this).css("paddingLeft");
        
        $.ajax({
            type: "post",
            url: ctx+'/itilsparepart/itilSparePart/queryPN',
            data:{"pn":val,"className":$(this).data("classname"),"fieldName":$(this).attr("id")},
            //dataType : 'json',
            //contentType:"application/json",
            cache : false,
            success : function(data) {
                data = JSON.parse(data);
                if(data.length>0){
                    that.next(".input-enquirable-list").empty().css("width", width + parseInt(paddingR) + parseInt(paddingL) + "px").show();
                    for(var i=0;i<data.length;i++) {
                        var liVar = "<li data-id='"+data[i].id+"'>"+data[i].pn+"</li>";
                        that.next(".input-enquirable-list").append(liVar);
                    }
                    that.next(".input-enquirable-list").children("li").click(function(){
                        that.val($(this).text());
                    });    
                }
            },
            error:function() {}
        });        
    }).blur(function(){
        var that = $(this);
        setTimeout(function(){
            that.next(".input-enquirable-list").hide();    
        },200);
    });
    // input 模糊查询 end
})

// 调整内部iframe高度，并修改mainFrame的高度
function frmheight(frmid){
	var main = $(window.parent.document).find("#"+frmid);
    var thisheight = main.contents().find("body").height();
    main.height(thisheight);
    var frameheight = $(top.document).find("#mainFrame").height();
    var innerheight = $(window.parent.document).find("body").height();
    if(innerheight>frameheight){
    	$(top.document).find("#mainFrame").height(innerheight+20);	
    }	
}

//data-object:
//value,name,entityPath;...
//data-list:
//name;id1,id2,id3,...|name1;id4,id5,id6,...|...


//获取和datasourceEntityPath相同的json对象的id
function getIdFronSameEntityPath(entity,entityPath){
	var idValue = "";
	for(var i = 0; i < entity.length; i++){
		if(entity[i].datasourceEntityPath == entityPath){
			idValue = entity[i].value;
			break;
		}
	}
	return idValue;
}

//获取和search字段名columnName相同的属性的value
function getValueFromColumnName(entity,columnName){
	var idValue = "";
	for(var i = 0; i < entity.length; i++){
		if(entity[i].name == columnName){
			idValue = entity[i].value;
			break;
		}
	}
	return idValue;
}

//对象级联方法
//[左手边控件name，右手边控件name，左手边属性里对象全名，左手边属性里外键类型，左手边属性里的value(属性名)，右手边属性里的value(属性名),外键关系类型(真1，伪-1),右手边属性里的value(属性名),外键id,外键list里所有id]
function objectCascade(LHSName, RHSName,LHSEntityPath,fkType,LHSColumnName,RHSEntityPath,fkRelationType,RHSColumnName,fkId,fkIds){
    //联动的源search，选择的那条数据源的id
    var LHSId = $("[name='" + LHSName + "']").attr("value");
    //联动的源search，选择的那条数据源的所有外键，格式"value1,name1,entityPath1;value2,name2,entityPath2;..."，即值，属性名，对象全名
    var fkString = $("[name='" + LHSName + "']").attr("data-paramobject");
    //联动的源search，选择的那条数据源的所有List类型的外键，格式name;id1,id2,id3,...|name1;id4,id5,id6,...|...，即属性名，list里的所有对象的id
    var fkKListString = $("[name='" + LHSName + "']").attr("data-paramlist");
    
    var usrlStr2 = "&isOtherParam=0";
    var oldRHSUrl = $("[name='" + RHSName + "']").next(".searchInput").attr("data-url");
    var urlStr1 = "";
    
    var sourceParm = {};
    sourceParm.op = "and";
    var children0 = new Array();
    var children = {};
    
    if(fkRelationType == "1"){
	    if(fkType == "OneToMany"){
	        children.k = RHSColumnName + ".id";
	        children.op = "eq";
	        children.v = LHSId;   
	        children0.push(children);
	    } else if(fkType == "ManyToOne" || fkType == "OneToOne"){
	    	children.k = "id";
	        children.op = "eq";
	        if(fkString){
	        	children.v = getFKId(fkString, LHSColumnName, RHSEntityPath);   
	        } else if(fkId){
	        	children.v = fkId;
	        }
	        children0.push(children);
	    } else if(fkType == "ManyToMany"){
	    	children.k = "id";
	        children.op = "in";
	        children.v = new Array();  
	        var ids = "";
	        if(fkKListString){
	        	ids = getFKListIds(fkKListString, LHSColumnName);
	        } else if(fkIds){
	        	ids = fkIds;
	        }
	        for(var i = 0; i < ids.length; i++){
	            var value = {};
	            value.v = ids[i];
	            children.v.push(value);
	        }
	        children0.push(children);
	    }
    }else if(fkRelationType == "-1"){
    	var name = RHSColumnName;
    	if(!RHSColumnName){
    		name = LHSColumnName.split(",")[1];
    	}
    	if(fkType == "OneToMany" || fkType == "OneToOne"){
	        children.k = name + ".id";
	        children.op = "eq";
	        children.v = LHSId;   
	        children0.push(children);
	    } else if(fkType == "ManyToOne" || fkType == "ManyToMany"){
	    	children.k = name;
	        children.op = "listin";
	        children.v = [];   
	        children.v[0].v = LHSId;
	        children0.push(children);
	    }
    }
    sourceParm.children = children0;
    var jsonStr = JSON.stringify(sourceParm);
    //jsonStr = jsonStr.replace("\"", "\\\"");
    urlStr1 = "query?otherParam=" + jsonStr;
    //"/zbitil2/a/autoSource/queryNewSource?id=6b2020a9813c483582fcdc304cf1f9bd&newSource=yes&isProcessVariable=0"
    var firstIndex = oldRHSUrl.lastIndexOf("/") + 1;
    var secondIndex = oldRHSUrl.indexOf("&");
    var headStr = oldRHSUrl.substring(0, firstIndex);
    var tailStr = oldRHSUrl.substring(secondIndex, oldRHSUrl.length);
    var newRHSUrl = headStr + urlStr1 + tailStr;
    if(newRHSUrl.indexOf("entityPath") == -1){
    	newRHSUrl += "&entityPath=" + RHSEntityPath;
    }
    
    $("[name='" + RHSName + "']").next(".searchInput").attr("data-url", newRHSUrl);
}

//获取该数据源选中的这条数据的外键id，对应LHS设计时选的字段
//[外键数组字符串，左手边属性名，右手边类全名]
function getFKId(fkString, LHSColumnName, RHSEntityPath){
	if(!fkString){
		return "";
	}
    var array1 = fkString.split(";");
    var id = undefined;
    for(var i = 0; i < array1.length; i++){
        var array2 = array1[i].split(",");
        if(array2[1] == LHSColumnName && array2[2] == RHSEntityPath){
        	id = array2[0];
            break;
        }
    }
    return id;
}

//获取该数据源选中的这条数据的List外键里的所有id的数组，对应LHS设计时选的字段
//[外键数组字符串，左手边属性名]
function getFKListIds(fkKListString, LHSColumnName){
	if(!fkKListString){
		return "";
	}
    var array1 = fkKListString.split("|");
    var ids = {};
    for(var i = 0; i < array1.length; i++){
        var array2 = array1[i].split(";");
        if(array2[0] == LHSColumnName){
            ids = array2[1].split(",");
            break;
        }
    }
    return ids;
}

