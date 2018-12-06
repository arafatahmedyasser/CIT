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
 * This class contains the workspace individual containers. Called by the
 * wsmanager to be added to the app container.
 */
cbx.lib.WorkspaceContainer = Class(cbx.core.Component,{
/*
 * Initializes the workspace container.
 */
	initialize: function(){
	var me=this;
	var config = {
			itemId : this.WORKSPACE_ID
	}
	//  Layout hardcoded as configuration(metadata) is not available at the
	// moment
	var wsContainerComp=CLCR.getCmp({"COMPONENT" : "WORKSPACE_CONTAINER","LAYOUT_TYPE":"ANCHOR"})(config);
	wsContainerComp.add(this.getMenuPanel(iportal.workspace.metadata.getCurrentWorkspaceId()));
	/*var layoutConfig={
			elem: wsContainerComp,
			WORKSPACE_ID:this.WORKSPACE_ID
	}*/
	this.layoutManager=new cbx.core.LayoutManager(config);
	wsContainerComp.add(this.layoutManager.getContainer().getItem(0));
	wsContainerComp.doLayout();
	this.addItem(wsContainerComp);
	// TO add the layout
	},
	
		/* 
		 * new Ext.Panel({ autoHeight:true, autoWidth:true, border : true, frame :
		 * true, // height: this.elem.getHeight()-2, height: 1400, layout:'fit',
		 * itemId: this.WORKSPACE_ID, onDestroy:function(){ me.destroy(); } });
		 */
	/*
	 * Method for loading the menu and widget layout container.
	 */
    createItems:function(){
    	var workspace_id=this.WORKSPACE_ID;
    	var itemArr= new Array();
    	var menuPanel = this.getMenuPanel(iportal.workspace.metadata.getCurrentWorkspaceId());
    	itemArr.push(menuPanel);
    	return itemArr;
    	//var lm= new iportal.layout.layoutmanager({ws:this,workspaceId:this.WORKSPACE_ID});

    	/*itemArr[itemArr.length]= lm.getLayoutContainer();
    	return [itemArr];*/
    },
    getWidgetContainer:function(){
    	return this.getItem(0).getComponent(1).getWidgetContainer();
    },
    /**
	 * Method to be called by the parents for removing all the widgets contained
	 * under its child container. This method will be used for auto destroying
	 * all the widgets when the focus is moved to another workspace or inner
	 * tab. The same method will be available down hierarchy till the
	 * appropriate container of the widgets.
	 */
    removeWidgets: function(){
    	this.getComponent(1).removeWidgets(); 
    },
    /**
	 * Method to be called by the parents for re-rendering the widgets again
	 * into its container. This will be mostly used when the focus comes back to
	 * a workspace or a tab that has been loaded atleast one. The same method
	 * will be available down hierarchy till the appropriate container of the
	 * widgets.
	 */
    renderWidgets: function(){
    	var component = this.getItem(0);
    	// refreshing the meta data so that the widgets are loaded as per the
		// updated model.
    	if(component.itemId!=null){
    		component.wsConf= iportal.workspace.metadata.getWorkSpaceById(component.itemId);
    	}else if(component.wsConf.WORKSPACE_ID){
    		component.wsConf= iportal.workspace.metadata.getWorkSpaceById(component.wsConf.WORKSPACE_ID);
    	}
    	
    	component.getComponent(1).renderWidgets();
    },
    
    /* method to return the menu container object */
    getMenuPanel:function(menu_items,panel_id){
    	
    	// Declare variable for process the Current workspace id.
    	var currentWsId = iportal.workspace.metadata.getCurrentWorkspaceId();
    	
    	var menuItems=iportal.menuitems.metadata.getMenuTools(menu_items,panel_id);
    	
    	if(cbx.isEmpty(menuItems[0]) && cbx.isEmpty(menuItems[1])&& cbx.isEmpty(menuItems[2])){
    		iportal.preferences.setMenuPanelHeightByWorkspaceId(currentWsId, 0);
    		return new Ext.Panel({
    			itemId: iportal.workspace.menu.constant.MENU_PANEL,
    			height:0, 
    			frame:false,
    			border : true
    		});
    	}

    	var menu_properties = canvas.componentproperties.MENU;
       	
    	// Get the workspace wise LEFT menu column width if is configured
    	var leftMenuColumnWidth = menu_properties.LEFT_COLUMN_WIDTH;
    	
    	// Get the workspace wise CENTER menu column width if is configured
    	var centerMenuColumnWidth = menu_properties.CENTER_COLUMN_WIDTH;
    	
    	// Get the workspace wise RIGHT menu column width if is configured
    	var rightMenuColumnWidth = menu_properties.RIGHT_COLUMN_WIDTH;
    	    	
    	   
    	
    	var isRTL = iportal.preferences.isLangDirectionRTL();    	
    	var startPack = 'start';
    	var endPack = 'end';    	
    	if(isRTL){
    		startPack = 'end';
    		endPack = 'start';
    	}
  
    	var menuPanel = new Ext.Panel({
    		layout:'column',
    		itemId: iportal.workspace.menu.constant.MENU_PANEL,
		
			//height:40,
			height:iportal.jsutil.getDefaultMenuPanelHeight(), 
			
			frame:false,
			border : true,
			defaults:{
    			frame:false
    		},
    			items:[{
                    columnWidth:leftMenuColumnWidth,
        			cls:'clsActionLayer menu-left-wrap',
        			xtype:'panel',
        			frame:false,
        			border:false,        			
                    defaults:{
                    	layout:'hbox'
        			},
        			items: [
    	 		           {layoutConfig:{align : 'top', pack : startPack}, items:[menuItems[0]]}
    	 		    ]
                },{
                    columnWidth:centerMenuColumnWidth,
        			xtype:'panel',	 		
        			cls:'clsActionLayer menu-center-wrap',
        			frame:false,
        			border:false,
        			defaults:{
            			layout:'hbox'
            		}, 
    			    items: [
    	 		           {layoutConfig:{align : 'top', pack : endPack}, items:[menuItems[1]]}]
                },{
                    columnWidth:rightMenuColumnWidth,
        			xtype:'panel',
        			cls:'clsActionLayer menu-right-wrap',
        			frame:false,
        			border:false,
        			defaults:{
        				layout:'hbox'
        			},
        			items: [
    	 		           {layoutConfig:{align : 'top', pack : endPack}, items:[menuItems[2]]}]                
                }] 
    	});  
    	iportal.preferences.setMenuPanelHeightByWorkspaceId(currentWsId,menuPanel.height);
		return menuPanel;    	
    }
	/*
	 * if(this.elem){ this.elem.add(wsComp); this.elem.doLayout(); }
	 */
	
		
	});

CLCR.registerCmp({'COMP_TYPE':'WORKSPACE_CONTAINER'}, cbx.lib.WorkspaceContainer); 