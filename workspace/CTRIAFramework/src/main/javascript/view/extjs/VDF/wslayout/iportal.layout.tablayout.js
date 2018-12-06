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
 * @class iportal.layout.tablayout class provided a container to load all its child layout containers into individual tabs
 * */
iportal.layout.tablayout= Ext.extend(Ext.TabPanel, {
	id:null,
	childLayouts:null,
	bundle : CRB.getFWBundleKey(),
	autoHeight:true,
	initComponent:function() {
		this.rb = CRB.getBundle(this.bundle); 	
		var defaultConfig = {
				xtype:'tabpanel',
				collapsible:false,
				autoWidth:true,
				//width:iportal.jsutil.getContainerResizeWidth(),
				autoHeight:true,
				items:this.createItems()
			};
		
		/*if(Ext.isIE8)
		{
			defaultConfig.width=defaultConfig.width-3;
		 
		}*/
		
		// attaching new event for verifying if layout can be switched
		//this.on('beforetabchange', this.verifyChangeAccepted, this); 
		Ext.apply(this, defaultConfig);	
		iportal.layout.tablayout.superclass.initComponent.apply(this);
    },
    /*
     * Method for loading empty tabs for all the child layout containers provided in the meta data
     * */
    createItems:function(){
  	// The method reloadWidgetCatalog of iportal.jsutil will not be used anymore after the introduction of dock model. Removing unused code
    	var rb = CRB.getBundle(layoutArr.LD_BUNDLE_KEY);
    	
    	var itemArr= new Array();
    	for(var index=0; index< this.childLayouts.length; index++){
    		itemArr[itemArr.length]= new iportal.layout.layoutcontainer({
    			title:rb[this.childLayouts[index].LAYOUT_DISPLAY_NM]==null?this.childLayouts[index].LAYOUT_DISPLAY_NM:rb[this.childLayouts[index].LAYOUT_DISPLAY_NM],
				itemId:this.childLayouts[index].LAYOUT_ID+"_LAYOUT_CONTAINER", 
				lytConf:this.childLayouts[index],
				bundle:this.bundle,
				listeners: {"activate": iportal.jsutil.tabSelectionHandler,scope:this, "deactivate":iportal.jsutil.tabDeSelectionHandler}
			});    		
    	}
    	return [itemArr];
    },
    
  
    /* 
    
     * Method for reloading the widget catalog
     * */
 // The method reloadWidgetCatalog of iportal.jsutil will not be used anymore after the introduction of dock model. Removing unused code
    initEvents : function(){
        Ext.TabPanel.superclass.initEvents.call(this);
        var strip= this.strip;
        var that=this;
        this.mon(this.strip, {
            scope: this,
            mousedown: function(e){
            	that.onStripMouseDown(e);
            },
            contextmenu: this.onStripContextMenu
        });
        if(this.enableTabScroll){
            this.mon(this.strip, 'mousewheel', this.onWheel, this);
        }
    },
        
     //Destroying the current layout container's widgets before moving to another tab
     
    tabDeSelectionHandler:function(layoutContainer){
       
            	try{
		    		if(layoutContainer.items.length > 0){
   

    	iportal.workspace.metadata.setWorkspaceChangeAcceptable(false);
  //      	 Removing only the widgets loaded inside the container after a lag
    		setTimeout(function(){
    		try{
    		    	layoutContainer.getComponent(0).removeWidgets();
    		}catch(e){
			// enabling workspace switching in case of error
        			setTimeout(function(){
			    		try{
			    			iportal.workspace.metadata.setWorkspaceChangeAcceptable(true);
			    		}catch(e){};
			    	}, 100);

    			};
    	}, 500);
    		}
  
	    	
    	}catch(e){
		//enabling workspace switching in case of error
       		
    		setTimeout(function(){
	    		try{
	    			iportal.workspace.metadata.setWorkspaceChangeAcceptable(true);
	    		}catch(e){};
	    	}, 100);
   
    	}
    	
    },
    /*
     * Load the widget under its associated layout container
     * */
    tabSelectionHandler:function(layoutContainer){
    	layoutContainer.renderWidgets();
    	layoutContainer.doLayout();
    },
   
    removeWidgets: function(){
    	this.getActiveTab().removeWidgets();
    },
	getWidgetContainer:function(){
		return this.getActiveTab().getComponent(0);
	},

    renderWidgets:function(){
    	if(this.getActiveTab().itemId== this.getComponent(0).itemId){
    		this.getActiveTab().renderWidgets();
    	}else{
    		this.activate(0);
    	}
    },
   
    afterRender : function(){
    	this.activate(0);
    	if(this.ownerCt!=null)
    		this.ownerCt.doLayout();
    	iportal.layout.tablayout.superclass.afterRender.apply(this, arguments);
    }
      // return true only when workspaces can be switched
    /*verifyChangeAccepted: function(){
    
    	return iportal.workspace.metadata.getWorkspaceChangeAcceptable();
    }*/
   
	
});