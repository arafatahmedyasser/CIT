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
 
 * @version 0.1
 */

Ext.namespace('iportal.widget');
/**
 * @class MultiWidgetSwitch class provide a container to load all its child widgets into a card layout and provide a
 *        tool in the widget's toolbar to swith between different widgets. The switch option will be available under the
 *        switch pref tool that is normally made available for customized widgets. But, if a normal widget is also
 *        mapped as a child widget then the preference tool will be attached with the widget with only menu item for
 *        "Switch View"
 */
iportal.widget.MultiWidgetSwitch = Ext.extend(Ext.Panel, {
	childWidgets : [],
	id : null,
	bundle : CRB.getFWBundleKey(),
	autoHeight : true,
	applyParentHeight : false,
	switchList : [],
	updatedHeight : null,// will be used if the Switch panel width is updated
	// and its de-active children donot have updated
	// height
	draggable : false,
	initComponent : function ()
	{
		this.rb = CRB.getBundle(this.bundle);
		var defaultConfig = {
			xtype : 'panel',
			baseCls : 'list-view',
			border : true,
			frame : true,
			draggable : false,
			itemId : this.itemId,
			isContainerWidget : true,
			collapsible : false,
			activeItem : 0,
			layout : 'card',
			items : this.createItems()
		};
		Ext.apply(this, defaultConfig);
		iportal.widget.MultiWidgetSwitch.superclass.initComponent.apply(this);
		this.doLayout();
	},
	/*
	 * Method for loading child widgets provided in the meta data
	 */
	createItems : function ()
	{
		var itemArr = [];
		var items = [];
		this.switchList = [];
		var title, widgetTitle;
		for (var index = 0; index < this.childWidgets.length; index++)
		{
			
			/**
			 * Passing additionalConfig object to all the child items
			 * 
			 * @see iportal.widget.MultiWidget.js
			 */
			try
			{
				itemArr.push({
					autoHeight : (!this.applyParentHeight),
					height : this.applyParentHeight ? this.height : null,
					autoWidth : true,
					parentHeight : this.parentHeight,
					applyParentHeight : this.applyParentHeight,
					/*
					 * title : null == this.rb[this.childWidgets[index].WIDGET_DISPLAY_NM] ?
					 * this.childWidgets[index].WIDGET_DISPLAY_NM : this.rb[this.childWidgets[index].WIDGET_DISPLAY_NM],
					 */itemId : this.childWidgets[index].WIDGET_ID,
					mode : 'local',
					// myTab : this,
					listeners : {
						"activate" : this.tabSelectionHandler,
						scope : this,
						"deactivate" : this.tabDeSelectionHandler
					},
				
					/* To get the tools map of the widget header. */
					getToolsMap : function ()
					{
						if (this.ownerCt && this.ownerCt.getToolsMap)
						{
							return this.ownerCt.getToolsMap();
						} else
							return {};
					},
					
					/**
					 * Passing the show tool flag to the immediate parent. This flag is needed to be received by the
					 * portlet instance
					 */
					showToolIcon : function (showFlag)
					{
						if (this.ownerCt.showToolIcon)
						{
							this.ownerCt.showToolIcon(showFlag);
						}
					},
					/**
					 * Passing the currency to the immediate parent. This flag is needed to be received by the
					 * portlet instance
					 */
					setCurrency : function (currency)
					{
						if (this.ownerCt && this.ownerCt.setCurrency)
						{
							this.ownerCt.setCurrency(currency);
						}
					},
					/**
					 * Passing the show currency flag to the immediate parent. This flag is needed to be received
					 * by the portlet instance
					 */
					showCurrencyInd : function (showFlag)
					{
						if (this.ownerCt && this.ownerCt.showCurrencyInd)
						{
							this.ownerCt.showCurrencyInd(showFlag);
						}
					},
					setTitle : function (title)
					{
						if (this.ownerCt && this.ownerCt.setTitle)
						{
							this.ownerCt.setTitle(title);
						}
					}
				});

			} catch (e)
			{
				LOGGER.error("Error launching " + this.childWidgets[index].WIDGET_ID + " : ", e);
			}
		}
		return [ itemArr ];
	},
	/**
	 * The method is expected to create the menu options for all the Widgets mapped to the swith container as well as
	 * their custom views. The consolidation on the custom views will be done either using the either IMM if the meta
	 * data is updated otherwise from the multi widget request.
	 * 
	 * @returns an associative array of all with child widgets and custom views in a Ext.menu option format
	 */
	getMenuOptions : function (mvh)
	{
		var widgetMenu = [], viewmenu = [];
		var widgetList = this.childWidgets;
		var vmd = mvh.getSelectedViewMd();
		var currentViewId = vmd.VIEW_MD.VIEW_ID;
		var that = this;
		var allViews, title;
		for (var i = 0, len = widgetList.length; i < len; i++)
		{
			allViews = IMM.getViewsList(widgetList[i].WIDGET_ID);
			allViews = allViews || widgetList[i].VIEWS_LIST;
			if (allViews != null)
			{
				for (var j = 0, viewLen = allViews.length; j < viewLen; j++)
				{
					if ([ j ] != null && allViews[j].DEFAULT_VIEW_IND === 'N')
					{
						title = null == this.rb[allViews[j].VIEW_DISPLAY_NM] ? allViews[j].VIEW_DISPLAY_NM
									: this.rb[allViews[j].VIEW_DISPLAY_NM];
						viewmenu.push({
							/*
							 * updating the css class if the to brign tick mark on the current selected view in the
							 * "Swith Menu" options list
							 */
							iconCls : currentViewId === allViews[j].VIEW_ID ? 'selected-preference'
										: 'user-defined-preference',
							text : title,
							hidden : false,
							widgetId : widgetList[i].WIDGET_ID,
							selviewid : allViews[j].VIEW_ID,
							handler : function ()
							{
								if (that.layout.activeItem.itemId == this.widgetId)
								{
									mvh.switchPreference(this.selviewid);
								} else
								{
									that.switchWiget(this.widgetId, this.selviewid);
								}
							}
						});
					} else if (allViews[j] != null && allViews[j].DEFAULT_VIEW_IND === 'Y')
					{
						var rbw = CRB.getBundle(widgetList[i].WIDGET_BUNDLE_KEY);
						
						/*title = null == rbw[widgetList[i].WIDGET_DISPLAY_NM] ? widgetList[i].WIDGET_DISPLAY_NM		
						: rbw[widgetList[i].WIDGET_DISPLAY_NM];*/
						
						title = null == rbw[widgetList[i].VIEWS_LIST[j].VIEW_DISPLAY_NM] ? widgetList[i].VIEWS_LIST[j].VIEW_DISPLAY_NM
												: rbw[widgetList[i].VIEWS_LIST[j].VIEW_DISPLAY_NM];										

						widgetMenu.push({
							iconCls : 'default-preference',
							text : title,
							hidden : false,
							widgetId : widgetList[i].WIDGET_ID,
							selviewid : allViews[j].VIEW_ID,
							handler : function ()
							{
								if (that.layout.activeItem.itemId == this.widgetId)
								{
									mvh.switchPreference(this.selviewid);
								} else
								{
									that.switchWiget(this.widgetId, this.selviewid);
								}
							}
						});
					}
				}
			}
		}
		return {
			'WIDGET_MENU' : widgetMenu,
			'VIEW_MENU' : viewmenu
		};
	},
	/**
	 * Expected to provide the menu options with proper handler mapping for all the Widgets > Views to me made available
	 * for the "Swith View" option of the Multi Widget Switch Container.
	 */
	getSwitchMenu : function (mvh)
	{
		var menuObj = this.getMenuOptions(mvh);
		var switchMenu = [];
		var widgetMenu = menuObj.WIDGET_MENU;
		var viewMenu = menuObj.VIEW_MENU;
		var widgetId;
		
		for (var i = 0, wLen = widgetMenu.length; i < wLen; i++)
		{
			widgetId = widgetMenu[i].widgetId;
			
			//Menu Item for user-defined views
			var toolItem={
					iconCls : 'default-preference',
					text : widgetMenu[i].text,   
					ignoreParentClicks : true,
					menu:  {
						items:[]
					}
			};
					
			//Menu Item for Sub-Menu which includes System view, -, User-Defined Views
			var mainItem={
					iconCls : 'default-preference',
					text : widgetMenu[i].text,   
					ignoreParentClicks : true,
					menu:  {
						items:[]
					}
			};

			//Menu Item for system views
			var toolMainItem={
					iconCls : 'default-preference',
					text : widgetMenu[i].text,   
					ignoreParentClicks : true,
					menu:  {
						items:[
							widgetMenu[i]
						]
					}
			};

			var u=0, userItems = [];					
			for (var j = 0; j < viewMenu.length; j++) {	
				
				//Conditional check to add user-defined views to items of toolItem
				if (viewMenu[j].widgetId === widgetId){
					for ( var k = j; k < viewMenu.length;k++) {
							toolItem.menu.items = viewMenu[k];
							userItems[u++]=toolItem.menu.items;
							break;
					}
				}
			}
			
			//Enable user-defined views based on active parent widget
			if(this.layout.activeItem.items.items[0].itemId === widgetId){
				mainItem.menu.items[1]=	'-';								
				mainItem.menu.items[2]=userItems;							//Adding User-defined Views to sub-menu
			}
				
			mainItem.menu.items[0]=toolMainItem.menu.items;				//Adding System Views to sub-menu	
			
			//Check for user-defined views exists or not
			if(userItems.length>0){
				switchMenu.push(mainItem);
			}else{
				switchMenu.push(widgetMenu[i]);
			}
			
			switchMenu.push('-'); 
		}		
		return switchMenu;
	},
	/**
	 * Helper method to switch between the mapped widgets/ views.
	 * 
	 * @widgetId Id of the Widget that needs to be made active
	 */
	switchWiget : function (widgetId, viewId)
	{
		if (viewId != null)
		{
			this.defaultLaunchViewId = viewId;
		}
		this.getLayout().setActiveItem(this.findIndexOfChild(widgetId));

	},
	/**
	 * @returns The current Active Widget.
	 */
	getActiveTab : function ()
	{
		return this.layout.activeItem;
	},
	/**
	 * Intended to find the position of the child by its id. This will be used majorly for activating a child widget
	 */
	findIndexOfChild : function (itemId)
	{
		for (var i = 0; i < this.items.length; i++)
		{
			if ((!Ext.isEmpty(this.items.itemAt(i))) && (this.items.itemAt(i).itemId == itemId))
				return i;
		}
	},
	updateHeight : function (height)
	{
		
		this.getActiveTab().items.itemAt(0).updateHeight(height);
		this.applyParentHeight = true;
		var cs = this.items.items;
		for (var i = 0, len = cs.length; i < len; i++)
		{
			var c = cs[i];
			c.height = height;
		}

		
	},
	/*
	 * Destroy the current child widget component before moving to another tab
	 */
	tabDeSelectionHandler : function (tabPanel)
	{
		// disabling the tool icon. this should be updated by the newly
		// activated widget

		
		var showToolsFlag = {
			"TOOLS_IND" : false,
			"HELP_IND" : false,
			"EXCEL_IND" : false,
			"PDF_IND" : false,
			"CSV_IND" : false,
			"FILTER_IND" : false,
			"REFRESH_IND" : false,
			"PRINT_IND" : false,
			"MAXIMIZE_IND" : false,
			"CHART_TOOL_IND" : false,
			"COLLAPSE_IND" : false,
			"PREFS_IND" : false,
			"SWITCH_WIDGET_IND" : false
		
		};

		this.showToolIcon(showToolsFlag);
		
		/* this.showToolIcon(false); */
	
		/* Destroying the objects after a lag */
		try
		{
			setTimeout(function ()
			{
				try
				{
					tabPanel.items.itemAt(0).destroy();
					tabPanel.doLayout();
				} catch (e)
				{
					LOGGER.error("issue in Destroying" +e);
				}
			}, 500)
		} catch (e)
		{
			LOGGER.error("issue in Destroying" +e);
		}

	},
	/*
	 * Load the widget under its associated panel following the existing framework
	 */
	tabSelectionHandler : function (tabPanel)
	{
		try
		{
			/**
			 * Passing additionalConfig object to all the child items
			 * 
			 * @see iportal.widget.MultiWidget.js
			 */
			var widget = canvas.view.appRegisterMap && canvas.view.appRegisterMap[tabPanel.itemId]
						? canvas.view.appRegisterMap[tabPanel.itemId](this.additionalConfig) : null;
			if (!widget)
			{
				var metadata = {
					WIDGET_ID : tabPanel.itemId,
					additionalConfig : this.additionalConfig
				}
				widget = iportal.listview.listviewrenderermap.getWidget(metadata);
			}
			
			// widget.setParentHeight(tabPanel.height-25)
			if (this.applyParentHeight)
			{
				widget.setParentHeight(tabPanel.height);
			} else
			{
				// reducing the widget height as 25 px will be used the tab
				// itself for its tab strip
				widget.mv.height = widget.mv.height;
			}
			widget.mv.loadingInContainer = true;
			widget.mv.draggable = false;
			widget.mv.enableWidgetSwitch = true;
			
			// resetting the additional Config in case it is not available.
			widget.mv.additionalConfig = widget.mv.additionalConfig || this.additionalConfig;
			
			this.appMVRegistry.registerWidget(tabPanel.itemId, widget.mv);

			/*
			 * In case of singular widget loading from the MultiViewModel rather an new AJAX call Disabling the dragging
			 * adding the header to the mv
			 */
			if (!widget.isContainer)
			{
				if (widget.mv.mvh != null)
				{
					if (this.defaultLaunchViewId != null)
					{
						widget.mv.mvh.setDefaultView(this.defaultLaunchViewId);
						this.defaultLaunchViewId = null;
					}

					if (widget.mv.mvh.getSelectedPanel() != null)
					{
						widget.mv.mvh.getSelectedPanel().draggable = false;
						widget.mv.mvh.getSelectedPanel().setTitle(widget.mv.mvh.getSystemViewTitle());
					} else
					{
						widget.mv.mvh.items.itemAt(0).draggable = false;
						widget.mv.mvh.items.itemAt(0).setTitle(widget.mv.mvh.getSystemViewTitle());

					}
					widget.mv.add(widget.mv.mvh);
					widget.mv.doLayout();
				}
			}

			tabPanel.add(widget.mv);
			tabPanel.doLayout();
		} catch (e)
		{
			LOGGER.error("issue in Loading the app" +e);
		}
	},
	afterRender : function ()
	{
		// this.(0);
		if (this.ownerCt != null)
			this.ownerCt.doLayout();
		iportal.widget.MultiWidgetSwitch.superclass.afterRender.apply(this, arguments);
	},
	/**
	 * Passing the show tool flag to the immediate parent. This flag is needed to be received by the portlet instance
	 */
	showToolIcon : function (showFlag)
	{
		if (this.ownerCt && this.ownerCt.showToolIcon)
		{
			this.ownerCt.showToolIcon(showFlag);
		}
	},
	/**
	 * Passing the show currency flag to the immediate parent. This flag is needed to be received by the portlet
	 * instance
	 */
	showCurrencyInd : function (showFlag)
	{
		if (this.ownerCt && this.ownerCt.showCurrencyInd)
		{
			this.ownerCt.showCurrencyInd(showFlag);
		}
	},
	/**
	 * Return the tool menu instance from the view. All the menu actions will also be mapped appropriately with
	 * the view
	 */
	getToolsMenuItems : function ()
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.getToolsMenuItems)
			{
				return mv.getToolsMenuItems();
			}
		}
	},
	/**
	 * Passing the currency to the immediate parent. This flag is needed to be received by the portlet instance
	 */
	setCurrency : function (currency)
	{
		if (this.ownerCt && this.ownerCt.setCurrency)
		{
			this.ownerCt.setCurrency(currency);
		}
	},
	
	/**
	 * Return the preference menu instance from the view. All the menu actions will also be mapped appropriately with
	 * the view
	 */
	getPreferenceMenuItems : function ()
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.getPreferenceMenuItems)
			{
				return mv.getPreferenceMenuItems();
			}
		}
	},

	getTbarConf : function ()
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.getTbarConf)
			{
				return mv.getTbarConf();
			}
		}
	},


	/**
	 * Return the appropriate menu handler.
	 */
	handleToolAction : function (menuItem)
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.handleToolAction)
			{
				return mv.handleToolAction(menuItem);
			}
		}
	},
	
	/**
	 * Method to handle custom tool action @ param customToolId
	 */
	handleCustomToolAction : function (customToolId,toolScope)
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.handleCustomToolAction)
			{
				return mv.handleCustomToolAction(customToolId,toolScope);
			}
		}

	},
	/*
	 * The method return the child menu of the parent tool. @param menuId
	 */
	getCustomToolsMenuItems : function (menuId)
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.getCustomToolsMenuItems)
			{
				return mv.getCustomToolsMenuItems(menuId);
			}
		}

	},

	getPreferenceMenuItems : function ()
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.getPreferenceMenuItems)
			{
				return mv.getPreferenceMenuItems();
			}
		}
	},

	

	getTbarConf : function ()
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.getTbarConf)
			{
				return mv.getTbarConf();
			}
		}
	},

	getSwitchViewIcon : function ()
	{
		if (this.getActiveTab())
		{
			var mv = this.getActiveTab().getComponent(0);
			if (mv != null)
			{
				if (mv.getSwitchViewIcon)
				{
					return mv.getSwitchViewIcon();
				}
			}
		}
	},
	getSwitchChartIcon : function ()
	{
		if (this.getActiveTab())
		{
			var mv = this.getActiveTab().getComponent(0);
			if (mv != null)
			{
				if (mv.getSwitchChartIcon)
				{
					return mv.getSwitchChartIcon();
				}
			}
		}
	},

	/**
	 * OnChange of currency ,Passing the currency value to immediate parent
	 * 
	 * @param cmp
	 * @param rec
	 */
	onCurrChange : function (currency)
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null)
		{
			if (mv.onCurrChange)
			{
				return mv.onCurrChange(currency);
			}
		}

	},
	/**
	 *  Setting the title as per the current widget displayed on the screen. This is applicable for
	 * multiwidget containers where only one widget is displayed on the screen at a time.
	 */
	setTitle : function (title)
	{
		if (this.ownerCt && this.ownerCt.setTitle)
		{
			this.ownerCt.setTitle(title);
		}
	}

});
