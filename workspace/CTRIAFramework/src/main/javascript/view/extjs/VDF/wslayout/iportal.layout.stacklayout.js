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
 * @class iportal.layout.stacklayout class provided a container to load all its child layout containers into individual tabs
 * */
iportal.layout.stacklayout= Ext.extend(Ext.Panel, {
	id:null,
	childLayouts:null,
	bundle : CRB.getFWBundleKey(),
	autoHeight:true,
	initComponent:function() {
		this.rb = CRB.getBundle(this.bundle); 	
		var defaultConfig = {
				xtype:'panel',
				collapsible:false,
				autoWidth:false,
				width:iportal.jsutil.getContainerResizeWidth(),
				autoHeight:true,
				collapsible:false,
				activeItem:0,
				layout:'card',
				items:this.createItems()
			};
		Ext.apply(this, defaultConfig);	
		iportal.layout.stacklayout.superclass.initComponent.apply(this);
    },
    /*
     * Method for loading empty tabs for all the child layout containers provided in the meta data
     * */
    createItems:function(){
    	var itemArr= new Array();
    	//alert("this.childLayouts = "+ Ext.encode(this.childLayouts));
    	for(var index=0; index< this.childLayouts.length; index++){
    		itemArr[itemArr.length]= new iportal.layout.layoutcontainer({
    			//title:this.rb[this.childLayouts[index].LAYOUT_DISPLAY_NM]==null?this.childLayouts[index].LAYOUT_DISPLAY_NM:this.rb[this.childLayouts[index].LAYOUT_DISPLAY_NM],
				itemId:this.childLayouts[index].LAYOUT_ID+"_LAYOUT_CONTAINER", 
				lytConf:this.childLayouts[index],
				bundle:this.bundle,
				listeners: {"activate": function(){alert("activated")}, "added": function(){alert("added")}}
			});    		
    	}
    	return [itemArr];
    },
    /*
     * Destroy the current layout container's widgets before moving to another tab
     * */
    tabDeSelectionHandler:function(layoutContainer){
    	try{
        	/* Removing only the widgets loaded inside the container after a lag*/
    		setTimeout(function(){
    		try{
		    	layoutContainer.items.itemAt(0).removeChildren();
    		}catch(e){"iportal.layout.stacklayout.js\n"+e;};
    	}, 500);
	    	
    	}catch(e){}
    	
    },
    /*
     * Load the widget under its associated layout container
     * */
    tabSelectionHandler:function(layoutContainer){
    	layoutContainer.renderWidgets();
    	layoutContainer.doLayout();
    },
    onRemove:function(c){
    	try{
    		c.items.itemAt(0).removeChildren();
    		c.items.itemAt(0).destroy();
    	}catch(e){}
    	iportal.layout.stacklayout.superclass.onRemove.apply(this, arguments);    	
    },
    afterRender : function(){
    	this.activate(0);
    	if(this.ownerCt!=null)
    		this.ownerCt.doLayout();
    	iportal.layout.stacklayout.superclass.afterRender.apply(this, arguments);
    }    
	
});