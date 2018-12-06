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

/**
 * ===============================================================================================
 * CHANGE CODE 		AUTHOR 				DESCRIPTION 									   DATE
 *  JQTBS01 		ArunKumar Sekar 	Creating initial Context Actions 				26-02-2015
 * ===============================================================================================
 */

cbx.ns("canvas.lib");
/**
 * @className : canvas.lib.listContext
 * @description: Handles list view filters. <BR>
 * 
 */
canvas.lib.listContext = Class({
	
	/**
	 * Class constructor, prepares all parameters
	 */
	
	contextColumnIconClass: "",
	
	constructor: function(config){
		this.contextMenu = config.contextMenu;
		this.viewMD = config.viewMD;
		this.parent = config.parent;
	},
	/**
	 * returns the array containing context menu items
	 */
	getContextMenuList: function(){
		var contextMenuArr = [];
		if(this.viewMD.FLD_CONTEXT_ACTION_IND == "Y"){
			if(!cbx.isEmpty(this.contextMenu)){
				var contextMenu = this.contextMenu[0].child_nodes,
					menuLength = contextMenu.length;
				for(var i=0; i<menuLength; i++){
					if(contextMenu[i].menu_id != contextMenu[i].view_id){
						var contextObj = {
									"MENUID": contextMenu[i].menu_id,
									"LABEL": contextMenu[i].display_key_nm,
									"TYPE": contextMenu[i].context_type
								}
						if(!cbx.isEmpty(contextMenu[i].child_nodes)){
							contextObj.SUBMENU = contextMenu[i].child_nodes;
						} 
						if(contextMenu[i].menu_separator == "Y") contextObj.SEPERATE = "Y";
						contextMenuArr.push(contextObj);
					}
				}
			}
			return contextMenuArr;
		}
	},
	
	/**
	 * returns the array containing context submenu icons
	 * @sibilings
	 * @container
	 */
	getContextIconChilds: function(sibilings, container){
		if(!cbx.isEmpty(sibilings)){
			var menuLength = sibilings.length;
			for(var i=0; i<menuLength; i++){
				if(sibilings[i].container_flag == "Y" && 
					!cbx.isEmpty(sibilings[i].child_nodes)){
					this.getContextIconChilds(sibilings[i].child_nodes,container);
				} else {
					var cClass = sibilings[i].view_id+"_"+sibilings[i].menu_id+"_ACTION flaticon-checked";
					$a = $("<a/>").attr({"href":"javascript:void(0)",
												 "data-placement" :"auto",
												 "data-toggle": "tooltip",
												 "data-context-id": sibilings[i].menu_id,
												 "title": sibilings[i].display_key_nm,
												 "class":cClass}).html(sibilings[i].display_key_nm);
					$container.append($a);
				}
			}
		}
	},
	/**
	 * returns the array containing context menu icons
	 */
	getContextIconList: function(){
		$container = '';
		if(this.viewMD.FLD_CONTEXT_ACTION_IND == "Y"){
			var contextMenu = this.contextMenu[0].child_nodes;
			var menuLength = contextMenu.length;
			$container = $("<div />").attr({"class":"context-icons", "data-icns-context":"true"});
			for(var i=0; i<menuLength; i++){
				if(contextMenu[i].context_type == "ICON"){
					if(contextMenu[i].container_flag == "Y" && 
						!cbx.isEmpty(contextMenu[i].child_nodes)){
						this.getContextIconChilds(contextMenu[i].child_nodes,$container);
						} else {
						var cClass = contextMenu[i].view_id+"_"+contextMenu[i].menu_id+"_ACTION flaticon-checked";
							$a = $("<a/>").attr({"href":"javascript:void(0)",
												 "data-toggle": "tooltip",
												 "data-placement" :"auto",
											 "data-context-id": contextMenu[i].menu_id,
											 "title": contextMenu[i].display_key_nm,
											 "class":cClass}).html(contextMenu[i].display_key_nm);
							$container.append($a);
					}
				}
			}
		}
		return $container[0].outerHTML;
	},
	
	getMenuRenderType: function() {
		return this.contextMenu[0].context_type;
	},
	
	getMenuRenderApp: function() {
		return this.contextMenu[0].context_app_widget_id;
	},
	/**
	 * returns the DOM to render context menu as buttons in action column 
	 */
	getContextBtnMenu: function(iconClass){
		var iconClass = iconClass || "flaticon-bullet_list1";
		var html = '<div class="btn-group" data-context-paging="true"><button data-icn-action="context" type="button" class="btn btn-default btn-sm dropdown-toggle"  data-placement="auto" data-toggle="dropdown" aria-label="Right Click Action">';
			html += '<span class="'+iconClass+'" aria-hidden="true"></span>';
			html += '</button>';
			html += '<div class="ct-dropdown">';
			html += this.getContextMenuHtml();
			html += '</div> </div>';
		return html;
	},
	/**
	 * creates and returns the submenu DOM 
	 * @submenu submenu configuration  
	 */
	createSubMenu: function(submenu){
		var html = "";
		if(submenu.length > 0){
			html = '<ul class="dropdown-menu pull-right">';
			for(var i = 0; i<submenu.length; i++){
				if(submenu[i].child_nodes.length > 0){
					html += '<li class="dropdown dropdown-submenu ct-dropdown">';
					html += '<a href="javascript:void(0)" data-context-id="'+submenu[i].menu_id+'">'+submenu[i].display_key_nm+'</a>';
					html += this.createSubMenu(submenu[i].child_nodes);
				} else {
					html += '<li>';
					html += '<a href="javascript:void(0)" data-context-id="'+submenu[i].menu_id+'">'+submenu[i].display_key_nm+'</a>';
				}
				html += '</li>';
			}
			html += '</ul>';
		}
		return html;
	},
	/**
	 *  creates and returns DOM for context menu 
	 */
	
	/* Use this for Context App */
	
	getContextMenuHtml: function(){
		var html = "";
		var menu = this.getContextMenuList() ? this.getContextMenuList() : [];
		if(menu.length > 0){
			html += '<ul data-context="submenu" class="dropdown-menu ct-dropdown-menu pull-left ct-dropdown-dynamic" role="menu">';
			for(var i=0; i<menu.length; i++){
				if(menu[i].SEPERATE){
					html += '<li class="divider"></li>';
				}
				if(menu[i].SUBMENU){
					html += '<li class="dropdown dropdown-submenu ct-dropdown">';
					var anchor = '<a href="javascript:void(0)" data-context-id="'+menu[i].MENUID+'">'+menu[i].LABEL+'</a>';
					html += anchor;
					html += this.createSubMenu(menu[i].SUBMENU);
					html += '</li>';
					
					
				} else
					html += '<li><a href="javascript:void(0)" data-context-id="'+menu[i].MENUID+'">'+menu[i].LABEL+'</a></li>';
			}
			html += '</ul>';
			
		}

		return html;
	},
	/**
	 * Responsible to handle context menu events 
	 */
	triggerEvent : function(identifier,menuID,helper){
		// prevents undefined
		var config = {};
		if(!cbx.isEmpty(identifier)){
				helper.setData(identifier);
			config = {
				record: {"data": helper.getRow()},
				menuObj: this.contextMenu,
				scope: this.parent
			};
		}
		CMHR.executeHandler(menuID, config);
	},
	
	attachContextEventHandlers: function(helper){
		var _this = this;
		
		/** 
		 * Context Menu Handlers, Handlers only when right click is happend
		 */
		$(".ct-listview__context-menu").on("click","li > a",function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			// since its delegate event, requires immediate propagation
			evt.stopImmediatePropagation();
			var id = $(this).data("context-id"),
				id = $.trim(id),
				identifier = $.trim($(this).parents("tr").find("td:first").data("item-data"));
			_this.triggerEvent(identifier,id,helper);
			return false;
		});
		
		/**
		 * Handles icons context menu, Paging as well as context column
		 */
		$("div[data-icns-context='true'] a").on("click", function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			evt.stopImmediatePropagation();
			var menuID = $.trim($(this).data("context-id")),
				identifier = $(this).parents("td").data("item-data");
			_this.triggerEvent(identifier,menuID,helper);
			return false;
		});
		/**
		 * Paging Context Handlers
		 */
		$("div[data-context-paging='true']").on("click","ul.dropdown-menu a",function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			// since its delegate event, requires immediate propagation
			evt.stopImmediatePropagation();
			var menuID = $.trim($(this).data("context-id")),
				identifier = $(this).parents("td").data("item-data");
			_this.triggerEvent(identifier,menuID,helper);
			$("div[data-context-paging='true']").find("ul.dropdown-menu").remove();
			return false;
		});
	}
	
});
	
