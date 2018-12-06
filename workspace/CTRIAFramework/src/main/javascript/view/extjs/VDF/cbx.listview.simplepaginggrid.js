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
 * 
 * 
 * 
 * @class cbx.simplegrid.gridview
 * @extends Ext.grid.GridView
 * 
 * This Class Creates GridView that takes care of scrolling the content to intial state after loading 
 * the data from the response.   
 * 
 * @class cbx.listview.simplepaginggrid
 * @extends iportal.listview.paginggrid 
 *
 * This Class Creates simple paging grid with the view of cbx.simplegrid.gridview  
 *  
----------------------------------------------------------------------------------------------------- 
 * 
 */


Ext.namespace('cbx.simplegrid');

cbx.simplegrid.gridview=Ext.extend(Ext.grid.GridView, {
	
	/**
	 * @private
	 * Called when a store is loaded, scrolls to the top row
	 */
	onLoad : function() {
		if (Ext.isGecko) {
			if (!this.scrollToTopTask) {
				this.scrollToTopTask = new Ext.util.DelayedTask(this.scrollToLastState, this);
			}
			this.scrollToTopTask.delay(1);
		} else {
			this.scrollToLastState();
		}
	},
	scrollToLastState: function(){
		if(this.grid && this.grid.store){
			var lastOpts= this.grid.store.lastOptions
			lastOpts.params = lastOpts.params || {};
			if(lastOpts.params.start!=null && lastOpts.params.start!=0){
				if(this.myScrollState!=null){
					this.restoreScroll(this.myScrollState);
					return;
				}
			}
		}
		this.scrollToTop();
	}
});

Ext.namespace('cbx.listview');

cbx.listview.simplepaginggrid= Ext.extend(iportal.listview.paginggrid, {
	initComponent:function(){
		cbx.listview.simplepaginggrid.superclass.initComponent.call(this);
		var viewConfig = {
				forceFit		: false,
	            nearLimit      : iportal.systempreferences.getLiveGridNearLimit(),
	            loadMask: false,
				autoFill:false
	        };	

 	this.view = new cbx.simplegrid.gridview(viewConfig);
	}
});

Ext.reg('simplepaginggrid', cbx.listview.simplepaginggrid);