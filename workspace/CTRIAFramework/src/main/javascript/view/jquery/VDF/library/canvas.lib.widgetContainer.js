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
 
cbx.ns('canvas.lib');
/**
 * This class contains the Ext JS specific widget container component inside the
 * sub-workspace. Called by the layoutManager.
 */
canvas.lib.widgetContainer = Class(cbx.core.Component, {
	/**
	 * Initializes the widget container.
	 */
	layoutExists:false,
	/**
	 * 
	 */
	initialize : function (){
		var me = this;
		var elem = this.elem; 
		elem.append('<span ITEM_ID="WGT_CONTAINER_' + this.LAYOUT_ID + '"></span>');
		elem = $(elem.find('span:first'));
		if(!cbx.core.isEmpty(this.layout) && cbx.core.isObject(this.layoutType)){
			elem=elem.append(this.layoutType.getItem(0));
			this.layoutExists=true;
		}
		this.setCmp(elem);
		this.appArr = [];
		elem.on("remove", function (){
			me.destroy();
		});
		this.initializeApps();
	},
	/**
	 * Initializes the apps/widgets available for that sub-workspace.
	 */
	initializeApps : function (){
		var config;
		var item='';
		var elem='';
		var apps = cbx.core.ws.metadata.getAppsByLayoutId(this.WORKSPACE_ID, this.LAYOUT_ID);
		for ( var i = 0, len = apps.length; i < len; i++) {
			elem=new cbx.lib.layer({"eleType": "span","id":"SPAN_"+i}).getLayer();
			config = {
				elemId : cbx.id(),
				elem : this.layoutExists?$(elem):this.getCmp(),
				layoutScope : this,
				uData : this.uData
			};
			cbx.core.extend(config, apps[i]);
			if(this.layoutExists){
				item = new canvas.lib.app(config);
				this.layoutType.createColComps(apps[i],elem);
			}else{
				this.appArr.push(new canvas.lib.app(config));
			}
		}
	}
});

/**
 * 
 */
CLCR.registerCmp({'CONTAINER_TYPE':'WIDGET'}, canvas.lib.widgetContainer);