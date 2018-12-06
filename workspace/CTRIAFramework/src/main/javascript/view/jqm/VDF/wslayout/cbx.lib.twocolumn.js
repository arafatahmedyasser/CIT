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
The class will accept necessary configuration and create a two column layout based upon available screen width and provided "proportion".
The class will expose the following config parameters

1. autoWidth
2. autoHeight
3. proportion
4. boardItems
5. border
6. title

Following events would be exposed
1. onBoard
2. beforeBoard
3. afterBoard
4. onDestroy

*/



cbx.ns('cbx.lib');
cbx.lib.twocolumn = Class(cbx.core.Component, {
	autoWidth: null,
	autoHeight: null,
	proportion: [70, 30],
	leftcol: null,
	rightcol: null,
	parent: null,
	constructor: function(config) {
		cbx.lib.twocolumn.$super.call(this);
		this.parent = config.parent;
		if( typeof config.proportion !== 'undefined' )
			this.proportion = config.proportion.split(',');
		else {
			config.proportion = "50,50";
			this.proportion = config.proportion.split(',');
		}
		/* initialize the columns */
		this.initializeColumns();
		//this.createColComps(this,config.boardItems);
		this.getTwoCol();
		this.parent.getItem(0).appendChild(this.getItem(0));
	},
	initializeColumns: function() {
		var leftColConfig = {
			"id": "left-col",
			"eleType": "div",
			"style": {
				"width": this.proportion[0]+"%"
				//"paddingTop": "30px"
			},
			"class": "twocolumnclass"
			//html: "leftcol"
		};
		var rightColConfig = {
			"id": "right-col",
			"eleType": "div",
			"style": {
				//width: this.proportion[1]-1+"%",
				width: this.proportion[1]+"%"
				//"paddingTop": "30px"
			},
			"class": "twocolumnclass"
			//html:"rightcol"
		}
		
		this.leftcol = new cbx.lib.layer(leftColConfig).getLayer();
		this.rightcol = new cbx.lib.layer(rightColConfig).getLayer()
		delete leftColConfig;
		delete rightColConfig;
	},
	getTwoCol: function() {
		var tcLayer = new cbx.lib.layer({"eleType": "div"}).getLayer();
		/* tcLayer.appendChild(this.leftcol.getLayer());
		tcLayer.appendChild(this.rightcol.getLayer()); */
		tcLayer.appendChild(this.leftcol);
		tcLayer.appendChild(this.rightcol);
		this.addItem(tcLayer);
	},
	/**
	 * 
	 */
	addApps : function(sortedAppArray){
		if(cbx.isArray(sortedAppArray)){
			for(var i=0;i<sortedAppArray.length;i++){
				var portlet = sortedAppArray[i].PORTLET;
				var widgetObj = portlet.getWidgetObject();
				switch (sortedAppArray[i].BLOCK_POSITION){
				case "LEFT":
					this.leftcol.appendChild(widgetObj);
					break;
				case "RIGHT":
					this.rightcol.appendChild(widgetObj);
					break;
				}
				portlet.initiateWidget(sortedAppArray[i].scope);
			}
		}
	}
});

CLCR.registerCmp({'COMP_TYPE':'PORTAL', 'LAYOUT':'TWO-COLUMN'}, cbx.lib.twocolumn);
