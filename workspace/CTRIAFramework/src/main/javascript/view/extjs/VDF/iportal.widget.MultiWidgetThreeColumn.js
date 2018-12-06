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
 * DEPLOY_MODULE_ID: <FW 159>
 */


Ext.namespace('iportal.widget');

/*
 * @class MultiWidgetThreeColumn provides a container for loading all its child
 * widgets into three column layout. The width of each column can be specified
 * as a percentage or fixed width, but the height is allowed to vary based on
 * the content.
 */
iportal.widget.MultiWidgetThreeColumn = Ext.extend(Ext.Panel, {

	id : null,
	bundle : CRB.getFWBundleKey(),
	autoScroll : true,
	applyParentHeight : false,
	initComponent : function (){
		
		this.rb = CRB.getBundle(this.bundle);
		var mvConst = iportal.view.MultiViewConstants;
		var defaultConfig = {
			xtype : 'panel',
			baseCls : 'list-view',
			border : true,
			frame : true,
			itemId : this.itemId,
			isContainerWidget : true,
			layout : 'column',
			defaults : {
				columnWidth : .33
			},

			items : [ {
				itemId : this.itemId + '_LEFT_WRAPPER',
				padding : 1,
				columnWidth : this.getCustomColWidth(mvConst.LEFT_WIDTH, mvConst.DEFAULT_LEFT_WIDTH),
				items : []
			}, {
				itemId : this.itemId + '_CENTER_WRAPPER',
				padding : 1,
				columnWidth : this.getCustomColWidth(mvConst.CENTER_WIDTH, mvConst.DEFAULT_CENTER_WIDTH),
				items : []
			}, {
				itemId : this.itemId + '_RIGHT_WRAPPER',
				padding : 1,
				columnWidth : this.getCustomColWidth(mvConst.RIGHT_WIDTH, mvConst.DEFAULT_RIGHT_WIDTH),
				items : []
			} ]

		};
		Ext.apply(this, defaultConfig);

		this.on("beforedestroy", function (){
			LOGGER.debug("beforeDestroy", this.itemId);
		}, this);

		this.doLayout();
		iportal.widget.MultiWidgetThreeColumn.superclass.initComponent.apply(this);
		this.createItems();
	},

	/**
	 * Utility method to get the column width values from configuration done by
	 * developer in cbx_overrides_en_US.properties file. If the user has not
	 * configured column widths then default column width will be set from
	 * cbx_default_en_US.properties file.
	 */
	getCustomColWidth : function (key, defKey){

		var overResBundle = CRB.getFWBundle();
		var defResBundle = CRB.getFWBundle();
		/*
		 * Appending multiwidget id to key to get column width configuration
		 * from properties entry for this widget.
		 */
		key = this.itemId.concat(key);
		return overResBundle[key] ? overResBundle[key] : (defResBundle[defKey] ? defResBundle[defKey] : .33);
	},

	createItems : function (){
		var numberOfRows = 0;
		for ( var index = 0; index < this.childWidgets.length; index++) {

			var widHeight, widget;
			try {
				widget = iportal.listview.listviewrenderermap[this.childWidgets[index].WIDGET_ID]();
			} catch (err) {
				LOGGER.error("Child widget " + this.childWidgets[index].WIDGET_ID
							+ " is either not configured in database or not registered in listviewrenderermap file");
				continue;
			}
			
			var rbw = CRB.getBundle(this.childWidgets[index].WIDGET_BUNDLE_KEY);
			var title = rbw[this.childWidgets[index].WIDGET_DISPLAY_NM] !== null
						? rbw[this.childWidgets[index].WIDGET_DISPLAY_NM]
						: this.childWidgets[index].WIDGET_DISPLAY_NM;
			if (title === "") {
				title = null;
			}

			if (title !== null && this.applyParentHeight) {
				widHeight = widget.setParentHeight(parseInt(this.height - 25)); // -25 is for title height
			} else if (this.applyParentHeight) {
				widHeight = widget.setParentHeight(this.height);
			} else {
				numberOfRows = this.childWidgets[index].NO_OF_ROWS;
				if (numberOfRows != null && numberOfRows !== "" && numberOfRows !== 0) {
					widHeight = widget.setParentHeight(cbx.jsutil.getWidgetheight(numberOfRows));
				} else {
					widHeight = widget.setParentHeight(this.height);
				}
			}

			widget.mv.loadingInContainer = true;
			widget.mv.isLoadingToolsInside = true;
			widget.mv.isParentPortlet = false;
			widget.mv.draggable = false;
			this.appMVRegistry.registerWidget(this.childWidgets[index].WIDGET_ID, widget.mv);
			/*
			 * In case of singular widget loading from the MultiViewModel rather
			 * an new AJAX call Disabling the dragging adding the header to the
			 * mv
			 */
			if (!widget.isContainer) {
				if (widget.mv.mvh != null) {
					if (widget.mv.mvh.getSelectedPanel() != null) {
						widget.mv.mvh.getSelectedPanel().draggable = false;
						widget.mv.mvh.getSelectedPanel().setTitle(widget.mv.mvh.getSystemViewTitle());
					} else {
						widget.mv.mvh.items.itemAt(0).draggable = false;
						widget.mv.mvh.items.itemAt(0).setTitle(widget.mv.mvh.getSystemViewTitle());
					}
					widget.mv.add(widget.mv.mvh);
					widget.mv.doLayout();
				}
			}
			
			this.addItem({
				items : [ widget.mv ],
				border : true,
				cls : 'x-widget-border',
				height : widHeight + 25
			});
		}
		return;
	},

	/**
	 * Utility method that decides column position for item (widget) and add
	 * widget in that column.
	 */
	addItem : function (item){
		LOGGER.info("adding widget : " + item.items[0].itemId);
		var lCount = this.getComponent(0).items.length;
		var cCount = this.getComponent(1).items.length;
		var rCount = this.getComponent(2).items.length;
		var widColPos = parseInt(lCount + cCount + rCount) % 3;
		/*
		 * widColPos value is 0 for left column, 1 for center column and 2 for
		 * right column.
		 */
		(widColPos === 0) ? this.getComponent(0).add(item) : (widColPos === 1) ? this.getComponent(1).add(item) : this
					.getComponent(2).add(item);
		this.doLayout();
	},

	updateHeight : function (height){
		this.height = height;
		this.setHeight(height);
	},
	/**
	 * Intended to find the position of the child by its id.
	 * This will be used majorly for activating a child widget.
	 */
	findIndexOfChild : function(itemId) {
		for ( var i = 0; i < this.items.length; i++) {
			if ((!Ext.isEmpty(this.items.itemAt(i)))
					&& (this.items.itemAt(i).itemId == itemId))
				return i;
		}
	},
	afterRender : function (){
		iportal.widget.MultiWidgetThreeColumn.superclass.afterRender.apply(this, arguments);
	},
	
	/**
	*To get the tools map from the header of widgets
	*/
	getToolsMap : function()
					{
						if (this.ownerCt && this.ownerCt.getToolsMap) {
							return this.ownerCt.getToolsMap();
						}
						else
							return {};
					},
	
	/**
	 * Passing the show tool flag to the immediate parent. This flag is needed
	 * to be received by the portlet instance
	 */
	showToolIcon : function (showFlag){
		showFlag.TOOLS_IND = false;
		if (this.ownerCt && this.ownerCt.showToolIcon) {
			this.ownerCt.showToolIcon(showFlag);
		}
	},
	/**
	 * Return the tool menu instance from the view. All the menu
	 * actions will also be mapped appropriately with the view
	 */
	getToolsMenuItems : function() {
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null) {
			if (mv.getToolsMenuItems) {
				return mv.getToolsMenuItems();
			}
		}
	},
	/**
	 * Return the tool menu instance from the view. All the menu
	 * actions will also be mapped appropriately with the view
	 */
	getPreferenceMenuItems : function() {
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null) {
			if (mv.getPreferenceMenuItems) {
				return mv.getPreferenceMenuItems();
			}
		}
	},
	

	
	getTbarConf: function()
	{
    	var mv= this.getActiveTab().getComponent(0);
    	if(mv!=null){
    		if(mv.getTbarConf){
    			return mv.getTbarConf();
    		}
    	}
    },
	
	
	/**
	 * Method to handle custom tool action
	 * @ param 
	 * customToolId
	 */
	handleCustomToolAction : function (customToolId,toolScope){
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null) {
			if (mv.handleCustomToolAction) {
				return mv.handleCustomToolAction(customToolId,toolScope);
			}
		}
		 
	},
	/* The method return the child menu of the parent tool.
	 * @param menuId
	 * */
	getCustomToolsMenuItems: function(menuId)
	{
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null) {
			if (mv.getCustomToolsMenuItems) {
				return mv.getCustomToolsMenuItems(menuId);
			}
		}
		 
	},
	
	/*
	 * Return the appropriate menu handler.
	 */
	handleToolAction : function (menuItem){
		var mv = this.getActiveTab().getComponent(0);
		if (mv != null) {
			if (mv.handleToolAction) {
				return mv.handleToolAction(menuItem);
			}
		}
	}

});
