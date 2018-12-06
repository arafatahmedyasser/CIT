/**
  
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 

 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *  
 * 
 
 * @description The class which is responsible for generating the contextual apps for 
 * a view 
 
 */
cbx.ns("cbx.lib");
cbx.contextMenuRenderer = function (){
	return {
		generateMenusFor : function(record,viewId,menuId){
			var processFlag = this.processAppRequest(viewId, record);
			if(processFlag){
				var contextMenuPreference = iportal.preferences.getApplicationMenuRenderer();
				var cList = IMM.contextList[viewId][0];
				if(cList.child_nodes && cList.child_nodes.length>0){
					for(var i=0;i<cList.child_nodes.length;i++){
						var menuList = [];
						if(cList.child_nodes[i].menu_id===menuId){
							return cList.child_nodes[i];
							//this.generateMenu(record, cList.child_nodes[i], viewId, contextMenuPreference, options);
						}
					}
				}
			}
			return [];
		},
		getRawContextMenuList : function(viewId){
			   if (cbx.isString(viewId) && !cbx.isEmpty(viewId)) {
			      var menuList = IMM.contextList[viewId];
			    if(cbx.isArray(menuList) && menuList.length>0){
			     return menuList[0];
			    }else
			     LOGGER.error("No context menu configured for view id= ",viewId);
			   }
		},
		getContextMenu : function (viewId,record, event,options){
			var that = this;
			/*var that = this;
			this.viewId = viewId;
			// for getting the default view id for current view
			//var viewID = IMM.getDefaultView(widgetId);
			// JS Error handling: In the absence of data for
			// context menus
			if (IMM.contextList[viewId] == undefined) {
				return;
			}

			// for getting the Context menu metadata according
			// to the view id
			var menuList = IMM.contextList[viewId];

			// JS Error handling: In cases where only view id is
			// available in the DB and no child available
			if (cbx.isEmpty(menuList)) {

				return;
			}*/
			var processFlag = this.processAppRequest(viewId, record);
			if(processFlag){
				var contextMenuPreference = iportal.preferences.getApplicationMenuRenderer();
				if(that.validateContextMenu(record)){
					var additionalOptions ={
							"showContextIcon":!cbx.isEmpty(options.showContextIcon)?options.showContextIcon:true,
							"menuStyle":"icon"
					};
					that.generateContextMenu(IMM.contextList[viewId], viewId, record,contextMenuPreference,additionalOptions);
				}
			}
 			
		},
		processAppRequest : function(viewId,record){
			var flag = true;
			var that = this;
			this.viewId = viewId;
			if (IMM.contextList[viewId] == undefined) {
				flag =  false;
			}

			// for getting the Context menu metadata according
			// to the view id
			var menuList = IMM.contextList[viewId];
			if (cbx.isEmpty(menuList)) {

				flag =  false;
			}
			this.customCondition = [];
			if(CMHR.getCondition(viewId)){
				var config = {}
				config.data = record;
				this.customCondition = CMHR.getCondition(viewId)(config);
			}
			return flag;
		},
		validateContextMenu : function(record){
			var appPanel = $('#context-scroller');
			if(appPanel[0] && appPanel[0].record && appPanel[0].record== record){
				return false;
			}
			return true
		},
		/*
		 * This function triggers the generation of context menus
		 */
		generateContextMenu : function (menu_items, view_id, record,preference,options){
			var that = this;
			var menuData = null;
			if (menu_items[0] != null) {
				menuData = menu_items[0];
			}
			if (menuData != null) {
				var menuObj = that.generateMenu(record, menuData, view_id,preference,options);

				return menuObj;

			}

		},
		generateMenu : function (record, menuData, view_id, preference,options){
			var that = this;
			var parentElem = options.parentElem?options.parentElem:$('#context-scroller');
			if(parentElem.children().length>0){
				parentElem.empty();
			}
			parentElem[0].record = record;
			/*var childDiv = $('<div/>').attr({'id':"context-child"});
			childDiv.css("height","100%");
			childDiv.css("width","100%");
			childDiv.appendTo(parentElem);*/
			var objArray = []
			if (menuData != null && menuData.child_nodes != null) {
				for ( var i = 0; i < menuData.child_nodes.length; i++) {
					if (menuData.child_nodes[i] != null && menuData.child_nodes[i].child_nodes != null
								&& !cbx.isEmpty(menuData.child_nodes[i].child_nodes)
								&& menuData.child_nodes[i].container_flag === 'Y') {

						/*CMHR.registerHandler(menuData.child_nodes[i].menu_id,function(config){
						$('#context-menu').on('pageshow',function(event){
							var additionalOpt = {
									"parentElem":$('#CONTEXT-CONTENT'),
									"showContextIcon":false,
									"menuStyle":"button"
							}
							cbx.contextMenuRenderer.generateContextMenu([config.menuData], config.viewId, config.record,
									iportal.preferences.getApplicationMenuRenderer(),additionalOpt);
							});
						$.mobile.changePage( "#context-menu", {
							transition: "flip",
							reverse:true
						});
						//cbx.contextMenuRenderer.generateMenu(config.record,config.menuData);
					});*/
					//this.buildMenu(parentElem, menuData,i,record,"Y","icon");
					cbx.contextMenuRenderer.generateMenu(record,menuData.child_nodes[i],view_id, preference,options);

					} else {
						/*
						 * for Menu Separator
						 */
						if (menuData.child_nodes[i].menu_separator == 'Y') {

							//menuObj.add('-');

						}

						if (menuData.child_nodes[i].container_flag === 'N'
									&& menuData.child_nodes[i].menu_separator != 'Y') {
							/*
							 * Adding menu item that will raise the click event
							 * to be captured and targeted to the
							 * cbx.ContextMenuHandlerRegistry.js
							 */
							// In the the presence MENUS_AVAILABLE key in record
							// in order to state the menus to be shown by the
							// developer.
							if (this.isValidationRequired(record, view_id)) {
								if(this.doValidate(menuData.child_nodes[i].menu_id,record)){
									this.buildMenu(parentElem, menuData,i,record,"N",options.menuStyle)
								}
							} else {
								this.buildMenu(parentElem, menuData,i,record,"N",options.menuStyle)
							}
						}
						
					}
				}
				
				$.mobile.activePage.trigger('create');
				if(options.showContextIcon){
					var contextAppLauncher = $('#context-app-img');
					//contextAppLauncher.show("slow");
					if($('#context-app-panel-popup').hasClass('ui-popup-hidden')){
						contextAppLauncher.children('a').click();
					}
				}
			}

		},
		buildMenu : function(parentElem,menuData,counter,record,menuDataReq,menuStyle){
			if(menuStyle =="icon"){
				if(!cbx.isEmpty(parentElem)){
					var viewMD = IMM.getViewMetaData(this.viewId);
					var iconConfig = {
							"parentElem": parentElem,
							"icondata":{
								APP_DISPLAY_NM_KEY: "LBL_"+menuData.child_nodes[counter].display_key_nm,
								APP_CSS_CLASS : menuData.child_nodes[counter].menu_id+"-cls context-app-icon",
								APP_ID : menuData.child_nodes[counter].menu_id,
								BUNDLE_KEY : viewMD.FLD_BUNDLE_KEY,
								APP_TYPE:"CONTEXTUAL",
								"idSuffix":"-context"
							}
					
					};
					var scope =this;
					var tempItem = $("<div/>",{"id":"tempContainer"});
					CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getConstant("APP_VIEW"),function(){
						var iconObject = new cbx.lib.view.icon(iconConfig);
						var t = iconObject.getIconControlDOM();
						tempItem.append(t);
						//$(t).appendTo(parentElem);

						
						/* * 
						 * Context Layer Title - Starts
						 *  This title Added for Right side contextLayer not for Bottom layer
						 *  Change Log : CTMQ314F03 
						 * */
						
						var ContextAppTitle = false;
						//var headerText = iportal.jsutil.getTextFromBundle("cuser","M_CONTEXT_HEADER_TXT");
						var headerText = "Your Services";
						if(ContextAppTitle){
							if( $(".ContextAppHeading").length < 1 ){
									$("<div class='ContextAppHeading tConfigTitle app-header-text'>"+headerText+"</div>").prependTo(parentElem);
								}
							}
						
						/*Context Layer Title - Ends*/
						
						if(!cbx.isEmpty(CMHR.getHandler(menuData.child_nodes[counter].menu_id))){
							$(t).bind("click",function(){
								var config = {}
								if(menuDataReq==="Y"){
									config.menuData = menuData.child_nodes[counter];
									
								}
								else{
								
								var cClass = CLCR.getCmp({
									"COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
									"SEQUENCE":"INIT"
								});
								if(cClass){
									new cClass(this);
								}
								$('#context-app-panel').bind('popupafterclose',[this,config],function(evt){
									var config = evt.data[1];
									var app = evt.data[0];
									config.record={};
									config.record.data = record;
									config.viewId = scope.viewId;
									CMHR.executeHandler(app.id.substring(0,app.id.indexOf("-context")),config);
									$('#context-app-panel').unbind(evt);
									var cClass = CLCR.getCmp({
										"COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
										"SEQUENCE":"COMPLETE"
									});
									if(cClass){
										new cClass();
									}
								})
								$('#context-app-panel').popup('close');
							}
					});
					}
					});
					//this.registerListener('iconlistener', this.iconListener, this);
					parentElem.append(tempItem.get(0));
				}
			}
			else if(menuStyle=="button"){
				if(!cbx.isEmpty(parentElem)){
					/*var iconConfig = {
							"parentElem": parentElem,
							"icondata":{
								APP_DISPLAY_NM_KEY: "LBL_"+menuData.child_nodes[counter].display_key_nm,
								APP_CSS_CLASS : menuData.child_nodes[counter].menu_id+"-cls context-app-icon",
								APP_ID : menuData.child_nodes[counter].menu_id,
								BUNDLE_KEY : CRB.getFWBundleKey(),
								APP_TYPE:"CONTEXTUAL",
								"idSuffix":"-context"
							}
					
					};*/
					var iconConfig = {
							"eleType":'a',
							"href":'',
							"data-role":"button",
							"html":iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_"+menuData.child_nodes[counter].display_key_nm)
					}
					var iconObject = new cbx.lib.layer(iconConfig);
					$(iconObject.getLayer()).appendTo(parentElem);
					var scope =this
					if(!cbx.isEmpty(CMHR.getHandler(menuData.child_nodes[counter].menu_id))){
						$(iconObject.getLayer()).bind("click",function(){
							var config = {}
							if(menuDataReq==="Y"){
								config.menuData = menuData.child_nodes[counter];
								
							}
							else{
								$('#context-app-panel').popup('close');
							}
							config.record={};
							config.record.data = record;
							config.viewId = scope.viewId;
							CMHR.executeHandler(menuData.child_nodes[counter].menu_id,config);
							$.mobile.changePage( "#app", {
								transition: "flip",
								reverse:true
							});
							
						});
					}
					//this.registerListener('iconlistener', this.iconListener, this);
				}
			
			}
		},
		/*
		 * This function decides the handler to be attached to the menuObj
		 */
		menuclickHandler : function (menuObj){
			var that = cbx.contextMenu.contextMenuRenderer;
			if (menuObj.formContainerId != undefined && menuObj.formContainerId != null
						&& menuObj.formContainerId != "") {
				that.callFormContainerHandler(menuObj);

			} else {
				that.customMenuHandler(menuObj);
			}

		},
		isValidationRequired : function(record,viewId){
			var flag = false;
			if(!cbx.isEmpty(record.MENUS_AVAILABLE) || !cbx.isEmpty(CMHR.getCondition(viewId))){
				flag = true;
			}
			return flag;
		},
		doValidate : function(menuId,record,viewId){
			var valFlag;
			/**
			 * backward compat
			 */
			var menusAvail = record.MENUS_AVAILABLE;
			if(menusAvail && menuId in record.MENUS_AVAILABLE){
				valFlag = true;
			}
			else if(menusAvail && !(menuId in record.MENUS_AVAILABLE)){
				return false;
			}
			
			if(this.customCondition.length>0){
				if(this.customCondition.contains(menuId)){
					valFlag = true;
				}
				else{
					return false;
				}
			}
			return valFlag;
			
		},
		/*
		 * This function associates the form Container Id and context menu id to
		 * the handler registry
		 */
		callFormContainerHandler : function (menuObj){

			new cbx.contextMenu.formHandlerExecutor(menuObj, menuObj.formContainerId, menuObj.formId);

		},
		/*
		 * This function associates the handlers registered by the user in the
		 * context menu handler registry in the absence of form container id in
		 * the config object
		 */
		customMenuHandler : function (menuObj){

			CMHR.executeHandler(menuObj.itemId, {
				menuId : menuObj.itemId,
				wsId : menuObj.wsId,
				productCode : menuObj.productCode,
				subProductCode : menuObj.subProductCode,
				functionCode : menuObj.functionCode,
				actionCode : menuObj.actionCode,
				pageCode : menuObj.pageCode,
				hostCode : menuObj.hostCode,
				record : menuObj.record
			});

		}

	};

}();