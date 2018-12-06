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
Ext.namespace('iportal.widget');

/*
 * @class MultiWidgetCard class provided a container to load all its child widgets into individual tabs
 */

iportal.widget.MultiWidgetCard = Ext.extend(Ext.TabPanel, {
	childWidgets : [],
	id : null,
	bundle : CRB.getFWBundleKey(),
	autoHeight : true,
	baseCls : 'appCard x-card-panel',
	applyParentHeight : false,
	initComponent : function ()
	{
		this.rb = CRB.getBundle(this.bundle);
		var defaultConfig = {
			xtype : 'tabpanel',
			border : true,
			enableTabScroll : true,
			frame : true,
			itemId : this.itemId,
			isContainerWidget : true,
			collapsible : false,
			items : this.createItems()
		};
		// Attaching the validatedrop event to the multi widget tab
		this.addEvents({
			validatedrop : true
		});
		Ext.apply(this, defaultConfig);
		this.on("validdrop", this.onResize, this);
		// whenever the validdrop event is raised, the the tab will be re sized
		iportal.widget.MultiWidgetCard.superclass.initComponent.apply(this);
	},
	/*
	 * Method for loading empty tabs for all the child widgets provided in the meta data
	 */
	createItems : function ()
	{
		var itemArr = new Array();
		for (var index = 0; index < this.childWidgets.length; index++)
		{

			var rbw = CRB.getBundle(this.childWidgets[index].WIDGET_BUNDLE_KEY);
			
			itemArr[itemArr.length] = new Ext.Panel({
				autoHeight : (!this.applyParentHeight),
				height : this.applyParentHeight ? this.height : null,
				autoWidth : true,
				metadata : this.childWidgets[index], 
				parentHeight : this.parentHeight,
				applyParentHeight : this.applyParentHeight,
				title : this.childWidgets[index].VIEWS_LIST[0] ? 
						
						(null == rbw[this.childWidgets[index].VIEWS_LIST[0].VIEW_DISPLAY_NM]
						? this.childWidgets[index].VIEWS_LIST[0].VIEW_DISPLAY_NM
						: rbw[this.childWidgets[index].VIEWS_LIST[0].VIEW_DISPLAY_NM]) :
							
						(null == rbw[this.childWidgets[index].WIDGET_DISPLAY_NM]
						? this.childWidgets[index].WIDGET_DISPLAY_NM
						: rbw[this.childWidgets[index].WIDGET_DISPLAY_NM]),
				itemId : this.childWidgets[index].WIDGET_ID,
				mode : 'local',
				myTab : this,
				listeners : {
					"activate" : this.tabSelectionHandler,
					scope : this,
					"deactivate" : this.tabDeSelectionHandler
				},
				/**
				 * Passing the show tool flag to the immediate parent. This flag is needed to be received by the portlet
				 * instance
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
				 * Passing the show currency flag to the immediate parent. This flag is needed to be received by
				 * the portlet instance
				 */
				showCurrencyInd : function (showFlag)
				{
					if (this.ownerCt && this.ownerCt.showCurrencyInd)
					{
						this.ownerCt.showCurrencyInd(showFlag);
					}
				},
				getToolsMap : function ()
				{
					if (this.ownerCt && this.ownerCt.getToolsMap)
					{
						return this.ownerCt.getToolsMap();
					} else
						return {};
				}
			});
		}
		return [ itemArr ];
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
		//  Clean the custom tools of the previous view.
		var keys;
		var ii;

		var toolsMap = this.getToolsMap();
		if (!Ext.isEmpty(toolsMap))
		{

			for (var i = 0, keys = Object.keys(toolsMap), ii = keys.length; i < ii; i++)
			{
				if (keys[i] == "close")
				{
					toolsMap[keys[i]].remove(true);
					delete toolsMap[keys[i]];
				}
				if (keys[i].indexOf("__CUSTOM") != -1)
				{
					toolsMap[keys[i]].remove(true);
					delete toolsMap[keys[i]];
				}
			}
		}

		this.showToolIcon(showToolsFlag);

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
					LOGGER.error("issue in Destroying" + e);
				}
			}, 500);
		} catch (e)
		{
			LOGGER.error("issue in Destroying" + e);
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

			/**
			 * 
			 * 
			 * @resizeafterdatacall:The event "resizeafterdatacall" is attached in multiview. Receiving and firing the
			 *                          event to the portlet
			 */
			var that = this;
			widget.mv.on('resizeafterdatacall', function (recordCount)
			{
				that.ownerCt.fireEvent('resizeafterdatacall', recordCount);
			});

			
		
			tabPanel.setHeight(tabPanel.height); // To Double check the tabpanel config height is update in the screen
			if (this.applyParentHeight)
			{
				widget.setParentHeight(tabPanel.height - 29); 
			} else
			{
				// reducing the widget height as 25 px will be used the tab
				// itself for its tab strip
				widget.mv.height = widget.mv.height - 29;
			}
			widget.mv.loadingInContainer = true;
			widget.mv.isParentPortlet = false;
			widget.mv.draggable = false;
			widget.mv.isLoadingToolsInside = true;// to load widget tools inside widget, not at the container
													// level

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
			LOGGER.error("issue in initiating apps" + e);
		}
	},
	afterRender : function ()
	{
		this.activate(0);
		if (this.ownerCt != null)
			this.ownerCt.doLayout();
		iportal.widget.MultiWidgetCard.superclass.afterRender.apply(this, arguments);
	},

	getToolsMap : function ()
	{
		if (this.ownerCt && this.ownerCt.getToolsMap)
		{
			return this.ownerCt.getToolsMap();
		} else
			return {};
	},

	/**
	 * Passing the show tool flag to the immediate parent. This flag is needed to be received by the portlet instance
	 */
	showToolIcon : function (showFlag)
	{
		if (this.ownerCt.showToolIcon)
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
		if (this.ownerCt.showCurrencyInd)
		{
			this.ownerCt.showCurrencyInd(showFlag);
		}
	},
	
	/**
	 * Return the tool menu instance from the view. All the menu actions will also be mapped appropriately with the view
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

	/**
	 * Intended to find the position of the child by its id. This will be used
	 * majorly for activating a child widget
	 */
	findIndexOfChild : function (itemId){
		for ( var i = 0; i < this.items.length; i++) {
			if ((!Ext.isEmpty(this.items.itemAt(i))) && (this.items.itemAt(i).itemId == itemId))
				return i;
		}
	},
	
	activateChildCard : function(cardId){
		var cardIndex = this.findIndexOfChild(cardId);
	    this.setActiveTab(cardIndex);
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

		if (this.getActiveTab() && this.getActiveTab() != null)
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

		if (this.getActiveTab() && this.getActiveTab() != null)
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
	updateHeight : function (height)
	{

		/**
		 * For updating child widget height and width, while resizing the indexed multi widget have to delete thelast
		 * size of the widget size and have to set the height "undefined". and set the activetab height.
		 */
		delete this.lastSize;
		this.setHeight(undefined);
		this.getActiveTab().autoHeight = false;
		this.getActiveTab().setHeight(height);

		this.getActiveTab().getComponent(0).updateHeight(height - 29);
		this.applyParentHeight = true;
		var cs = this.items.items;
		for (var i = 0, len = cs.length; i < len; i++)
		{
			var c = cs[i];
			c.height = height;
			c.autoHeight = false; 
		}

	}

});
