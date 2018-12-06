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
 
 * @version   1.0
 */
/* 
 * Widgetization of Lookup
 * Widget Created in runtime For the LookUp Component
 * The super class for all the lookups for iportal. Every lookups rendering directly
 * into window when the button of editable lookup is clicked.
 * @class iportal.Lookup
 * @extends iportal.Widget
 */


Ext.ns("iportal.Lookup");// Define the namespace for the widget



iportal.Lookup = Ext.extend(iportal.Widget, {

	constructor : function(config) {
		this.svcch = null;
		iportal.Lookup.superclass.constructor.call(this, config);
		Ext.apply(this, config);
		this.mv = new iportal.view.MultiView({
			enableEnterkey : true,
			bundle:!Ext.isEmpty(config.scope.bundleKey)?config.scope.bundleKey:config.resourceBundleKey,
			cacheMetaData:false,
			lookupId:config.lookupId,
			rowdbclickhandler : config.rowdbclickhandler,
			multiSelectHandler : config.multiSelectHandler,
			showselectedRowsinLookUp: this.showselectedRowsinLookUp,//Fix for multiselect
			handlerScope : config.scope,
			id : config.widgetId,
			extraParamsHandler : config.reqparamshandler,
			listeners:{
				'cellclick':this.cellHandler,// EventForLookup 'DoubleClick'
				'bbuttonclick' : this.bButtonClick//CBXARXQ313U02
			}
	
		});
	},
	bButtonClick : function (buttonId, record){
		
		var dataObj = new Array();
		for(var i=0;i<record.length;i++){
			dataObj.push(record[i].data); 
		}
			Ext.apply(dataObj,{__LOOKUP_NAME : this.lookupId});
			this.multiSelectHandler.call(this.handlerScope,dataObj,buttonId);
		try{
			this.ownerCt.close();
		}catch(err){}	
		
	},
	cellHandler:function(colId,colVal,record){ 
		
		var data = record.data;
		Ext.apply(data,{__LOOKUP_NAME : this.lookupId});
		
		this.rowdbclickhandler.call(this.handlerScope,colId,data,colVal);
		try{
			this.ownerCt.close();
		}catch(err){}	
		

	}
	
});
