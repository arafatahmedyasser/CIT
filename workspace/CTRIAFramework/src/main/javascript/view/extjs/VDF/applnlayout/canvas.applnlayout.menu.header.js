/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
cbx.namespace('canvas.applnlayout.menu');

canvas.applnlayout.menu.header = Ext.extend(Ext.Panel,{
	collapsible : false,
	hidden : false,
	initComponent : function(){
	var defaultConfig = {
	xtype:'panel',
	layout : 'column',
	cls : 'menulayoutheaderpanel',
	layoutConfig : {
		columns : 6
	},
	items : [{
		border : false,
		columnWidth : 0.03,
		html : '<div ><a class="menu_layout_show_icon" title="Menu"  onclick="javascript:canvas.showWkspaceInMlayout();"></div>'
	},
	{
		columnWidth : 0.25,
		border : false,
		cls : 'cardlogo-con',
		html : '<div class="cardlogo"></div>'
	},
	{
		columnWidth : 0.25,
		id : 'wstitle',
		border : false,
		html : '<div class="workspacetitle">'
					+ iportal.workspace.metadata.getCurrentWorkspaceTitle()
					+ '</div>'
	},
	{
		xtype : 'cbx-userimage-menulayout',
		URL : './PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER',
		width : 58,
		qtip : 'User Image',
		height : 58,
		cls : 'cbxuserimage-wrap-layoutmenu',
		columnWidth : 0.05
	},
	{
		columnWidth : 0.18,
		border : false,
		cls : 'menulayoutuserdetails',
		html : '<div class="menulayoutuserdetails-con"><p class="menulayoutusername">'
					+ iportal.preferences.getLoggedInUserName()
					+ '</p><p class="menulayoutlastlogin">Last Logged In: '
					+ iportal.preferences.getLastLoginDateTime() + '</p></div>'
	},
	{
		id: 'dockMenu',
		cls:'dockMenuCls',
		columnWidth : 0.10,
		border: false,
		html: '<div ><a class="dock_menu_layout_show_icon" id="dock_menu_layout_show_icon" href="#" onclick="javascript:canvas.applnlayout.menu.dockLayer();"></div>'
	}
	]
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.menu.header.superclass.initComponent.call(this);
		var menuWidth = 90;
		var menuHeight = Ext.getCmp('CONTENT_AREA') != null ? Ext.getCmp('CONTENT_AREA').getInnerHeight() : 570;
		var position = [];
		position[0] = Ext.getCmp('CONTENT_AREA') != null ? Ext.getCmp('CONTENT_AREA').getInnerWidth() - menuWidth : 1300;
		position[1] = Ext.getCmp('APPLICATION_HEADER_AREA').height;

		if (Ext.getCmp("DOCK_LAYER_MENU") == null)
		{
			var menu = new Ext.menu.Menu({
				id : "DOCK_LAYER_MENU",
				// height : menuHeight,
				maxWidth : menuWidth,
				maxHeight : menuHeight,
				shadow : false,

				listeners : {
					'show' : {
						fn : function (menu)
						{
							if (menu.hidden)
								menu.getEl().slideIn('tr', {
									easing : 'easeIn',
									callback : function ()
									{
										if (this.afterShow)
											this.afterShow(true);
									},
									scope : menu
								});

						}
					},
					'hide' : {
						fn : function (menu)
						{
							/*
							 * menu.getEl().slideOut('tr',{easing:'easeOut',callback: function(){ // this.el.hide(); //
							 * this.afterHide(true); }, scope:menu});
							 */
							Ext.getCmp('CONTENT_AREA').removeClass('dockMENU_visible');
						}
					}
				},
				items : new Ext.Panel({
					id : 'WIDGET_CATALOGUE_OUTER',
					html : '<div class="widgetcatlContainer" id="widgetCatalogContainer"></div>',
					/*items : new Ext.Panel({
						id : 'WIDGET_CATALOGUE',
						border : true,
						align : 'center',
						layout : 'column',
						width : menuWidth,
						cls : 'widgetCat_menuLayout',*/
						listeners : {
							'afterrender' : function (catPanel)
							{/*
								if (this.items.length == 0)
								{
									var cacheArr = iportal.workspace.metadata.getCatalogCache();
									if (cacheArr != null && cacheArr.length > 0)
									{
										for (var i = 0; i < cacheArr.length; i++)
										{
											cacheArr[i].columnWidth = 0.33;
											iportal.jsutil.addIconToCatalog(cacheArr[i]);
										}
										if (Ext.getCmp("widgetCatOuterId") == null)
										{
											Ext.DomHelper.insertBefore("WIDGET_CATALOGUE_OUTER", {
												tag : 'div',
												id : 'widgetCatOuterId',
												cls : 'widgetCatOuterCls'
											});
										}
										Ext.getCmp("DOCK_LAYER_MENU").doLayout();

									}
								}
							*/
								var obj = new Ext.Container(
		      								{
		      									border : true,
		      									align : 'center',
		      									layout : 'column',
		      									width : menuWidth,
		      									cls : 'widgetCat_menuLayout',
		      									renderTo : 'widgetCatalogContainer'
								});
								CCDM.getInstance().on('appdocked',function(dockItem){
									var tip;
									
									if(Ext.getCmp("dock_menu_tooltip")==null)
									{
									tip = new Ext.ToolTip({
												target : Ext.get('dock_menu_layout_show_icon'),
												html : '<div class="dock_menu_tooltip_cls">Apps closed here </div>',
												autoDestroy : true,
												cls:'dock_menu_tooltip',
												id:'dock_menu_tooltip',
												// autoHide:false,
												anchor : 'top',
												shadow : false
											});
									}
									else
										tip=Ext.getCmp("dock_menu_tooltip");
									if (!tip.isVisible())
										tip.show();	
									canvas.applnlayout.menu.dockLayer();
									setTimeout(function(){
										if(Ext.getCmp("DOCK_LAYER_MENU")!=null)
											Ext.getCmp("DOCK_LAYER_MENU").hide();
									
									}, 1500);
		      				    	var iconArr = this.find("itemId", dockItem.itemId);
		      				    	if(iconArr!=null && iconArr[0] != null ){
		      				    		iconArr[0].show();
		      						}
		      				    	else {
		      				    		isHomeIcon = (dockItem && dockItem.isHomeIcon === 'Y' ) ? true : false;
		      				    		if(!isHomeIcon){
		      				    			appIconObj = {
		      				    						xtype : 'iportal-catalog-icon',
		      				    						iconCls : dockItem.id,
		      				    						itemId : dockItem.id,
		      				    						hidden : false,
		      				    						label : dockItem.label,
		      				    						scale : 'large',
		      				    						handler : function() {
		      				    							var widgetContainer = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer();
		      				    							IMM.markWidgetOpened(dockItem.id);
		      				    							iportal.workspace.metadata.updateWidgetDef(iportal.workspace.metadata.getCurrentLayoutId(), dockItem.id, {
		      				    								CLOSED_IND : 'N'
		      				    							});
		      				    							CCDM.removeIconFromAppDock(dockItem.id);
		      				    							widgetContainer.addWidget(dockItem.id);
		      				    						}
		      				    					};
		      				    		}
		      				    		else {
		      				    			appIconObj = {
		      				     						xtype : 'iportal-catalog-icon',
		      				    						iconCls : 'master',
		      				    						itemId : "MASTER_ICON",
		      				    						hidden : false,
		      				    						scale : 'large',
		      				    						label : 'HOME',
		      				    						handler : function() {
		      				    							iportal.workspace.metadata.getWorkspaceManager().activate("MASTER_PANEL");
		      				    						}
		      				     			};
		      				    		}
		      				    		this.add(appIconObj);
		      				    	}
		      				    	this.doLayout();
		      				    },obj);
		      					CCDM.getInstance().on('appundocked',function(itemId){
		      				    	this.remove(itemId);
		      				    },obj);
		      					CCDM.getInstance().on('removeall',function(){
		      				    	this.removeAll(true);
		      				    },obj);
		      					Ext.getCmp("DOCK_LAYER_MENU").doLayout();
						}
					  }
					})
				});
			menu.showAt(position);
		} 
		else
		{
			Ext.getCmp("DOCK_LAYER_MENU").showAt(position);
		}
	}
});
	

CLCR.registerCmp({"COMPONENT":"menuheader","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.menu.header); 

canvas.applnlayout.menu.dockLayer = function ()
{
	// Ext.getCmp('CONTENT_AREA').addClass('dockMENU_visible');
	var menuWidth = 90;
	var menuHeight = Ext.getCmp('CONTENT_AREA') != null ? Ext.getCmp('CONTENT_AREA').getInnerHeight() : 570;
	var position = [];
	position[0] = Ext.getCmp('CONTENT_AREA') != null ? Ext.getCmp('CONTENT_AREA').getInnerWidth() - menuWidth : 1300;
	position[1] = Ext.getCmp('APPLICATION_HEADER_AREA').height;

	if (Ext.getCmp("DOCK_LAYER_MENU") == null)
	{
		var menu = new Ext.menu.Menu({
			id : "DOCK_LAYER_MENU",
			// height : menuHeight,
			maxWidth : menuWidth,
			maxHeight : menuHeight,
			shadow : false,

			listeners : {
				'show' : {
					fn : function (menu)
					{
						if (menu.hidden)
							menu.getEl().slideIn('tr', {
								easing : 'easeIn',
								callback : function ()
								{
									if (this.afterShow)
										this.afterShow(true);
								},
								scope : menu
							});

					}
				},
				'hide' : {
					fn : function (menu)
					{
						/*
						 * menu.getEl().slideOut('tr',{easing:'easeOut',callback: function(){ // this.el.hide(); //
						 * this.afterHide(true); }, scope:menu});
						 */
						Ext.getCmp('CONTENT_AREA').removeClass('dockMENU_visible');
					}
				}
			},
			items : new Ext.Panel({
				id : 'WIDGET_CATALOGUE_OUTER',
				html : '<div class="widgetcatlContainer" id="widgetCatalogContainer"></div>',
				/*items : new Ext.Panel({
					id : 'WIDGET_CATALOGUE',
					border : true,
					align : 'center',
					layout : 'column',
					width : menuWidth,
					cls : 'widgetCat_menuLayout',*/
					listeners : {
						'afterrender' : function (catPanel)
						{/*
							if (this.items.length == 0)
							{
								var cacheArr = iportal.workspace.metadata.getCatalogCache();
								if (cacheArr != null && cacheArr.length > 0)
								{
									for (var i = 0; i < cacheArr.length; i++)
									{
										cacheArr[i].columnWidth = 0.33;
										iportal.jsutil.addIconToCatalog(cacheArr[i]);
									}
									if (Ext.getCmp("widgetCatOuterId") == null)
									{
										Ext.DomHelper.insertBefore("WIDGET_CATALOGUE_OUTER", {
											tag : 'div',
											id : 'widgetCatOuterId',
											cls : 'widgetCatOuterCls'
										});
									}
									Ext.getCmp("DOCK_LAYER_MENU").doLayout();

								}
							}
						*/
							var obj = new Ext.Container(
	      								{
	      									border : true,
	      									align : 'center',
	      									layout : 'column',
	      									width : menuWidth,
	      									cls : 'widgetCat_menuLayout',
	      									renderTo : 'widgetCatalogContainer'
							});
							CCDM.getInstance().on('appdocked',function(dockItem){
								var tip;
								var closedAppCount = CCDM.getAppDockItems().length;
								if (!cbx.isEmpty(Ext.getCmp("dockMenu"))){
									Ext.getCmp("dockMenu").update('<div><a class="dock_menu_layout_show_icon" id="dock_menu_layout_show_icon" href="#" onclick="javascript:canvas.applnlayout.menu.dockLayer();"><span class="closed-app-counter closed-app-counter_is-adding">'+ closedAppCount +'</span></a></div>');
								}
								if(Ext.getCmp("dock_menu_tooltip")==null)
								{
								tip = new Ext.ToolTip({
											target : Ext.get('dock_menu_layout_show_icon'),
											html : '<div class="dock_menu_tooltip_cls">Apps closed here </div>',
											autoDestroy : true,
											cls:'dock_menu_tooltip',
											id:'dock_menu_tooltip',
											// autoHide:false,
											anchor : 'top',
											shadow : false
										});
								}
								else
									tip=Ext.getCmp("dock_menu_tooltip");
								if (!tip.isVisible())
									tip.show();	
								canvas.applnlayout.menu.dockLayer();
								setTimeout(function(){
									if(Ext.getCmp("DOCK_LAYER_MENU")!=null)
										Ext.getCmp("DOCK_LAYER_MENU").hide();
								
								}, 1500);
	      				    	var iconArr = this.find("itemId", dockItem.itemId);
	      				    	if(iconArr!=null && iconArr[0] != null ){
	      				    		iconArr[0].show();
	      						}
	      				    	else {
	      				    		isHomeIcon = (dockItem && dockItem.isHomeIcon === 'Y' ) ? true : false;
	      				    		if(!isHomeIcon){
	      				    			appIconObj = {
	      				    						xtype : 'iportal-catalog-icon',
	      				    						iconCls : dockItem.id,
	      				    						itemId : dockItem.id,
	      				    						hidden : false,
	      				    						label : dockItem.label,
	      				    						scale : 'large',
	      				    						handler : function() {
	      				    							var widgetContainer = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer();
	      				    							IMM.markWidgetOpened(dockItem.id);
	      				    							iportal.workspace.metadata.updateWidgetDef(iportal.workspace.metadata.getCurrentLayoutId(), dockItem.id, {
	      				    								CLOSED_IND : 'N'
	      				    							});
	      				    							CCDM.removeIconFromAppDock(dockItem.id);
	      				    							widgetContainer.addWidget(dockItem.id);
	      				    						}
	      				    					};
	      				    		}
	      				    		else {
	      				    			appIconObj = {
	      				     						xtype : 'iportal-catalog-icon',
	      				    						iconCls : 'master',
	      				    						itemId : "MASTER_ICON",
	      				    						hidden : false,
	      				    						scale : 'large',
	      				    						label : 'HOME',
	      				    						handler : function() {
	      				    							iportal.workspace.metadata.getWorkspaceManager().activate("MASTER_PANEL");
	      				    						}
	      				     			};
	      				    		}
	      				    		this.add(appIconObj);
	      				    	}
	      				    	this.doLayout();
	      				    },obj);
	      					CCDM.getInstance().on('appundocked',function(itemId){
	      						var closedAppCount = CCDM.getAppDockItems().length;
								if (!cbx.isEmpty(Ext.getCmp("dockMenu"))){
									Ext.getCmp("dockMenu").update('<div><a class="dock_menu_layout_show_icon" id="dock_menu_layout_show_icon" href="#" onclick="javascript:canvas.applnlayout.menu.dockLayer();"><span class="closed-app-counter closed-app-counter_is-adding">'+ closedAppCount +'</span></a></div>');
								}
	      				    	this.remove(itemId);
	      				    },obj);
	      					CCDM.getInstance().on('removeall',function(){
	      						var closedAppCount = CCDM.getAppDockItems().length;
								if (!cbx.isEmpty(Ext.getCmp("dockMenu"))){
									Ext.getCmp("dockMenu").update('<div><a class="dock_menu_layout_show_icon" id="dock_menu_layout_show_icon" href="#" onclick="javascript:canvas.applnlayout.menu.dockLayer();"><span class="closed-app-counter closed-app-counter_is-adding">'+ closedAppCount +'</span></a></div>');
								}
	      				    	this.removeAll(true);
	      				    },obj);
	      					Ext.getCmp("DOCK_LAYER_MENU").doLayout();
					}
				  }
				})
			});
		menu.showAt(position);
	} 
	else
	{
		Ext.getCmp("DOCK_LAYER_MENU").showAt(position);
	}
};

canvas.showWkspaceInMlayout = function ()
{
	var rb = CRB.getFWBundle();
	var wsTitleArray = [];
	var position = [];
	position[0] = 0;
	position[1] = Ext.getCmp('APPLICATION_HEADER_AREA').height;
	if (!cbx.isEmpty(Ext.getCmp('MENU_HEADER_LAYOUT')))
	{
		Ext.getCmp('MENU_HEADER_LAYOUT').destroy();
	}
	Ext.getCmp('CONTENT_AREA').addClass('wsconMENU_visible');
	
	var menuHeight=Ext.getCmp('CONTENT_AREA')!=null?Ext.getCmp('CONTENT_AREA').getInnerHeight():570;
	
	var menu = new Ext.menu.Menu({
		items : wsTitleArray,
		region : 'frame',
		id : 'MENU_HEADER_LAYOUT',
		height : menuHeight,
		maxHeight : menuHeight,
		listeners : {
			'click' : function (index)
			{

			},
			'show' : {
				fn : function (menu)
				{
					//menu.getEl().slideIn('l');
				}
			},
			'hide' : {
				fn : function (menu)
				{
					Ext.getCmp('CONTENT_AREA').removeClass('wsconMENU_visible');
				}
			}
		}
	});
	menu.add(new Ext.Panel({
		plain : true,
		width : 210,
		boxMaxHeight : menuHeight-50,
		items : canvas.getWorkspacePanel(this)
	}));
	menu.showAt(position);
};

canvas.getWorkspacePanel = function ()
{
	var rb = CRB.getFWBundle();
	var itemArray = [];
	var canvasDockArr = CCDM.getCanvasDockItems();
	if(!cbx.isEmpty(canvasDockArr)){
		for(var i =0; i < canvasDockArr.length; i++) {
			if(canvasDockArr[i].canvasId != 'addnewworkspace') {
				itemArray.push({
						xtype : 'canvas-menulayout-icon',
						iconCls : canvasDockArr[i].canvasId,
						itemId : canvasDockArr[i].canvasId,
						columnWidth : 1,
						height : 30,
						hidden : false,
						draggable : false,
						label : canvasDockArr[i].canvasLabel,
						scale : 'small',
						style : 'margin:10px',
						cls: iportal.workspace.metadata.getCurrentWorkspaceId()===canvasDockArr[i].canvasId?'menulayoutwsicon_selected':'',
						handler : function() {
							cbx.AppContainerUtil.goToWorkspace(this.itemId);
							Ext.getCmp('MENU_HEADER_LAYOUT').destroy();
							Ext.getCmp('CONTENT_AREA').removeClass('wsconMENU_visible');
						}
				});
			}
			if(canvasDockArr[i].canvasId == 'addnewworkspace') {
				itemArray.push({
							xtype : 'canvas-menulayout-icon',
							columnWidth : 1,
							height : 30,
							scale : 'small',
							style : 'margin:10px',
							hidden : false,
							draggable : false,
							label : CRB.getFWBundle()['LBL_DYC'], 
							itemId : canvasDockArr[i].canvasId,
							iconCls : canvasDockArr[i].canvasId,
							handler : function() {

								CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray([ "APPSTORE" ]), function () 
										{
									cbx.appstore.Jsutil.initAppstore();
								});
								Ext.getCmp('MENU_HEADER_LAYOUT').destroy();
							}
						});
			}
		}
	}

	var iconPanel = new Ext.Panel({
		layout : 'column',
		columnWidth : 1,
		width : 210,
		id : 'MENU_LAYOUT_PANEL_INNER',
		items : itemArray
	});
	return iconPanel;
};
