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
 * @namespace "canvas.lib"
 * @description 
 * It provides 2 main benefits.<br>
 * The first is that we can use them to prevent polluting the global namespace with objects,which is generally
 * considered to be undesireable. cbx, for example has just a single global object (the cbx object). It's good practice
 * to put any classes inside a namespace, a common one is the name of your company or the name of your application.The
 * other advantage is that assists in keeping our code organized, we can group together similar or co-dependent classes
 * in the same namespace, which helps to specify your intent to other developers.
 */
cbx.ns('canvas.lib');

/**
 * @class "canvas.lib.listParamsReady"
 * @description This class is responsible to get the params ready for data ajax call to be made for the list view
 * @example 
 * var paramsReadyObj = new canvas.lib.listParamsReady();
 */	
canvas.lib.listParamsReady = Class({
	
	initialParams:'',
	extraParams : {},
	primaryfilterParams : '',
	actionParams : {},
	/**@method  	"readyParams"
	 * @memberof 	"canvas.lib.listParamsReady"
	 * @description Responsible to get the initial params ready by the list metadata. 
	 * 				Also calls the setDefaultActionParams method
	 */
	readyParams : function(){
		this.initialParams = {
				"__LISTVIEW_REQUEST" : "Y",
				"PAGE_CODE_TYPE" : 'VDF_CODE',
				"INPUT_ACTION" : "INIT_DATA_ACTION",
				"INPUT_PRODUCT" : this.md.getViewMD().PRODUCT_CODE,
				"PRODUCT_NAME" : this.md.getViewMD().PRODUCT_CODE,
				"INPUT_FUNCTION_CODE" : this.md.getViewMD().FUNCTION_CODE,
				"INPUT_SUB_PRODUCT" : this.md.getViewMD().SUB_PRODUCT_CODE,
				"WIDGET_ID" : this.md.getWidgetMD().WIDGET_ID,
				"VIEW_ID" : this.md.getViewMD().VIEW_ID
		};
		this.setDefaultActionParams();
		this.initialParams.dir = this.actionParams.sortDir;
		this.initialParams.sort = this.actionParams.colID;
		this.initialParams.limit = this.actionParams.limit;
		this.initialParams.start = this.actionParams.start;
		if(this.md.getViewType()=='ADVGROUP'){
			this.initialParams.DATA_REQ_TYPE =	"GRPDATA";
		}
	},
	
	/**@method  "setParams"
	 * @memberof "canvas.lib.listParamsReady"
	 * @param	 params - other params to be included in extra params
	 * @description Responsible to set the extra params if passed
	 */
	setParams: function(params){
		if(!$.isEmptyObject(params)){
			this.extraParams = {};
			$.extend(this.extraParams,params);
		} else 
			this.extraParams = {};
	},
	/**@method  "getParams"
	 * @memberof "canvas.lib.listParamsReady"
	 * @return 	 list parameters 
	 * @description Responsible to give the cloned copy of params set in this class  (initial or extra)
	 */
	getParams:function(){
		var params = cbx.clone(this.initialParams);
		var addparams = this.listview.viewConf.raiseEvent(CWEC.EXTRA_PARAMS_HDLR,params)[0];
		if(!cbx.isEmpty(addparams)){
			params  = addparams;	
		}
		
		var fparam = cbx.clone(this.primaryfilterParams);
		var eparam = cbx.clone(this.extraParams);
		cbx.apply(eparam, fparam);
		params = $.extend({}, params, this.actionParams);
		return $.extend({}, params, eparam);
		
		
	},
	
	/**@method  	setGroupFilterParams
	 * @memberof 	"canvas.lib.listParamsReady"
	 * @param	    params - paramters that are to be set for filtering
	 * @description Sets the parameters related to list filtering
	 */
	setGroupFilterParams : function(params){
		this.groupfilterParams = params;
	},
	
	/**@method  	getGroupFilterParams
	 * @memberof 	"canvas.lib.listParamsReady"
	 * @return	    Parameters related to list filter
	 * @description Gets the parameters related to list filtering
	 */
	getGroupFilterParams : function(){
		return this.groupfilterParams;
	},
	/**@method  	setDefaultAddParams
	 * @memberof 	"canvas.lib.listParamsReady"
	 * @description Sets the params to restrict the number of records to be 
	 * 				displayed in the grid. 
	 * 				Called only during initial load or refresh.
	 */
	setDefaultAddParams: function(){
		return {
			"sortDir": "",
			"sortClass": "",
			"colID": "ALL",
			"currentPage": 1,
			"previousPage": 1,
			"nextPage": 2,
			"start": 0,
			"limit":this.md.perPage-1
		};		
	},
	
	/**@method  	setDefaultActionParams
	 * @memberof 	"canvas.lib.listParamsReady"
	 * @description Sets the default params to action params
	 */
	setDefaultActionParams: function(){
		this.actionParams = this.setDefaultAddParams();
	},
	
	/**@method  	updateAddParams
	 * @memberof 	"canvas.lib.listParamsReady"
	 * @param	    key - parameter key<BR>
	 * 				value - parameter value
	 * @description Updates the value in action params for the corresponding key.
	 */
	updateAddParams: function(key, value){
		if(this.actionParams.hasOwnProperty(key)){
			this.actionParams[key] = value;
		}
	},
	
	/**@method  	clearFilterParams
	 * @memberof 	"canvas.lib.listParamsReady"
	 * @description Clears only the filter params.
	 */
	clearFilterParams : function(){
		this.primaryfilterParams = {};
		this.groupfilterParams = {};
	}

});