cbx.contextMenu.contextMenuRenderer = function (){
	return {
		getContextMenuList: function(scope){
			var contextMenuArr = [];
			if(scope.viewMD.FLD_CONTEXT_ACTION_IND == "Y"){
				if(!cbx.isEmpty(scope.contextMenu)){
					var contextMenu = scope.contextMenu[0].child_nodes,
						menuLength = contextMenu.length;
					for(var i=0; i<menuLength; i++){
						if(contextMenu[i].menu_id != contextMenu[i].view_id){
							var contextObj = {
										"MENUID": contextMenu[i].menu_id,
										"LABEL": contextMenu[i].display_key_nm,
										"TYPE": contextMenu[i].context_type
									}
							if(!cbx.isEmpty(contextMenu[i].child_nodes)){
								contextObj.SUBMENU = contextMenu[i].child_nodes;
							} 
							if(contextMenu[i].menu_separator == "Y") contextObj.SEPERATE = "Y";
							contextMenuArr.push(contextObj);
						}
					}
				}
			return contextMenuArr;
			}
		},
		getContextMenu: function(scope, record, event) {
			
			var menuRenderApp = CBXCONTEXTMENU.getMenuRenderApp(scope.portlet.renderer.renderer.context);
			var contextContainer = $("body").find('[data-widgetid='+menuRenderApp+']').find('[data-item-id=portlet-main-content]');
			
			if((!cbx.isEmpty(contextContainer))){
		
				var menuList = CBXCONTEXTMENU.getContextMenuHtml(scope.portlet.renderer.renderer.context);
				
				$(contextContainer).html(menuList);
				CBXCONTEXTMENU.contextMenuHandlers(scope.portlet.renderer.renderer.context, record);
				
				var contextMenu = scope.portlet.renderer.renderer.context.contextMenu[0].child_nodes;
				var menuObj = {};
				for(var i=0; i<contextMenu.length; i++){
					if(contextMenu[i].default_menu == 'Y'){
						menuObj = contextMenu[i];			
						break;
					}
				}
				if(!cbx.isEmpty(menuObj)) {
					CBXCONTEXTMENU.menuclickHandler(menuObj, record);
				}
				
				/*LOGGER.log("contextContainer", contextContainer);*/
				/*LOGGER.log("menuList", menuList);*/				
			}			
		},	
		contextMenuHandlers: function(scope, record)
		{
			var menuRenderApp = CBXCONTEXTMENU.getMenuRenderApp(scope);
			var contextMenu = scope.contextMenu[0].child_nodes;
			var contextContainer = $("body").find('[data-widgetid='+menuRenderApp+']').find('[data-item-id=portlet-main-content]');
			for(var i=0; i<contextMenu.length; i++){
				$(contextContainer).find('[data-context-id='+ contextMenu[i].menu_id +']').bind('click', function() {
					var contextId = $(this).data('context-id');
					var menuObj = {};
					for(var i=0; i<contextMenu.length; i++){
						if(contextMenu[i].menu_id == contextId){
							menuObj = contextMenu[i];
							break;
						}
					}
					CBXCONTEXTMENU.menuclickHandler(menuObj, record);
				});
			}
		},
		getContextMenuHtml: function(scope){
			var html = "";
			var menu = this.getContextMenuList(scope) ? this.getContextMenuList(scope) : [];
			if(menu.length > 0){
				html += '<ul data-context="submenu" class="pull-left ct-dropdown-dynamic ct-context-app" role="menu">';
				for(var i=0; i<menu.length; i++){
					if(menu[i].SEPERATE){
						html += '<li class="divider"></li>';
					}
					if(menu[i].SUBMENU){
						html += '<li class="dropdown dropdown-submenu ct-dropdown">';
						var anchor = '<a href="javascript:void(0)" data-context-id="'+menu[i].MENUID+'">'+menu[i].LABEL+'</a>';
						html += anchor;
						html += this.createSubMenu(menu[i].SUBMENU);
						html += '</li>';				
					} else
						html += '<li><a href="javascript:void(0)" data-context-id="'+menu[i].MENUID+'">'+menu[i].LABEL+'</a></li>';
				}
				html += '</ul>';		
			}
			return html;
		},
		getMenuRenderType: function(scope) {
			return scope.contextMenu[0].context_type;
		},
		getMenuRenderApp: function(scope) {
			return scope.contextMenu[0].context_app_widget_id;
		},
		menuclickHandler : function (menuObj, record){
			if (!cbx.isEmpty(menuObj.form_container_id)) {
				CBXCONTEXTMENU.callFormContainerHandler(menuObj, record);
			} 
			else {
				CBXCONTEXTMENU.customMenuHandler(menuObj, record);
			}
		},
		/**
		 * This function associates the form Container Id and context menu id to
		 * the handler registry
		 */
		callFormContainerHandler : function (menuObj, record){
			new cbx.contextMenu.formHandlerExecutor(menuObj, menuObj.form_container_id, menuObj.form_id, record);
		},
		/**
		 * This function associates the handlers registered by the user in the
		 * context menu handler registry in the absence of form container id in
		 * the config object
		 */
		customMenuHandler : function (menuObj, record){
			CMHR.executeHandler(menuObj.menu_id, {
				menuId : menuObj.menu_id,
				wsId : menuObj.view_id,
				productCode : menuObj.od_product_code,
				subProductCode : menuObj.od_subprod_code,
				functionCode : menuObj.od_function_code,
				actionCode : menuObj.action,
				pageCode : menuObj.page_code,
				hostCode : menuObj.host_code,
				contextActionType : menuObj.context_type,
				record : record
			});
			/*LOGGER.log("menuObj", menuObj);*/
			/*LOGGER.log("record", record);*/
		}

	};
}();	
CBXCONTEXTMENU = cbx.contextMenu.contextMenuRenderer;

/*
 * Default Handler: Executes the handler in the presence of form container id/
 * window id attached to the menu node
 */
cbx.contextMenu.formHandlerExecutor = function (menuObj, windowId, formId, rowData){

	CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["FORM_CONTAINER"]),function(){
		var rowData;
		// Assigning the row data to a Variable
		/*		
		if (menuObj.record) {
			rowData = menuObj.record.data;
		}
		*/
		CBXFORMCONTAINER.getWindowByFormId(formId, windowId, rowData);
	});
};
