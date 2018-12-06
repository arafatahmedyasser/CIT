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
 
/*
 * @class IportalStack
 * 
 * This class overrides the iportal.layout.widgetcontainer component and provides a pre-formatted invisible container
 * that will stack all its component .This container will align all the components added to it by itself and also make
 * them draggable.
 * 
 * This container also provides a set of helper functions for managing the components inside it.
 */
Ext.ns("iportal.layout.stack")
/*
 * Extends it from widget container just as in case of n column layout and making total columns as 1
 */		     
iportal.layout.stack = Ext.extend( iportal.layout.widgetcontainer, {
 
    border:false,
	autoWidth:true,
	autoScroll:false,
	containerHeight:0,
	totalColumns:1,
	// method call to add item in the left column of the container
	addItem: function(item, itemAttrs){
		this.items.itemAt(0).items.itemAt(0).add({widgetContainer:this,border:true,itemId:item.itemId+"_PORTLET",items:[item]});
		if(this.appMVRegistry!=null){
			this.appMVRegistry.registerWidget(item.itemId, item);
		}
		this.resetHeight();
	},
	
	// Method call to add item in the right column of the container
	resetHeight:function(){
		var Container=this.getComponent(0).getComponent(0);
		var calculatedHeight=this.getTotalCalculatedHeight(Container);
			if(calculatedHeight>this.containerHeight){
				this.setHeight(calculatedHeight);
			}else {
				this.setHeight(this.containerHeight);
			}
		
		this.doLayout();
		
	},
	getTotalCalculatedHeight:function(container){
		var totalHeight=0;
		for(var i=0; i<container.items.length; i++){
			if(container.getComponent(i).collapsed){
				totalHeight+=5;
			}else{
				totalHeight+=container.getComponent(i).getComponent(0).height;
			}
		}
		totalHeight+=32*container.items.length;
		return totalHeight;
	},
	// To calculate the widgets inside a container
	afterRender : function(){
		if(this.ownerCt!=null){
			this.ownerCt.doLayout();
		}
		iportal.layout.stack.superclass.afterRender.apply(this, arguments);
	}  
});
 
// register xtype
Ext.reg('iportal-stack', iportal.layout.stack); 
