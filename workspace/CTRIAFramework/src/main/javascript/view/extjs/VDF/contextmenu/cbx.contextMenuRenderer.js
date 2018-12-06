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
 */
Ext.namespace("cbx.contextMenu");
/**
 * The ContextMenuRenderer class renders the context menu on any widget based on
 * the metadata provided by the IMM config object.
 * 
 */
cbx.contextMenu.contextMenuRenderer = function (){
	return {
		getContextMenu : function (widObj, record, event){
			var that = cbx.contextMenu.contextMenuRenderer;
			var widgetId = widObj.itemId;
			var evt = null;
			var contextAsMenuAvail = false;
			var contextAsIconAvail = false;
			var contextAsAppAvail = false;
			/** 
			 * if the event object is passed when the contextclick event is
			 * raised, it will be used; otherwise it will be retrieved using
			 */
			if (event != undefined) {
				evt = event;
			} else {
				evt = Ext.EventObject;
			}
			record.widObj = widObj;
			/**
			 * for getting the default view id for current view
			 */ 
			var viewID = IMM.getDefaultView(widgetId);
			/**
			 * JS Error handling: In the absence of data for context menus
			 * for getting the Context menu metadata according
			 * to the view id
			 */
			var menuItems = IMM.getContextMenuList(viewID);
			if (Ext.isEmpty(menuItems)) {
				return;
			}
			/**
			 * JS Error handling: In cases where only view id is
			 * available in the DB and no child available
			 */
			if(Ext.isEmpty(menuItems[0].child_nodes) || Ext.isEmpty(menuItems[0].child_nodes[0].menu_id)){
				return;
			}
			var appId = null;
			for ( var i = 0; i < menuItems[0].child_nodes.length; i++) {
			    if(menuItems[0].child_nodes[i].context_type === "MENU"){
			    	contextAsMenuAvail = true;
			    }
			    else if(menuItems[0].child_nodes[i].context_type === "ICON"){
			    	contextAsIconAvail = true;
			    }
			    else if(menuItems[0].child_nodes[i].context_type === "APP"){
			    	contextAsAppAvail = true;
			    	appId = menuItems[0].child_nodes[i].context_app_widget_id;
			    }
			}
			var menu_id = viewID;
			this.customCondition = [];
			if(CMHR.getCondition(viewID)){
				var config = {}
				config.data = record.json;
				this.customCondition = CMHR.getCondition(viewID)(config);
			}
			var menu = that.generateContextMenu(menuItems, viewID, menu_id, record);
			/**
			 *  to get the view details using view_id
			 */
			var vmd = IMM.getView(viewID);
			if(contextAsAppAvail){
				var widContainer = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer();
			 	var isWidExists = false;
			    var layoutId = null;
			    var layoutobj = null;
		    	var widget;
	    		layoutId = widObj.LAYOUT_ID;
	    		layoutobj = iportal.workspace.metadata.getCurrentWorkspace().find("itemId",layoutId+"_LAYOUT_CONTAINER")[0];
			    if(layoutobj && layoutobj.find('itemId',appId).length !== 0){
			    	isWidExists = true;
			    }
			    if(isWidExists && widObj.itemId !== appId){
			    	var rb = CRB.getFWBundle();
			    	if(iportal.preferences.isLangDirectionRTL() && (!Ext.isIE)){ 
			    		layoutobj.getEl().mask(rb['LODING_CONTEXT_APPS'],"app-container-lmask");
			    	}
			    	var appWidget = null;
			    	var header = widObj.find("itemId",widObj.itemId+"_WIDGET_HEADER")[0];
			    	if(header !== undefined){
			    		appWidget = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry.getWidget(appId);
			    		var labelString = null;
			    		var menuId = null;
			    		var title = widObj.findParentByType('portlet').title ? widObj.findParentByType('portlet').title:
			    			widObj.ownerCt.title ?	widObj.ownerCt.title: "";
			    		var config = {
			    				scope : widObj.mvh.mvConf,
			    				record : record,
			    				//grid : grid.id,
			    				appId : appId,
			    				title :title
			    		};
			    		var viewId = IMM.getDefaultView(appWidget.itemId);
			    		var panel = appWidget.find('itemId',viewId)[0];
			    		var animeConf = {
			    				callback : appWidget.shuffleItems,
			    				scope : config,
			    				easing:"easeOut",
			    				duration : .1
			    		};
			    		panel.items.items[0].getEl().hide(animeConf);
			    	}
			    }
			}
			if(contextAsMenuAvail){
				if (vmd.VIEW_MD.FLD_VIEW_TYPE == "TREE") {
					menu.show(record.ui.getEl());
				} 
				else if (vmd.VIEW_MD.FLD_VIEW_TYPE != "TREE") {
					evt.preventDefault();
					/**
					 * render the context menu at the position from where the
					 * contextclick event was raised 
					 */
					menu.showAt(evt.getXY());
				}
			}
			if(contextAsIconAvail){
				//return;
			}
		},
		getContextAsIconItems : function (viewID){
			var that = cbx.contextMenu.contextMenuRenderer;
			/**
			 * for getting the Context menu metadata according to the view id
			 */
			var menuItems = IMM.getContextMenuList(viewID);
			if (Ext.isEmpty(menuItems)) {
				return;
			}
			/**
			 * JS Error handling: In cases where only view id is available in the DB and no child available
			 */
			if (menuItems[0].child_nodes[0].menu_id == undefined) {
				return;
			}
			var menu_id = viewID;
			var contextAsIconItems = [];
			if (menuItems[0] != null) {
				for ( var i = 0; i < menuItems[0].child_nodes.length; i++) {
					if (menuItems[0].child_nodes[i].context_type === "ICON") {
						contextAsIconItems.push(menuItems[0].child_nodes[i].menu_id);
					}
				}
			}
			var contextItems = [];
			if(contextAsIconItems){
				for(var i=0; i<contextAsIconItems.length; i++){
					var iconCls = viewID+"_"+menuItems[0].child_nodes[i].menu_id+"_ACTION";
					var actionColumnTooltip = CRB.getFWBundle()['LBL_'+contextAsIconItems[i]];
					var that = this;
					this.count = i;
					contextItems.push({
						iconCls : iconCls,
						tooltip : actionColumnTooltip,
						menuData : menuItems[0].child_nodes[i],
						handler : function (grid,rowIndex,colIndex,data) {
							var record = grid.getStore().getAt(rowIndex);
							var displayLabel = data.menuData.display_key_nm;
							var menuObj = [];
							menuObj.push({
								text : displayLabel,
								wsId : viewID,
								itemId : data.menuData.menu_id,
								productCode : data.menuData.od_product_code,
								subProductCode : data.menuData.od_subprod_code,
								functionCode : data.menuData.od_function_code,
								actionCode : data.menuData.action,
								pageCode : data.menuData.page_code,
								hostCode : data.menuData.host_code,
								record : record,
								eventId : data.menuData.event_id,
								formContainerId : data.menuData.form_container_id,
								formId : data.menuData.form_id,
								contextActionType : data.menuData.context_type
							});
							if (!Ext.isEmpty(data.menuData.child_nodes)) {
								var subMenu = that.generateSubMenu(record, data.menuData,viewID,"ICON");
								var evt = Ext.EventObject;
								subMenu.showAt(evt.getXY());
							}
							else {
								cbx.contextMenu.contextMenuRenderer.customMenuHandler(menuObj[0]);
							}
						}
					});
				}
			}	
			return contextItems;
		},
		/**
		 * The method responsible for creating buttons inside the context app widget
		 */
		getContextAsAppItems : function(rb,record,widgetObj){
			var arrContextApps = [];
			var menuId = null;
			var viewId = IMM.getDefaultView(widgetObj.itemId);
			var viewMD = IMM.getView(viewId).VIEW_MD;
			var menuItems = IMM.getContextMenuList(viewId);
			if (Ext.isEmpty(menuItems)) {
				return;
			}
			var menu_id = viewId;
			var cArray = null;
			if(CMHR.getCondition(viewId)!== undefined && Ext.isFunction(CMHR.getCondition(viewId))){
				cArray =  CMHR.getCondition(viewId)(record);
			}
			if(!Ext.isEmpty(menuItems)){
				contextArray = menuItems[0].child_nodes;
				for(var i= 0;i<contextArray.length;i++){
					if(contextArray[i].context_type === "APP"){
						menuId = contextArray[i].menu_id;
						if( cArray===null|| cArray.contains(menuId)){
							var displayLabel = contextArray[i].display_key_nm;
							if(!cbx.isEmpty(viewMD.FLD_BUNDLE_KEY)){
								displayLabel = CRB.getBundle(viewMD.FLD_BUNDLE_KEY) && 
									CRB.getBundle(viewMD.FLD_BUNDLE_KEY)['LBL_'+displayLabel] ?  CRB.getBundle(viewMD.FLD_BUNDLE_KEY)['LBL_'+displayLabel] : displayLabel;
							}
							else {
								displayLabel = CRB.getFWBundle() && CRB.getFWBundle()['LBL_'+displayLabel] ? CRB.getFWBundle()['LBL_'+displayLabel]: displayLabel;
							}
							var contextApp = this.getContextApp(displayLabel,menuId,record,widgetObj,contextArray[i]);
							arrContextApps.push(contextApp);
						}
					}
				}
			}
			return arrContextApps;
		},
		/**
		 * The button configuration of all the buttons inside context-apps
		 */
		getContextApp : function(label,menuId,record,grid,menuObj){
			var iconCls = menuId+"-cls";
			var config = {
					scope : this,
					menuId : menuId,
					record : record,
					grid : grid,
					menuObj:menuObj 
			};
			return new Ext.Panel({
				handler : this.executeHandler,
				scope : config,
				cls : 'contextapp-c', 
				label: label,
				itemId : menuId,
				iconCls : iconCls,
				hidden : true,
				update : function(){
					this.tpl.overwrite(this.body, {
						ICON_CLS : this.iconCls,
						LABEL :this.label 
				});
				},
				 tpl : new Ext.XTemplate(
				/* Selected and unselected app starts*/
								'<div class="appicon-wrap"><div   class="appicon-default {ICON_CLS} "></div>','</div>', 
								'<div class = "div-ab-wrap"><center>{LABEL}</center></div>'
								),
				listeners : {
					render : function()
					{
					this.update();
                    
					
					var EL = Ext.Element;
					var panelBody = this.body;
					this.btnDiv = new EL(panelBody.dom.childNodes[0]); 
					this.el.on('click',this.handler,this.scope,this,this.btnDiv);
					var totalCntxtActions=this.ownerCt.items;
					var firstCntxtAction=totalCntxtActions.itemAt(0).itemId;
					if(this.itemId==firstCntxtAction)
					{
						 this.btnDiv.addClass('LayoutAppsContainerOpacVal');
					}
					this.btnDiv.on('click',function()
					{	
						var totalItems=this.ownerCt.items;
						for(var i=0;i<totalItems.length;i++)
						{
							 var eachItem=new Ext.Element(this.ownerCt.items.itemAt(i).body.dom.childNodes[0]);
							 if(totalItems.itemAt(i).itemId!=this.itemId)
							 {
								 eachItem.removeClass('LayoutAppsContainerOpacVal');
							 }
						}
						if(this.btnDiv.dom.className.indexOf('LayoutAppsContainerOpacVal')==-1)
						{
							this.btnDiv.addClass('LayoutAppsContainerOpacVal');
						}
					},this);
					this.btnDiv.addClass('LayoutAppsContainerOpacNone');
					/* Selected and unselected app ends*/
						
					},
					show: function(){
						this.el.fadeIn();
					}
				}
			});
		},
		/**
		 * The button Handler for every button in the context App widget
		 */
		executeHandler : function(){
			var delayConf = 0;
			var config = {
					record : this.record,
					scope :this.scope,
					grid : this.grid,
					menuObj: this.menuObj	
			};
			var menuId = this.menuId;
			if(menuId === "CUSTOM_APP"){
				var customAppWin =  new Ext.Window({
					height : 200,
					width : 200,
					frame    : true,
					closable : true,
					autoScroll : true,
					modal:true,
					resizable : true,
					html     : '<b>This space is under construction</b>' 
				});
				customAppWin.show();
			}
			else{
				var task = new Ext.util.DelayedTask(function(){
					this[2].getEl().removeClass('hide-cls');
					this[2].getEl().addClass('bump-up');
					if(CMHR.getHandler(menuId)===null){
						if(this[2].findParentByType('portlet').getComponent(0).getEl().isMasked()===true){
							this[2].findParentByType('portlet').getComponent(0).getEl().unmask();
						}
					}
					if(cbx.form.FormManager !== undefined){
						if(!Ext.isEmpty(config.menuObj) && !Ext.isEmpty(config.menuObj.child_nodes)){
							var cMenu = CBXCONTEXTMENU.generateSubMenu(config.record,config.menuObj,
									IMM.getDefaultView(config.record.widObj.itemId),"APP" );
							var evt = Ext.EventObject;
							cMenu.showAt(evt.getXY());
						}else{
							CMHR.executeHandler(menuId, config);
						}	
					}
					else {
						CBXDOWNLOADMGR.requestScripts([cbx.downloadProvider.getConstant("FORM_FRAMEWORK"),cbx.downloadProvider.getConstant("FORM_CONTAINER_FRAMEWORK")],function(){
							if(!Ext.isEmpty(config.menuObj) && !Ext.isEmpty(config.menuObj.child_nodes)){
								var cMenu = CBXCONTEXTMENU.generateSubMenu(config.record,config.menuObj,
										IMM.getDefaultView(config.record.widObj.itemId),"APP" );
								var evt = Ext.EventObject;
								cMenu.showAt(evt.getXY());
							}else{
								CMHR.executeHandler(menuId, config);
							}	
						});
					}
				});
				task.delay(delayConf,null,[config,menuId,arguments[2]]); 
			}
		},
		generateSubMenu : function(record, menuData,view_id,subMenuFor){
			var childMenuCssClass = ""; 
			if(subMenuFor == "ICON"){
				childMenuCssClass = 'ct-context-default-icon'
			}
			else if(subMenuFor == "APP"){
				childMenuCssClass = 'ct-context-default-app'
			}
			var menuChildData = menuData.child_nodes;
			var	menuObj = new Ext.menu.Menu({
				id : menuData.menu_id,
				ignoreParentClicks : true,
				cls : 'ct-contextmenu-wrap'
			});
			var that = this;
			var viewMD = IMM.getView(view_id).VIEW_MD;
			for(var m=0; m<menuChildData.length; m++){
				var displayLabel = menuChildData[m].display_key_nm;
				if(!cbx.isEmpty(viewMD.FLD_BUNDLE_KEY)){
					displayLabel = CRB.getBundle(viewMD.FLD_BUNDLE_KEY) 
						&& CRB.getBundle(viewMD.FLD_BUNDLE_KEY)['LBL_'+displayLabel] ?  CRB.getBundle(viewMD.FLD_BUNDLE_KEY)['LBL_'+displayLabel] : displayLabel;
				}
				else {
					displayLabel = CRB.getFWBundle() && CRB.getFWBundle()['LBL_'+displayLabel] ? CRB.getFWBundle()['LBL_'+displayLabel]: displayLabel;
				}
				if (menuChildData[m].container_flag === 'Y') {
					menuObj.add({
						text : subMenuFor == "APP" ? displayLabel : "",
						cls : childMenuCssClass + ' ct-context-'+menuChildData[m].menu_id,
						altText : displayLabel,
						menu : that.generateSubMenu(record, menuChildData[m],view_id,subMenuFor)
					});
				}
				else {
					menuObj.add({
						text : subMenuFor == "APP" ? displayLabel : "",
						wsId : view_id,
						altText : displayLabel,
						cls : childMenuCssClass + ' ct-context-'+menuChildData[m].menu_id,
						itemId : menuChildData[m].menu_id,
						productCode : menuChildData[m].od_product_code,
						subProductCode : menuChildData[m].od_subprod_code,
						functionCode : menuChildData[m].od_function_code,
						actionCode : menuChildData[m].action,
						pageCode : menuChildData[m].page_code,
						hostCode : menuChildData[m].host_code,
						record : record,
						eventId : menuChildData[m].event_id,
						formContainerId : menuChildData[m].form_container_id,
						formId : menuChildData[m].form_id,
						contextActionType : menuChildData[m].context_type,
						grid:  menuChildData[m].grid || '',
						addnlConfig: menuChildData[m].addnlConfig || {} , 
						handler : that.menuclickHandler
					});
				}
			}
			return menuObj;
		},
		/**
		 * This function triggers the generation of context menus
		 */
		generateContextMenu : function (menu_items, view_id, menu_id, record){
			var that = cbx.contextMenu.contextMenuRenderer;
			var menuData = null;
			/**
			 * To destroy a menuObj if it is already available
			 */
			//Added the condition Ext.isEmpty((Ext.getCmp(menu_id)).mv to prevent the view from getting destroyed
			if (!Ext.isEmpty(Ext.getCmp(menu_id))  && Ext.isEmpty((Ext.getCmp(menu_id)).mv)) {
				Ext.getCmp(menu_id).destroy();
			}
			if (!Ext.isEmpty(menu_items[0])) {
				menuData = menu_items[0];
			}
			if (!Ext.isEmpty(menuData)) {
				var menuObj = that.generateMenu(record, menuData, view_id);
				return menuObj;
			}
		},
		generateMenu : function (record, menuData, view_id, menuObj){
			var that = cbx.contextMenu.contextMenuRenderer;
			if (menuObj == null) {
				menuObj = new Ext.menu.Menu({
					id : menuData.menu_id,
					ignoreParentClicks : true
				});
			}
			var viewMD = IMM.getView(view_id).VIEW_MD;
			if (menuData != null && menuData.child_nodes != null) {
				for ( var i = 0; i < menuData.child_nodes.length; i++) {
					if(menuData.child_nodes[i].context_type === "MENU"){
						displayLabel = menuData.child_nodes[i].display_key_nm;
						if(!cbx.isEmpty(viewMD.FLD_BUNDLE_KEY)){
							displayLabel = CRB.getBundle(viewMD.FLD_BUNDLE_KEY) && 
								CRB.getBundle(viewMD.FLD_BUNDLE_KEY)['LBL_'+displayLabel] ?  CRB.getBundle(viewMD.FLD_BUNDLE_KEY)['LBL_'+displayLabel] : displayLabel;
						}
						else {
							displayLabel = CRB.getFWBundle() && CRB.getFWBundle()['LBL_'+displayLabel] ? CRB.getFWBundle()['LBL_'+displayLabel]: displayLabel;
						}
						
						if (!Ext.isEmpty(menuData.child_nodes[i]) && !Ext.isEmpty(menuData.child_nodes[i].child_nodes)
										&& menuData.child_nodes[i].container_flag === 'Y') {
							menuObj.add({
								text : displayLabel,
								menu : this.generateMenu(record, menuData.child_nodes[i], view_id)
							});
						} 
						else {
							/**
							 * for Menu Separator
							 */
							if (menuData.child_nodes[i].menu_separator == 'Y') {
								menuObj.add('-');
							}
							if (menuData.child_nodes[i].container_flag === 'N'
										&& menuData.child_nodes[i].menu_separator != 'Y') {
								/**
								 * Adding menu item that will raise the click event
								 * to be captured and targeted to the
								 * cbx.ContextMenuHandlerRegistry.js
								 * 
								 * In the the presence MENUS_AVAILABLE key in record
								 * in order to state the menus to be shown by the developer.
								 */
								if (this.doValidate(menuData.child_nodes[i].menu_id,record)) {
								
										menuObj.add({
											text : displayLabel,
											wsId : view_id,
											itemId : menuData.child_nodes[i].menu_id,
											productCode : menuData.child_nodes[i].od_product_code,
											subProductCode : menuData.child_nodes[i].od_subprod_code,
											functionCode : menuData.child_nodes[i].od_function_code,
											actionCode : menuData.child_nodes[i].action,
											pageCode : menuData.child_nodes[i].page_code,
											hostCode : menuData.child_nodes[i].host_code,
											record : record,
											eventId : menuData.child_nodes[i].event_id,
											formContainerId : menuData.child_nodes[i].form_container_id,
											formId : menuData.child_nodes[i].form_id,
											contextActionType : menuData.child_nodes[i].context_type,
												grid:  menuData.child_nodes[i].grid || '',
												addnlConfig: menuData.child_nodes[i].addnlConfig || {} , 
											handler : that.menuclickHandler
										});
								
								} 
								
							}
						}
					}
				}
				return menuObj;
		    }
		},
		doValidate : function(menuId,record){
			var valFlag = true;
			/**
			 * backward compat
			 */
			var menusAvail = record.MENUS_AVAILABLE;
			if(menusAvail && menuId in record.MENUS_AVAILABLE){
				return true;
			}
			else if(menusAvail && !(menuId in record.MENUS_AVAILABLE)){
				return false;
			}
			if(this.customCondition.length>0){
				if(this.customCondition.contains(menuId)){
					return true;
				}
				else{
					return false;
				}
			}
			return valFlag;
			
		},
		/**
		 * This function decides the handler to be attached to the menuObj
		 */
		menuclickHandler : function (menuObj){
			var that = cbx.contextMenu.contextMenuRenderer;
			if (!Ext.isEmpty(menuObj.formContainerId)) {
				that.callFormContainerHandler(menuObj);
			} 
			else {
				that.customMenuHandler(menuObj);
			}
		},
		/**
		 * This function associates the form Container Id and context menu id to
		 * the handler registry
		 */
		callFormContainerHandler : function (menuObj){
			new cbx.contextMenu.formHandlerExecutor(menuObj, menuObj.formContainerId, menuObj.formId);
		},
		/**
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
				contextActionType : menuObj.contextActionType,
				grid: menuObj.grid, 
				addnlConfig: menuObj.addnlConfig,
				record : menuObj.record
			});
		}
	};
}();
CBXCONTEXTMENU = cbx.contextMenu.contextMenuRenderer;
/*
 * Default Handler: Executes the handler in the presence of form container id/
 * window id attached to the menu node
 */
cbx.contextMenu.formHandlerExecutor = function (menuObj, windowId, formId){

	CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["FORM_CONTAINER"]),function(){
		var rowData;
		// Assigning the row data to a Variable
		if (menuObj.record) {
			rowData = menuObj.record.data;
		}
	
		CBXFORMCONTAINER.getWindowByFormId(formId, windowId, rowData);
	});
};
