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
cbx.ns('cbx.lib');
/*
 * This class helps to bind the events on list controls types and starts process of  
 * instantiating the cbx.lib.List.utility class
 *

*/


cbx.lib.Template = Class(cbx.core.Component, {
	widgetID:null,
	md: '',
	listUtility: null,
	appendTO: '', /* DOM element of widget to append the list control*/
	constructor: function(config) {	
		cbx.lib.Template.$super.call(this);
		this.widgetID = config.widgetId;
		this.workspaceID = config.workspaceId;
		this.md = config.md;
		this.scope = config.scope;
		this.appendTO = config.appendTO;
		this.extraParamsHandler=config.extraParamsHandler;
		this.extraParams=config.extraParams;
		this.appEvents = config.appEvents;
		this.accumulate=true;
		this.createTemplate();
	},
	createTemplate: function() {
		
		
		var tempconf = {
			'listObj': this
		};
		this.listUtility = new cbx.lib.List.utility(tempconf);
	}
});

CLCR.registerCmp({'COMP_TYPE':'TEMPLATE'}, cbx.lib.Template);
