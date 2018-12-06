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

Ext.ns('cbx.appstore');

/**
 * @class cbx.appstore.Canvas
 
 * @extends Ext.Panel
 * 
 * This class an layout class which hold all the panels in a column layout model.
 * The class contains important methods they are 
 * 		1) initComponent				- It arrange the components0 and component1 panels in Column layouts with .25 and .75 columnwidth manner.
 * 										  The left panel have the PropertyPanel, CategoryPanel and LayoutListPanel.
 * 										  The center panel have the AvailableWidgetPanel and SelectedWidgetPanel panel.      
 * 		2)  createItems	 				- Based on the position, it create the Panels with specific heights. 
 * 		3)  getPropertyPanel			- It will returns the Component_0th 0(zero)th position panel as PropertyPanel.
 * 		4)  getCategoryPanel			- It will returns the Component_0th 1st(First) position panel as CategoryPanel.
 * 		5)  getLayoutListPanel			- It will returns the Component_0th 2ndst(Second) position panel as LayoutListPanel.
 * 		6)  getAvailableWidgetPanel		- It will returns the Component_1st 0(zero)th position panel as AvailableWidgetPanel.
 * 		7)  getSelectedWidgetPanel		- It will returns the Component_1st 1st(First) position panel as SelectedWidgetPanel.
 * 		8)  communicate  				- This method is used to communicate between the Category ,Property , Layout ,Available and selected panel.   
 * 		9)  afterRender				 	- This returns the reference of the workarea.
 * 		10) getsaveInfo					- The save info like CHILD_LAYOUTS,WORKSPACE_DISPLAY_NM, WORKSPACE_LAYOUT,WORKSPACE_ID are sotred to saveInfo variable.
 * 										  The WORKSPCE_LAYOUT is stored as STACK and if already updated means it store the workspace Id from datamodel
 */	

cbx.appstore.Canvas= Ext.extend(Ext.Panel, {
	draggable:false,
	initComponent:function() {
		var defaultConfig = {
				xtype:'panel',
				layout : 'column',
				height : Ext.lib.Dom.getViewHeight()-25,
				items:[{
					autoScroll:false,
					layout : 'anchor',
					columnWidth: .25,
					height : Ext.lib.Dom.getViewHeight()-25,
					defaults : {
						anchor : '100%'
					},
					border:true,
					items:[this.createItems(1),this.createItems(2),this.createItems(3)]
				},{
					autoScroll:false,
					layout : 'anchor',
					columnWidth: .75,					
					height : Ext.lib.Dom.getViewHeight()-25,
					defaults : {
						anchor : '100%'
					},
				    items:[this.createItems(4),this.createItems(5)]
				}]
		};
		Ext.apply(this, defaultConfig);	
		cbx.appstore.Canvas.superclass.initComponent.apply(this);
	},
	/**
	 * Method for loading every region
	 * */
	createItems:function(position){

		var item ;
		var config = {};

		config.dataModel= this.dataModel;
		
		config.canvas	   =this;

		if(1 == position){
			config.height = 100;
			item = new cbx.appstore.PropertyPanel(config).getPanel();
		}else if(2 == position){
			config.height = Math.floor((Ext.lib.Dom.getViewHeight()/2))-30;
			item = new cbx.appstore.CategoryPanel(config).getPanel();
		}else if(3 == position){
			config.height = 250;
			item = new cbx.appstore.LayoutListPanel(config).getPanel();
		}else if(4 == position){
			config.height =150;
			item = new cbx.appstore.AvailableWidgetPanel(config).getPanel();
		}else if(5 == position){
			config.height = Math.floor(Ext.lib.Dom.getViewHeight() - 250);
			item = new cbx.appstore.SelectedWidgetPanel(config).getPanel();		
		}

		return item;

	},
	/**
	 * This method returns the Property Panel items according the default configuration
	 * 
	 */
	getPropertyPanel:function(){
		return this.getComponent(0).getComponent(0);

	},
	/**
	 * This method returns the Category Panel items according the default configuration
	 * 
	 */
	getCategoryPanel:function(){
		return this.getComponent(0).getComponent(1);

	},
	/**
	 * This method returns the LayoutList Panel items according the default configuration
	 * 
	 */
	getLayoutListPanel:function(){
		return this.getComponent(0).getComponent(2);

	},
	/**
	 * This method returns the Available Widget Panel items according the default configuration
	 * 
	 */
	getAvailableWidgetPanel:function(){
		return this.getComponent(1).getComponent(0);

	},
	/**
	 * This method returns the Selected Widget Panel items according the default configuration
	 * 
	 */
	getSelectedWidgetPanel:function(){
		return this.getComponent(1).getComponent(1);

	},
	/**
	 * 	This method is used to communicate from the one component to the other through this method
	 * 
	 * @params comp		= The name of the component to which it has to be communicated. 	
	 * @params method	= The name of the method to which it has to be communicated in that class.
	 * @params params   = The input of the method to which it has to be communicated in that class.
	 * 
	 */
	
	communicate:function(comp,method,params){

		if('propertyPanel' == comp){

			this.getPropertyPanel()['holder'][method](params);

		}else if ('categoryPanel' == comp){

			this.getCategoryPanel()['holder'][method](params);

		}else if ('LayoutListPanel' == comp){

			this.getLayoutListPanel()['holder'][method](params);

		}else if ('availableWidgetPanel' == comp){

			this.getAvailableWidgetPanel()['holder'][method](params);

		}else if ('selectedWidgetPanel' == comp){

			this.getSelectedWidgetPanel()['holder'][method](params);

		}

	},
	/**
	 * This method is called automatically after render of the component
	 * 
	 */
	
	afterRender : function(){
		if(this.ownerCt!=null)
			this.ownerCt.doLayout();
		cbx.appstore.Canvas.superclass.afterRender.apply(this, arguments);
	},
	/**
	 * This method returns the save information regarding the which the user has been selected.
	 * 
	 */
	getsaveInfo: function() {
		var saveInfo = {};
		saveInfo.CHILD_LAYOUTS=[this.getSelectedWidgetPanel()['holder'].getLayoutData()];
		saveInfo.WORKSPACE_DISPLAY_NM=this.getPropertyPanel()['holder'].getWorkspaceName();
		saveInfo.WORKSPACE_LAYOUT = "STACK";

		if(this.dataModel.isUpdate()){
			saveInfo.WORKSPACE_ID = this.dataModel.getWorkspaceId();
		}
		
		return saveInfo;
	}
});