
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
cbx.ns('cbx.lib.view');
/*
 * This class is responsible for to create the list control @author PrimeSoft
 *

 */

cbx.lib.view.Empty = Class({
    constructor: function (config) {
    	if(typeof config == 'object'){
    		$.init.EmptyView(config);
    	} else
    		return false;
    }
});

$.widget("init.EmptyView", {
	
	defaults : {
		'listMD' : {},
		'parent' : {},
		'utilityScope' : {}
	},
	
	_init : function(){
        this.options = $.extend({},this.defaults,this.options);
        this.id = this.options.utilityScope.listViewMD.VIEW_ID;
        this.md=this.options.utilityScope.listViewMD;
        this.parentId = iportal.jsutil.getRandomNumber()+"_"+this.options.utilityScope.listViewMD.VIEW_ID;
        this.EmptyStore = this.options.listMD.businessData;
        this.EmptyData = this.EmptyStore;
        this.appEvtRegistry = this.options.utilityScope.appEventRegistry;
        this.continer = $(".widget-content");
        this.EmptyConfig=this.md.Empty_CONFIG;
        this.store={
        			records:[]		
        };
        this.store.records= this.options.listMD.businessData;
        this.renderEmpty();
	},
	renderEmpty: function() {
		
		this.loadStaticEmpty();	
	
	},
	loadStaticEmpty : function ()
	{
		var me = this;
		
	}
});
