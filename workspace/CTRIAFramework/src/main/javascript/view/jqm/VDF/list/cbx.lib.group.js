/**
 * COPYRIGHT NOTICE
 * 
  
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
cbx.ns('cbx.lib');
cbx.lib.group = Class({
	md : '',
	bd : '',
	groupinGrid : '',
	isContextEnable : true,
	viewMD : '',
	parent : null,
	groupingColumns : '',
	groupingColumnsData : Array(),
	processedGroupedData : Array(),
	constructor : function (conf)
	{
		this.md = conf.md;
		this.widgetID = conf.widgetId;
		this.parent = conf.appendTO;
		this.listListeners = conf.listListeners;
		this.groupingColumns = this.md.FLD_GROUPING_COLUMNS;
		this.parentScope = conf.scope;
		this.extraParamsHandler = conf.extraParamsHandler;
		this.accumulate = true;
		this.extraParams = conf.extraParams;
		this.additionalParams = conf.additionalParams;
		this.appEvtRegistry = conf.appEvents;
		this.serverDateFormat = 'd/m/Y';
		this.outDateFormat = canvas.datePreferences.getDateFormat();
		this.createItem();

	},

	createItem : function ()
	{

		this.groupView = new cbx.lib.view.group({
			'utilityScope' : this
		});

	},
	getViewDomWrapper: function(){
		return this.parent.parentNode;
		}
});
CLCR.registerCmp({
	'COMP_TYPE' : 'GROUP'
}, cbx.lib.group);