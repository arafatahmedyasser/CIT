/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
cbx.ns('canvas.applnlayout.tab');
canvas.applnlayout.tab.footer = Ext.extend(Ext.Panel,{
	collapsible : false,
	hidden : false,
	//renderTo : 'iportal_LOGO',
	initComponent : function(){
	/*	var wgtDock = new Ext.Container({
			renderTo : 'widgetCatalogContainer1',
			//cls : 'widgetCatalogContainer'
		});
		 CCDM.getInstance().on('appdocked',function(dockItem){
		    	var iconArr = this.find("itemId", dockItem.itemId);
		    	if(iconArr!=null && iconArr[0] != null ){
		    		iconArr[0].show();
				}
		    	else {
		    		this.add(dockItem);
		    	}
		    	this.doLayout();
		    },wgtDock);
			CCDM.getInstance().on('appundocked',function(itemId){
		    	this.remove(itemId);
		    },wgtDock);
			CCDM.getInstance().on('removeall',function(){
		    	this.removeAll(true);
		    },wgtDock);*/
			
	var defaultConfig = {
	xtype:'panel',
	layout : 'column',
	height : 75,
	layoutConfig : {
		columns : 1
	},
	items : [{
		//columnWidth : 1,
		//border : true,
		xtype : 'panel',
		html : '<div>Copyright &copy; CT 2015</div>',
		/*items : [
		wgtDock
		]*/
	}]
		};
		Ext.apply(this, defaultConfig);	
		canvas.applnlayout.tab.footer.superclass.initComponent.call(this);
	}
});
	
//Ext.reg('excardHeader',canvas.applnlayout.excard.header);
CLCR.registerCmp({"COMPONENT":"tabfooter","APPLICATION_FW" : "EXT-JS"},canvas.applnlayout.tab.footer); 
