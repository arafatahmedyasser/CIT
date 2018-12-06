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
 * 
 */
canvas.lib.layout.twocolumn = Class(cbx.core.Component,	{
	/**
	 * 
	 */
	proportion : [ 50, 50 ],
	/**
	 * 
	 */
	leftcol : null,
	/**
	 * 
	 */
	rightcol : null,
	/**
	 * 
	 */
	parent : null,
	/**
	 * 
	 */
	constructor : function(config) {
		cbx.core.extend(this, config);
		canvas.lib.layout.twocolumn.$super.call(this);
		if (!cbx.core.isEmpty(this.layoutProportion)) {
			this.proportion = this.layoutProportion.split(',');
		}

		this.initializeColumns();
		this.getTwoCol();
		this.parent.append(this.getItem(0));
	},
	/**
	 * 
	 */
	initializeColumns : function() {
		var bigColConfig = {
			id : "content-block",
			'eleType' : 'div',
			'class' : this.LAYOUT_ID + '_bigColumnConfig content-left'
		};
		var smallColConfig = {
			id : "aside-block",
			"eleType" : "div",
			'class' : this.LAYOUT_ID
					+ '_smallColumnConfig content-right'
		}
		var titleColumn = null;
		if (parseInt(this.proportion[0]) > parseInt(this.proportion[1])) {
			this.leftcol = new cbx.lib.layer(bigColConfig);
			titleColumn = this.leftcol;
			this.rightcol = new cbx.lib.layer(smallColConfig);
		} else {
			this.leftcol = new cbx.lib.layer(smallColConfig);
			this.rightcol = new cbx.lib.layer(bigColConfig);
			titleColumn = this.rightcol;
		}
		if (cbx.HashManager) {
			var hash = cbx.HashManager.getHashData();
			if (hash != null && cbx.core.isEmpty(hash.P_TITLE)){
				hash.P_TITLE = " ";
			}
			if (hash != null && hash.P_TITLE != null
					&& hash.P_TITLE.length > 0) {
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
	 * 
	 */
	getTwoCol : function() {
		var tcLayer = new cbx.lib.layer({
			"eleType" : "span",
			"ITEM_ID" : "TWO-COLUMN"
		}).getLayer();
		tcLayer.appendChild(this.leftcol.getLayer());
		tcLayer.appendChild(this.rightcol.getLayer());
		this.addItem(tcLayer);
	},
	
	/**
	 * 
	 */
	createColComps : function(app, item) {
		/**
		 * Loop on the available items and position them starting from
		 * left to right
		 */
		var index = 0;
		var itemArr = [];
		if (app.BLOCK_POSITION == "LEFT"
				|| cbx.core.isEmpty(app.BLOCK_POSITION)) {
			this.leftcol.addLayer(item);
		} else {
			this.rightcol.addLayer(item);
		}
	},
	/**
	 * 
	 */
	getTCContainer : function() {
		return this.getItem(0);
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE' : 'TWO-COLUMN'}, canvas.lib.layout.twocolumn);
