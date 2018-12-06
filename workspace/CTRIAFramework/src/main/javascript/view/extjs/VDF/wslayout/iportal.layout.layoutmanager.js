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

Ext.namespace('iportal.layout');


/*
 * @class This class's instance will be used for getting the correct type of layout container
 * 			needed by the workspace to host all its widgets. The class will use the workspace's
 * 			meta data to arrive at this decision and also provide helper methods to return appropriate containers  
 * */
iportal.layout.layoutmanager = Ext.extend(Ext.util.Observable, {
	ws:null,
	layout:'TAB',//default layout in case db doesnot return and layout value
	wsConf:null,
	constructor: function(config){	
	    // Copy configured listeners into *this* object so that the base class's
        // constructor will add them.
		iportal.layout.layoutmanager.superclass.constructor.call(this, config);
		Ext.apply(this,config);
		this.init();
    },
    setLayout:function(wsConf){
    	this.layout=wsConf.WORKSPACE_LAYOUT;
    },
    setChildLayouts:function(wsConf){
    	this.childLayouts= wsConf.CHILD_LAYOUTS;
    },    
    init: function(){
    	this.wsConf=iportal.workspace.metadata.getWorkSpaceById(this.workspaceId);
		this.setChildLayouts(this.wsConf);
		this.setLayout(this.wsConf);
   },
   /*return the most appropriate layout container for the workspace*/
   getLayoutContainer:function(){
	 var that=this;
	 var conf={
		childLayouts: this.childLayouts,
		bundle:this.ws.bundle,
		border:true,
		frame:false,
		workspaceId:this.workspaceId,
		// determines the region of the menu panel it is configurable(Left or Right)
		containerLayout : this.layout  
		
	 };
	 if(this.layout=="TAB"){
		 return new iportal.layout.tablayout(conf);
	 }  
	 else if(this.layout=="STACK"){
		 return {
			    removeWidgets: function(){
			 		this.getComponent(0).removeWidgets();
		 		},
			    renderWidgets: function(){
			    	that.init();
		    		this.getComponent(0).renderWidgets();
		 		},
		 		getWidgetContainer:function(){
		 			return this.getComponent(0).getComponent(0);	
		 		},
			 	//width:iportal.jsutil.getContainerResizeWidth(),			 	
			 	items:[new iportal.layout.layoutcontainer({
					itemId:conf.childLayouts[0].LAYOUT_ID+"_LAYOUT_CONTAINER", 
					lytConf:conf.childLayouts[0],
					wsLayout:'STACK',  
					height:iportal.jsutil.getContainerResizeHeight(),
					bundle:this.bundle,
					listeners: {"afterrender": function(container, owner, index){
				 							container.renderWidgets();
				 					    	container.doLayout();
			 							}
			 		}
			})]};
		 
	 }
	
	 /**
	  * Calling the menu container panel if the layout is L-MENU or R-MENU
	  */
	 else if (this.layout == "L-MENU" || this.layout=="R-MENU"){
		 return new cbx.layout.MenuContainerPanel(conf);
		 
	 }
	 
 
   }
});

