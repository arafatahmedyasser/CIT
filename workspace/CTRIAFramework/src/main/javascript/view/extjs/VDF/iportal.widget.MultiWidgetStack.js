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
 * 		@version   0.1
 */

Ext.namespace('iportal.widget');
/*
 * @class MultiWidgetStack class provided a container to load all its child widgets into a Stack layout
 * */
iportal.widget.MultiWidgetStack= Ext.extend(Ext.Panel, {
	childWidgets:[],
	id:null,
	bundle : CRB.getFWBundleKey(),
	autoScroll : true, 
	applyParentHeight:false,
	updatedHeight:null,// will be used if the Stack panel width is updated and its de-active children donot have updated height
	draggable:false,
	initComponent:function() {
		this.rb = CRB.getBundle(this.bundle); 	
		var defaultConfig = {
				xtype:'panel',
				baseCls:'list-view',
				border:true,
				frame:true,
				autoScroll:true,
				draggable:false,
				itemId:this.itemId,
				isContainerWidget:true,
				collapsible:false,
				activeItem:0,
				layout:'column',
				defaults:{columnWidth:1},
				items:this.createItems()			
			};
		Ext.apply(this, defaultConfig);	

		this.on("beforedestroy", function(){LOGGER.debug("beforeDestroy", this.itemId);}, this);
		
		iportal.widget.MultiWidgetStack.superclass.initComponent.apply(this);
		this.doLayout();
    },
    /*
     * Method for loading child widgets provided in the meta data
     * */
    createItems:function(){
    	var itemArr= new Array();
		var numberOfRows=0; 
		var widgetHeight=0; 
		var widget=null;
		for ( var index = 0; index < this.childWidgets.length; index++) {
			
			numberOfRows=0;
			widgetHeight=0;
			LOGGER.debug("Loading.. ", this.childWidgets[index].WIDGET_ID);			
			numberOfRows = this.childWidgets[index].NO_OF_ROWS;
			LOGGER.debug(this.childWidgets[index].WIDGET_ID, numberOfRows);
			var metadata = this.childWidgets[index];
			widget = iportal.listview.listviewrenderermap.getWidget(metadata);

			
			if (numberOfRows != null && numberOfRows !== "" && numberOfRows!==0) {
				
				widgetHeight=cbx.jsutil.getWidgetheight(numberOfRows);
				LOGGER.info(this.childWidgets[index].WIDGET_ID+' HH : ',widgetHeight)
				widget.setParentHeight(parseFloat(widgetHeight));
			}
			
			else {
				widgetHeight=Math.floor(this.height / this.childWidgets.length);
				widget.setParentHeight(widgetHeight);

			}
			
	    	
    		widget.mv.loadingInContainer=true;
    		widget.mv.isLoadingToolsInside=true;
			widget.mv.isParentPortlet=false;
	    	widget.mv.draggable=false;
	    	this.appMVRegistry.registerWidget(this.childWidgets[index].WIDGET_ID, widget.mv);
	    	/*In case of singular widget loading  from the MultiViewModel rather an new AJAX call
	    	 * Disabling the dragging
	    	 * adding the header to the mv
	    	 * */
	    	if(!widget.isContainer){
				if(widget.mv.mvh!=null){
					if(widget.mv.mvh.getSelectedPanel()!=null){
						widget.mv.mvh.getSelectedPanel().draggable=false;
						widget.mv.mvh.getSelectedPanel().setTitle(widget.mv.mvh.getSystemViewTitle());
					}
					else{
						widget.mv.mvh.items.itemAt(0).draggable=false;
						widget.mv.mvh.items.itemAt(0).setTitle(widget.mv.mvh.getSystemViewTitle());
					}
					widget.mv.add(widget.mv.mvh);
					widget.mv.doLayout();
				}
			}
    		
			itemArr[itemArr.length] = {items:[widget.mv],height:widgetHeight+25}; 
    	}
    	return [itemArr];
    },
    /**
    * Intended to find the position of the child by its id. This will be used majorly for activating a child widget
    **/
    findIndexOfChild:function(itemId){
    	for (var i=0; i< this.items.length; i++){
    		if((!Ext.isEmpty(this.items.itemAt(i))) && (this.items.itemAt(i).itemId==itemId))
    			return i;
    	}
    },
  
    updateHeight:function(height){
    	this.height = height;
		this.setHeight(height);
    },
   
    /*
     * Destroy the current child widget component before moving to another tab
     * */
    tabDeSelectionHandler:function(panel){
    	try{
	    	/*panel.items.itemAt(0).destroy();
	    	panel.doLayout();*/
    	}catch(e){}
    	
    },
    /*
     * Load the widget under its associated panel following the existing framework
     * */
    tabSelectionHandler:function(tabPanel){
    	if(!Ext.isEmpty(this.updatedHeight)){
    		tabPanel.updateHeight(this.updatedHeight);
    	}
    	this.doLayout();
    },
    afterRender : function(){
    	//this.items.itemAt(0).activate();
    	iportal.widget.MultiWidgetStack.superclass.afterRender.apply(this, arguments);
    },
    
	 /**
	 * To get the tools map of the widget.
	 */
    getToolsMap:function()
	{
		if (this.ownerCt && this.ownerCt.getToolsMap) {
			return this.ownerCt.getToolsMap();
		}
		else
			return {};
	},
	
	/**
	 * Passing the show tool flag to the immediate parent. This flag is needed to be received by the portlet instance
	 * */
    showToolIcon:function(showFlag){
    	showFlag.TOOLS_IND=false;
    	if(this.ownerCt && this.ownerCt.showToolIcon){    	
    		this.ownerCt.showToolIcon(showFlag);
    	}
    },
	/**
	 * Return the tool menu instance from the view. All the menu actions will also be mapped appropriately with the view
	 * */
    getToolsMenuItems: function(){
    	
    	var mv= this.getActiveTab().getComponent(0);
    	if(mv!=null){
    		if(mv.getToolsMenuItems){
    			return mv.getToolsMenuItems();
    		}
    	}
    },
  
 
    /**
	 * Return the tool menu instance from the view. All the menu actions will also be mapped appropriately with the view
	 * */
    getTbarConf: function(){
    	var mv= this.getActiveTab().getComponent(0);
    	if(mv!=null){
    		if(mv.getTbarConf){
    			return mv.getTbarConf();
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
	
    /**
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