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
/**
 * @class IndexedMultiWidget class provided a container to load all its child widgets into borderlayout with index
 *        panel.
 */
iportal.widget.IndexedMultiWidget = Ext.extend(Ext.Panel, {
	/**
	 * 
	 */
	childWidgets : [],
	/**
	 * 
	 */
	id : null,
	/**
	 * This attribute sets the bundle value and CUSER is the default value.
	 */
	bundle : CRB.getFWBundleKey(),

	/**
	 * This attribute decides the index panel position. The valid values are 'right' and 'left'.
	 * It will flip the index panel as per the RTL mode. Default value: 'left'
	 */
	indexPosition : 'left',

	/**
	 * This attribute decides whether the component has to include the default actions or not.
	 * If it set as 'true', it will the load the default buttons of the component at the bbar of
	 * the component. If it set as 'false', it wont load the default buttons of component.
	 * Default value: true
	 */
	loadDefaultActions : true,

	/**
	 * This attribute decides whether the component has to merge the child widgets bbar items
	 * with default buttons of the component. It will render the bbar items according to the
	 * button types (POSITIVE, NEGATIVE). The bbar items will be flip the bbar button as per the
	 * RTL mode. Default value : true
	 */
	mergeWidgetActions : true,

	/**
	 * This attribute decides which item has to be selected in index panel and loaded in the
	 * content panel by default. Default value : 0 - The first child component.
	 */
	selectedIndex : 0,

	/**
	 * This attribute sets the index panel width. It is fixed and not resizable.
	 */
	indexPanelWidth : 175,
	
	/**
	 * 
	 */
	contentPanelWidth : 0,

	/**
	 * This attribute sets the default padding value for the child widgets.
	 */
	padding : 5,

	/**
	 * This method sets the default configuration values for the component.
	 */
	initComponent : function ()
	{
		this.rb = CRB.getBundle(this.bundle);
		var multiWidgetExpPanel = this;
		var panelItems = [];
		/** Setting the panel Width. */
		var panelWidth = this.mymv.ownerCt.getWidth();
		this.indexPanelWidth = this.indexPanelWidth + 5;
		this.contentPanelWidth = panelWidth - this.indexPanelWidth;
		var defaultConfig = {
			xtype : 'panel',
			isContainerWidget : true,
			draggable : false,
			bodyStyle : 'background-color:#f0f0f0;',
			border : true,
			layout : 'border',
			panelWidth : panelWidth,
			parentWidget : this,
			bbar : [],
			getPanelWidth : function ()
			{
				return this.mymv.ownerCt.getWidth();
			}
		};
		panelItems.push(this.getIndexPanel(defaultConfig));
		panelItems.push(this.getContentPanel(defaultConfig));
		defaultConfig.items = panelItems;
		Ext.apply(this, defaultConfig);
		iportal.widget.IndexedMultiWidget.superclass.initComponent.apply(this);
		if (this.getBottomToolbar && this.getBottomToolbar())
		{
			if (this.getBottomToolbar().items.length == 0)
			{
				this.getBottomToolbar().hide();
			}
		}
	},

	/**
	 * This function is returning the index panel contents. This method overrides the expand and
	 * collapse listeners to set the width for the content and index panel items.
	 */
	getIndexPanel : function (config)
	{	
		var collapsed=false;
		var multiWidgetExpPanel = this;
		// the value of collapsed is set to true for the case of indexed multi widget containing only one child widget, thus colapsing the side panel by default
		if(multiWidgetExpPanel.childWidgets.length==1){
			collapsed=true;
		}
		var indexPanel = {
			collapseMode : 'mini',
			autoScroll : true, //Change made to display Vertical Scrollbar for INDEXED MultiWidget   
			split : true,
			collapsed:collapsed,
			bodyStyle : 'padding:' + multiWidgetExpPanel.padding + 'px',
			minSize : multiWidgetExpPanel.indexPanelWidth,
			maxSize : multiWidgetExpPanel.indexPanelWidth,
			width : multiWidgetExpPanel.indexPanelWidth + 15, //Change made to display Vertical Scrollbar for INDEXED MultiWidget  
			items : multiWidgetExpPanel.loadIndex(),
			/** Setting the listerners for expand and collapse events. */
			listeners : {
				"expand" : function (panelobj)
				{
					/**
					 * The code that was initially executing for both singular and multiwidgets
					 * was actually coded for singular widgets. Now changes have been made to
					 * execute that code only for singular widgets.
					 */
					var wgt = multiWidgetExpPanel.getComponent(1).getComponent(0);
					if (wgt.mwc != null && wgt.mwc.onResize)
					{
						wgt.mwc.onResize();
					} else
					{
						var centerPanelContent = multiWidgetExpPanel.items.get(1).items.get(0);
						var centerPanelViewContent = centerPanelContent.items.get(0).items
									.get(0);
						var centerPanelGrid = centerPanelViewContent.items.get(0).items.get(0);
						/** Calculating the new width. */
						var newWidth = multiWidgetExpPanel.getPanelWidth()
									- multiWidgetExpPanel.items.get(0).getWidth()
									- (multiWidgetExpPanel.padding * 2 + 5);
						centerPanelGrid.setWidth(newWidth);
						centerPanelViewContent.setWidth(newWidth);
						centerPanelContent.setWidth(newWidth);
						if (centerPanelContent.items.get(0).getBottomToolbar
									&& centerPanelContent.items.get(0).getBottomToolbar())
						{
							centerPanelContent.items.get(0).setWidth(newWidth);
							centerPanelContent.items.get(0).doLayout();
						}
						/**
						 * While expanding the panel the multi widget header is need to be
						 * update accordingly, for this the onResize() called.
						 */

						/**
						 * The if and else-if blocks are added for Getting multi widget grid
						 * scope for an Indexed multi widget
						 */
						if (centerPanelGrid.getView)
						{
							var gridView = centerPanelGrid.getView();
						} else if (centerPanelGrid.mvConf.items.items[0].items.items[0].items.items[0].items.items[0].getView)
						{
							var gridView = centerPanelGrid.mvConf.items.items[0].items.items[0].items.items[0].items.items[0]
										.getView();
						}
						gridView.forcefit = true;
						gridView.refresh(true);
					}
				},
				"collapse" : function (panelobj)
				{
					/**
					 * The code that was initially executing for both singular and multiwidgets
					 * was actually coded for singular widgets. Now changes have been made to
					 * execute that code only for singular widgets.
					 */
					//this is to display the spliter for the case of default collapse of side panel
					if(multiWidgetExpPanel.childWidgets.length==1){
						panelobj.ownerCt.layout.west.collapsedEl.setStyle('visibility', 'visible');
					}
					var wgt = multiWidgetExpPanel.getComponent(1).getComponent(0);
					if (wgt.mwc != null && wgt.mwc.onResize)
					{
						wgt.mwc.onResize();
					} else
					{
						var centerPanelContent = multiWidgetExpPanel.items.get(1).items.get(0);
						var centerPanelViewContent = centerPanelContent.items.get(0).items
									.get(0);
						var centerPanelGrid = centerPanelViewContent.items.get(0).items.get(0);
						/** Calculating the new width. */
						var newWidth = multiWidgetExpPanel.getPanelWidth()
									- (multiWidgetExpPanel.padding * 2 + 5);
						centerPanelViewContent.setAutoScroll(false);
						centerPanelGrid.setWidth(newWidth);
						centerPanelViewContent.setWidth(newWidth);
						centerPanelContent.setWidth(newWidth);
						if (centerPanelContent.items.get(0).getBottomToolbar
									&& centerPanelContent.items.get(0).getBottomToolbar())
						{
							centerPanelContent.items.get(0).setWidth(newWidth);
							centerPanelContent.items.get(0).doLayout();
						}
						/**
						 * While expanding the panel the multi widget header is need to be
						 * update accordingly, for this the onResize() called.
						 */
						/**
						 * The if and else-if blocks are added for Getting multi widget grid
						 * scope for an Indexed multi widget
						 */
						if (centerPanelGrid.getView)
						{
							var gridView = centerPanelGrid.getView();
						} else if (centerPanelGrid.mvConf.items.items[0].items.items[0].items.items[0].items.items[0].getView)
						{
							var gridView = centerPanelGrid.mvConf.items.items[0].items.items[0].items.items[0].items.items[0]
										.getView();
						}
						gridView.forcefit = true;
						gridView.refresh(true);
					}
				}
			}
		};
		/** Deciding the index panel region based on the index Position. */
		if (this.indexPosition == 'right')
		{
			indexPanel.region = 'east';
			indexPanel.id = multiWidgetExpPanel.id + "_east";
		} else
		{
			indexPanel.region = 'west';
			indexPanel.id = multiWidgetExpPanel.id + "_west";
		}
		return indexPanel;
	},

	/**
	 * This function is returning the content panel contents as center region.
	 */
	getContentPanel : function (config)
	{
		var multiWidgetExpPanel = this;
		var contentPanel = {
			region : 'center',
			autoScroll : false,
			id : multiWidgetExpPanel.id + "_center",
			width : multiWidgetExpPanel.contentPanelWidth,
			bodyStyle : 'padding:' + multiWidgetExpPanel.padding + 'px',
			xtype : 'container',
			layout : 'fit',
			cls : 'indexedPanel',
			widgetInPanel : null,
			loadWidgetInPanel : function (widgetId)
			{
				/** Destroying the existing content. */
				var centerPanelContent = this.ownerCt.items.get(1);
				if (centerPanelContent && centerPanelContent.items
							&& centerPanelContent.items.get(0))
				{
					centerPanelContent.items.get(0).destroy();
				}
				this.removeAll(true);
				var widget = multiWidgetExpPanel.loadWidget(widgetId);
				this.widgetInPanel = widget;
				var multiView = widget.mv;
				this.add(this.widgetInPanel.mv);
				if (multiWidgetExpPanel.mergeWidgetActions == true)
				{
					if (multiView.mvh && multiView.mvh.createBBarButtons)
					{
						this.showBottomBarButtons(multiView.mvh.createBBarButtons());
					}
				}
				this.doLayout();
			},
			
			/**
			 * This function is calling the showBottomBarButtons function of the immediate
			 * parent. It is used to display the bottomBarItems in the parent object's bbar.
			 */
			showBottomBarButtons : function (bottomBarItems)
			{
				if (this.ownerCt && this.ownerCt.showBottomBarButtons)
				{
					var bbarItems = multiWidgetExpPanel.mergeBottomBarButtons(bottomBarItems);
					this.ownerCt.showBottomBarButtons(bbarItems);
				}
			},

			/**
			 * Passing the show tool flag to the immediate parent. This flag is needed to be
			 * received by the portlet instance.
			 */
			showToolIcon : function (showFlag)
			{
				if (this.ownerCt && this.ownerCt.showToolIcon)
				{
					this.ownerCt.showToolIcon(showFlag);
				}
			},
			
			/**
			 * Return the tool menu instance from the view. All the menu actions will also be
			 * mapped appropriately with the view
			 */
			getToolsMenuItems : function ()
			{
				var mv = this.items.get(0);
				if (mv != null)
				{
					if (mv.getToolsMenuItems)
					{
						return mv.getToolsMenuItems();
					}
				}
			},
			
			/**
			 * 
			 */
			getSwitchViewIcon : function ()
			{
				var mv = this.items.get(0);
				if (mv != null)
				{
					if (mv.getSwitchViewIcon)
					{
						return mv.getSwitchViewIcon();
					}
				}
			},
			
			/**
			 * 
			 */
			getSwitchChartIcon : function ()
			{
				var mv = this.items.get(0);
				if (mv != null)
				{
					if (mv.getSwitchChartIcon)
					{
						return mv.getSwitchChartIcon();
					}
				}
			},
			
			/**
			 * Method to handle custom tool action @ param customToolId
			 */
			handleCustomToolAction : function (customToolId,toolScope)
			{
				var mv = this.items.get(0);
				if (mv != null)
				{
					if (mv.handleCustomToolAction)
					{
						return mv.handleCustomToolAction(customToolId,toolScope);
					}
				}
			},
			/**
			 * The method return the child menu of the parent tool. @param menuId
			 */
			getCustomToolsMenuItems : function (menuId)
			{
				var mv = this.items.get(0);
				if (mv != null)
				{
					if (mv.getCustomToolsMenuItems)
					{
						return mv.getCustomToolsMenuItems(menuId);
					}
				}

			},
			/**
			 * 
			 */
			getTbarConf : function ()
			{
				var mv = this.items.get(0);
				if (mv != null)
				{
					if (mv.getTbarConf)
					{
						return mv.getTbarConf();
					}
				}

			},

			/**
			 * 
			 */
			handleToolAction : function (menuItem)
			{
				var mv = this.items.get(0);
				if (mv != null)
				{
					if (mv.handleToolAction)
					{
						return mv.handleToolAction(menuItem);
					}
				}
			}
		};
		return contentPanel;
	},

	/**
	 * This function is used to load the index panel contents.
	 */
	loadIndex : function ()
	{
		var multiWidgetExpPanel = this;
		var indexItems = [];
		for (var index = 0; index < this.childWidgets.length; index++)
		{
			var itemid = this.childWidgets[index].WIDGET_ID;
			var rb = CRB.getBundle(this.childWidgets[index].WIDGET_BUNDLE_KEY);
			var cssName = 'indexedPanel-btn btn-' + itemid;
			var displayName = null;
			var lastState=Ext.state.Manager.get(this.childWidgets[index].WIDGET_ID+ "_MVH", 'NOT_FOUND');
			if(multiWidgetExpPanel.childWidgets[index].VIEWS_LIST.length>0){
				
				if(lastState!=='NOT_FOUND' && cbx.isObject(lastState)){
					var viewNmIndex=0;
					for(viewNmIndex=0;viewNmIndex<this.childWidgets[index].VIEWS_LIST.length;viewNmIndex++){
						if(this.childWidgets[index].VIEWS_LIST[viewNmIndex].VIEW_ID===lastState._mvhOpt.sel_vw){
							displayName = (null == rb[this.childWidgets[index].VIEWS_LIST[viewNmIndex].VIEW_DISPLAY_NM])
							? this.childWidgets[index].VIEWS_LIST[viewNmIndex].VIEW_DISPLAY_NM
							: rb[this.childWidgets[index].VIEWS_LIST[viewNmIndex].VIEW_DISPLAY_NM]
						}
					}
				}
				else{
					var viewNmIndex=0;
					for(viewNmIndex=0;viewNmIndex<this.childWidgets[index].VIEWS_LIST.length;viewNmIndex++){
						if(this.childWidgets[index].VIEWS_LIST[viewNmIndex].DEFAULT_VIEW_IND==='Y'){
							displayName = (null == rb[this.childWidgets[index].VIEWS_LIST[viewNmIndex].VIEW_DISPLAY_NM])
							? this.childWidgets[index].VIEWS_LIST[viewNmIndex].VIEW_DISPLAY_NM
							: rb[this.childWidgets[index].VIEWS_LIST[viewNmIndex].VIEW_DISPLAY_NM]
						}
					}
				}
		
			
			}
			else {
				displayName = (null == rb[multiWidgetExpPanel.childWidgets[index].WIDGET_DISPLAY_NM])
							? multiWidgetExpPanel.childWidgets[index].WIDGET_DISPLAY_NM
							: rb[multiWidgetExpPanel.childWidgets[index].WIDGET_DISPLAY_NM];
			}
			indexItems.push({
				xtype : 'button',
				iconAlign : 'left',
				cls : 'x-btn-txt-wrap',
				scale : 'medium',
				enableToggle : true,
				selectedIndex : index,
				width : this.indexPanelWidth - (this.padding * 2),
				iconCls : cssName,
				text : displayName,
				widgetid : multiWidgetExpPanel.childWidgets[index].WIDGET_ID,
				handler : function (btnConfig)
				{
					if (btnConfig)
					{
						/**
						 * Applying the appropriate css to the selected index. 
						 */
						for (var i = 0; i < multiWidgetExpPanel.childWidgets.length; i++)
						{
							if (btnConfig.selectedIndex == i)
							{
								multiWidgetExpPanel.items.get(0).items.get(i)
											.addClass("x-btn-pressed");
							} else
							{
								multiWidgetExpPanel.items.get(0).items.get(i)
											.removeClass("x-btn-pressed");
							}
						}
						/**
						 * Loading the selected widget. 
						 */
						Ext.getCmp(multiWidgetExpPanel.id + '_center')
									.loadWidgetInPanel(
												multiWidgetExpPanel.childWidgets[btnConfig.selectedIndex].WIDGET_ID);
					}
				}
			});
		}
		return indexItems;
	},

	/**
	 * This function is used to load the appropriate widget in the content panel.
	 */
	loadWidget : function (itemid)
	{
		var newHeight = this.ownerCt.getHeight() - 30;
		var defaultActions = [];
		if (this.loadDefaultActions == true)
		{
			if (this.loadDefaultPositiveButtons())
			{
				defaultActions.push(this.loadDefaultPositiveButtons());
			}
			if (this.loadDefaultNegativeButtons())
			{
				defaultActions.push(this.loadDefaultNegativeButtons());
			}
		}

		if (defaultActions.length > 0)
		{
			newHeight = newHeight - 30;
		}
		/**
		 * Passing additionalConfig object to all the child items
		 * 
		 * @see iportal.widget.IndexedMultiWidget.js
		 */
		var widget = canvas.view.appRegisterMap && canvas.view.appRegisterMap[itemid]
					? canvas.view.appRegisterMap[itemid](this.additionalConfig) : null;
		if (!widget)
		{
			var metadata = {
				WIDGET_ID : itemid,
				additionalConfig : this.additionalConfig
			}
			widget = iportal.listview.listviewrenderermap.getWidget(metadata);
		}
		widget.setParentHeight(newHeight);
		widget.mv.loadingInContainer = true;
		widget.mv.isParentPortlet = false;
		widget.mv.draggable = false;
		widget.mv.isLoadingToolsInside = true;
		widget.mv.ownerAcceptBBar = this.mergeWidgetActions;
		/**
		 * resetting the additional Config in case it is not available.
		 */
		widget.mv.additionalConfig = widget.mv.additionalConfig || this.additionalConfig;
		this.appMVRegistry.registerWidget(itemid, widget.mv);

		if (!widget.isContainer)
		{
			if (widget.mv.mvh != null)
			{
				widget.mv.mvh.mvConf.isLoadingToolsInside = true;
				widget.mv.mvh.ownerAcceptBBar = this.mergeWidgetActions;
				if (widget.mv.mvh.getSelectedPanel() != null)
				{
					widget.mv.mvh.getSelectedPanel().draggable = false;
					widget.mv.mvh.getSelectedPanel().setTitle(
								widget.mv.mvh.getSystemViewTitle());
				} else
				{
					widget.mv.mvh.items.itemAt(0).draggable = false;
					widget.mv.mvh.items.itemAt(0).setTitle(widget.mv.mvh.getSystemViewTitle());
					widget.mv.mvh.items.itemAt(0).setWidth(width);
					widget.mv.mvh.items.itemAt(0).ownerAcceptBBar = this.mergeWidgetActions;
				}
				/**
				 * Removing the current bbar items and tools.
				 */
				if (widget.mv.mvh.getBottomToolbar && widget.mv.mvh.getBottomToolbar())
				{
					if (this.mergeWidgetActions == true)
					{
						widget.mv.mvh.getBottomToolbar().removeAll();
						widget.mv.mvh.getBottomToolbar().hide();
						widget.mv.mvh.bbar = null;
						newHeight = newHeight + 30;
						if (defaultActions.length <= 0)
						{
							newHeight = newHeight - 30;
						}
					}
				}
				widget.setParentHeight(newHeight);
				widget.mv.add(widget.mv.mvh);
				widget.mv.doLayout();
			} else
			{
				if ((this.mergeWidgetActions == true) && (defaultActions.length <= 0))
				{
					newHeight = newHeight - 30;
					widget.setParentHeight(newHeight);
					widget.mv.doLayout();
				}
			}
		}
		return widget;
	},

	/**
	 * This function returns the container specific positive actions. It will be added in the
	 * bbar.
	 */
	loadDefaultPositiveButtons : function ()
	{
		var positiveActions = null;
		if (this.loadDefaultActions == true)
		{
			var multiWidgetExpPanel = this;
			positiveActions = [];
			var okButton = {
				xtype : 'button',
				text : 'Ok',
				cls : 'portal_pos_btn',
				handler : function ()
				{
					alert("Calling from the container." + multiWidgetExpPanel.id);
				}
			};
			positiveActions.push(okButton);
		}
		return positiveActions;
	},

	/**
	 * This function returns the container specific negative actions. It will be added in the
	 * bbar.
	 */
	loadDefaultNegativeButtons : function ()
	{
		var negativeActions = null;
		if (this.loadDefaultActions == true)
		{
			var multiWidgetExpPanel = this;
			negativeActions = [];
			var cancelButton = {
				xtype : 'button',
				text : 'Cancel',
				cls : 'portal_neg_btn',
				handler : function ()
				{
					alert("Calling from the container." + multiWidgetExpPanel.id);
				}
			};
			negativeActions.push(cancelButton);
		}
		return negativeActions;
	},

	/**
	 * This function merging the containers default bottom bar buttons with widget's bbar items.
	 */
	mergeBottomBarButtons : function (bottomBarItems)
	{
		var positiveButtons = [];
		var negativeButtons = [];
		var defaultPositiveButtons = this.loadDefaultPositiveButtons();
		var defaultNegativeButtons = this.loadDefaultNegativeButtons();
		var bottomBarButtons = [];

		/**
		 * Splitting the positive and negative buttons
		 */
		if (bottomBarItems && this.mergeWidgetActions == true)
		{
			for (var i = 0; i < bottomBarItems.length; i++)
			{ 
				var tmpItem = bottomBarItems[i];
				if (tmpItem.cls == "portal_pos_btn")
				{
					positiveButtons.push(tmpItem);
				} else if (tmpItem.cls == "portal_neg_btn")
				{
					negativeButtons.push(tmpItem);
				}
			}
		}
		/**
		 * Adding the default positive buttons to the bbar
		 */ 
		if (defaultPositiveButtons && defaultPositiveButtons.length > 0)
		{
			bottomBarButtons.push(defaultPositiveButtons);
		}

		/**
		 * Adding the widget positive buttons to the bbar
		 */
		if (positiveButtons.length > 0)
		{
			bottomBarButtons.push(positiveButtons);
		}

		/**
		 * Adding positive and negative button splitter
		 */
		if ((negativeButtons.length > 0)
					|| (defaultNegativeButtons && defaultNegativeButtons.length > 0))
		{
			bottomBarButtons.push({
				xtype : 'tbfill'
			});
		}
		/**
		 *  Adding the widget negative buttons to the bbar
		 */
		if (negativeButtons.length > 0)
		{
			bottomBarButtons.push(negativeButtons);
		}
		/**
		 * Adding the default negative buttons to the bbar
		 */
		if (defaultNegativeButtons && defaultNegativeButtons.length > 0)
		{
			bottomBarButtons.push(defaultNegativeButtons);
		}
		return bottomBarButtons;
	},
	
	/**
	 * To get the tools map of the widget.
	 */
	getToolsMap : function ()
	{
		if (this.ownerCt && this.ownerCt.getToolsMap)
		{
			return this.ownerCt.getToolsMap();
		} else
			return {};
	},
	
	/**
	 * Passing the show tool flag to the immediate parent. This flag is needed to be received by
	 * the portlet instance
	 */
	showToolIcon : function (showFlag)
	{
		var keys;
		var ii;
		var toolsMap = this.getToolsMap();
		if (!Ext.isEmpty(toolsMap))
		{
			Object.keys = Object.keys || function (o)
			{
				var keysArray = [];
				for ( var name in o)
				{
					if (o.hasOwnProperty(name))
						keysArray.push(name);
				}
				return keysArray;
			};
			for (var i = 0, keys = Object.keys(toolsMap), ii = keys.length; i < ii; i++) 
			{
				if (keys[i] == "close")
				{
					this.ownerCt.ownerCt.tools[keys[i]].remove(true);
					delete this.ownerCt.ownerCt.tools[keys[i]];
				}
				if (keys[i].indexOf("__CUSTOM") != -1)
				{
					this.ownerCt.ownerCt.tools[keys[i]].remove(true);
					delete this.ownerCt.ownerCt.tools[keys[i]];
				}
			}
		}
		if (this.mergeWidgetActions == false)
		{
			var tmpFlag = {
				"TOOLS_IND" : false,
				"HELP_IND" : false,
				"EXCEL_IND" : false,
				"PDF_IND" : false,
				"CSV_IND" : false,
				"FILTER_IND" : false,
				"REFRESH_IND" : false,
				"PRINT_IND" : false,
				"MAXIMIZE_IND" : false,
				"CHART_TOOL_IND" : false
			};
			this.ownerCt.showToolIcon(tmpFlag);
		} 
		else if (this.ownerCt && this.ownerCt.showToolIcon)
		{
			this.ownerCt.showToolIcon(showFlag);
		}
	},
	/**
	 * Return the tool menu instance from the view. All the menu actions will also be mapped
	 * appropriately with the view
	 */
	getToolsMenuItems : function ()
	{
		var mv = this.items.get(1);
		if (mv != null)
		{
			if (mv.getToolsMenuItems)
			{
				return mv.getToolsMenuItems();
			}
		}
	},
	/**
	 * 
	 */
	getSwitchViewIcon : function ()
	{
		var mv = this.items.get(1);
		if (mv != null)
		{
			if (mv.getSwitchViewIcon)
			{
				return mv.getSwitchViewIcon();
			}
		}
	},
	/**
	 * 
	 */
	getSwitchChartIcon : function ()
	{
		var mv = this.items.get(1);
		if (mv != null)
		{
			if (mv.getSwitchChartIcon)
			{
				return mv.getSwitchChartIcon();
			}
		}
	},
	/**
	 * Method to handle custom tool action @ param customToolId
	 */
	handleCustomToolAction : function (customToolId,toolScope)
	{
		var mv = this.items.get(1);
		if (mv != null)
		{
			if (mv.handleCustomToolAction)
			{
				return mv.handleCustomToolAction(customToolId,toolScope);
			}
		}
	},
	/**
	 * The method return the child menu of the parent tool. @param menuId
	 */
	getCustomToolsMenuItems : function (menuId)
	{
		var mv = this.items.get(1);
		if (mv != null)
		{
			if (mv.getCustomToolsMenuItems)
			{
				return mv.getCustomToolsMenuItems(menuId);
			}
		}

	},
	
	/**
	 * 
	 */
	getTbarConf : function ()
	{
		var mv = this.items.get(1);
		if (mv != null)
		{
			if (mv.getTbarConf)
			{
				return mv.getTbarConf();
			}
		}

	},

	/**
	 * 
	 */
	handleToolAction : function (menuItem)
	{
		var mv = this.items.get(1);
		if (mv != null)
		{
			if (mv.handleToolAction)
			{
				return mv.handleToolAction(menuItem);
			}
		}
	},
	/**
	 * 
	 */
	indexedWidget : true,
	/**
	 * This function is calling the showBottomBarButtons function of the immediate parent. It is
	 * used to display the bottomBarItems in the parent object's bbar.
	 */
	showBottomBarButtons : function (bottomBarItems)
	{
		if (this.getBottomToolbar && this.getBottomToolbar())
		{
			this.getBottomToolbar().removeAll();
			this.getBottomToolbar().hide();
			this.getBottomToolbar().doLayout();
			if (bottomBarItems && bottomBarItems.length > 0)
			{
				for (var i = 0; i < bottomBarItems.length; i++)
				{ 
					this.getBottomToolbar().add(bottomBarItems[i]);
				}
				this.getBottomToolbar().show();
			} else
			{
				this.getBottomToolbar().renderHidden = true;
			}
			this.getBottomToolbar().doLayout();
		}
	},

	/**
	 * Loading the default widget in the content panel.
	 */
	afterRender : function ()
	{
		this.items.get(0).items.get(0).handler.call(this.items.get(0).items.get(0).scope, {
			selectedIndex : this.selectedIndex,
			mergeWidgetActions : this.mergeWidgetActions
		});
		iportal.widget.IndexedMultiWidget.superclass.afterRender.apply(this, arguments);
		if (this.ownerCt != null)
		{
			this.ownerCt.doLayout();
		}
		if(!Ext.isEmpty(this.bbar)){
			var bottomBar = Ext.fly(this.bbar);
						bottomBar.applyStyles({
				'width' : 'auto'
			});
						bottomBar.first().applyStyles({
			'width' : 'auto'
			}); 
		}
	},

	/**
	 * Overriding the doLayout function to call the child objects doLayout() function.
	 */
	doLayout : function ()
	{
		for (i = 0; i < this.items.length; i++)
		{
			if (this.items.get(i))
			{
				this.items.get(i).doLayout();
			}
		}
		iportal.widget.IndexedMultiWidget.superclass.doLayout.apply(this, arguments);
	},
	
	/**
	 * 
	 */
	updateHeight : function (height)
	{
		this.height = height;
		this.setHeight(height);
		/**
		 * When the indexed multi widget has the child indexes are multi-widget, they have to
		 * re-calculated their height and width
		 */
		this.applyParentHeight = true;
		this.getComponent(1).setHeight(height - this.getFrameHeight());
		var wgt = this.getComponent(1).getComponent(0);
		height = height - this.getFrameHeight() - 30;
		if (wgt.updateHeight)
		{
			wgt.updateHeight(height);
		} else if (wgt.mwc && wgt.mwc.updateHeight)
		{
			wgt.mwc.updateHeight(height);
		}
		wgt.doLayout();
	}
});
