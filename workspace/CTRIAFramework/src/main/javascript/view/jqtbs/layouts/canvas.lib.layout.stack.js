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
 
cbx.ns('canvas.lib.layout');
/**
 * @namespace "canvas.lib.layout"
 * @description This component is currently responsible Jquery_Bootstrap Framework to render stack sub-workpace layout.
 */

canvas.lib.layout.stack = Class(cbx.core.Component,{
	/**
	 * @class "canvas.lib.layout.stack"
	 * @description The constructor gets the metadata and initialises the other methods in the class namely 'initializeColumns' and 'generateStackCol'.
	 */
	leftcol : null,

	rightcol : null,

	parent : null,

	stackCol:null,

	constructor : function(config) {
		cbx.core.extend(this, config);
		canvas.lib.layout.stack.$super.call(this);
		if (!cbx.core.isEmpty(this.layoutProportion)) {
			this.proportion = this.layoutProportion.split(',');
		}

		this.initializeColumns();
		this.generateStackCol();
		this.parent.append(this.getItem(0));
	},
	
	/**
	 * @method initializeColumns
	 * @memberof "canvas.lib.layout.stack"
	 * @description This method is responsible for generating a DOM structure with 1 column 
	 * 				using lib layer. 
	 */
	initializeColumns : function() {
		var stackColConfig = {
			'id' : 'content-block',
			'eleType' : 'div',
			'class' :  'STACK-COLUMN'//this.LAYOUT_ID + '_stackColumnConfig' @By Praburam For code Clean purpose
		};

		this.stackCol=new cbx.lib.layer(stackColConfig);
		var titleColumn = this.stackCol;

		if (cbx.HashManager) {
			var hash = cbx.HashManager.getHashData();
			if (hash != null && cbx.core.isEmpty(hash.P_TITLE)){
				hash.P_TITLE = " ";
			}
			if (hash != null && hash.P_TITLE != null
					&& hash.P_TITLE.length > 0 ) {
				
				var titleStr = '<div class="context-heading">'
						+ '	<div class="gallerRightHeading">'
						+ '		<h3 class="CreameFntSize">' + hash.P_TITLE
						+ '</h3>' + '		</div>' + '</div>';

				var titleElem = new cbx.lib.layer({
					"eleType" : "div",
					"html" : titleStr
				}).getLayer();
			}
		}
	},
	
	/**
	 * @method generateStackCol
	 * @memberof "canvas.lib.layout.stack"
	 * @description This method is responsible for generating a DOM structure  
	 * 				using lib layer. And the DOM structure created in the method
	 * 				'initializeColumns' is appended to this DOM. 
	 */
	generateStackCol : function() {
		var tcLayer = new cbx.lib.layer({
			"eleType" : "div",
			"ITEM_ID" : "STACK"
		}).getLayer();
		tcLayer.appendChild(this.stackCol.getLayer());
		this.addItem(tcLayer);
	},
	
	/**
	 * @method createColComps
	 * @memberof "canvas.lib.layout.stack"
	 * @description This method is responsible for adding the app to the 
	 * 				sub-workspace inside the DOM structure created in the method
	 * 				'initializeColumns'. 
	 */
	createColComps : function(app, item) {
		/**
		 * Loop on the available items and position them starting from
		 * left to right
		 */
		var index = 0;
		var itemArr = [];
		this.stackCol.addLayer(item);
	},
	
	/**
	 * @method getTCContainer
	 * @memberof "canvas.lib.layout.stack"
	 * @description This method can be used to get the reference of the DOM 
	 * 				created in the method 'initializeColumns'.
	 */
	getTCContainer : function() {
		return this.getItem(0);
	}
});
/**
 * 		Registering the componenent.
 */
CLCR.registerCmp({'COMP_TYPE' : 'STACK'}, canvas.lib.layout.stack);
