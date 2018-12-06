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
 * @description The name space .view is useful for organizing the code.<br>
 * It provides 2 main benefits.<br>
 * The first is that we can use them to prevent polluting the global namespace with objects,which is generally
 * considered to be undesireable. cbx, for example has just a single global object (the cbx object). It's good practice
 * to put any classes inside a namespace, a common one is the name of your company or the name of your application.The
 * other advantage is that assists in keeping our code organized, we can group together similar or co-dependent classes
 * in the same namespace, which helps to specify your intent to other developers.
 */
cbx.ns('canvas.lib');


/**
 * @class "canvas.lib.listMetadataMassage"
 * @description This class is responsible to massage the metadata of list component
 * @example 
 * var metadataMasssageObj = new canvas.lib.listMetadataMassage();
 */	
canvas.lib.listMetadataMassage = Class({
	
	metadata : '',
	perPage : 45,
	
	/**@method  "initializeMassageMetadata"
	 * @memberof "canvas.lib.listMetadataMassage"
	 * @param 	 config - list metadata
	 * @description Initiates massaging of metadata of the list view by setting the per page number of records to be displayed and initializing 
	 * the metadata variables that would be used later.
	 */
	initializeMassageMetadata  : function(config){
		
		this.metadata = config;
		this.perPage = parseInt(this.metadata.md.VIEW_MD.FLD_RECORDS_PER_PAGE) || 0;
		var portalLimit = parseInt(iportal.systempreferences.getPageSizeForPagination()) || 45;
		if(this.perPage <= 0){
			this.perPage = portalLimit			
		}
		this.viewMD = this.metadata.md.VIEW_MD;
		for(i=0;i<this.viewMD.FLD_COLUMN_LIST.length;i++){
			this.viewMD.FLD_COLUMN_LIST[i].HEADER_VAL = CRB.getBundleValue(this.viewMD.FLD_BUNDLE_KEY,"LBL_"+this.viewMD.FLD_COLUMN_LIST[i].FLD_COLUMN_DISPLAY_NAME_KEY) ? 
		  				 								CRB.getBundleValue(this.viewMD.FLD_BUNDLE_KEY,"LBL_"+this.viewMD.FLD_COLUMN_LIST[i].FLD_COLUMN_DISPLAY_NAME_KEY) : 
		  				 								"LBL_"+this.viewMD.FLD_COLUMN_LIST[i].FLD_COLUMN_DISPLAY_NAME_KEY;
		  	this.viewMD.FLD_COLUMN_LIST[i].FLD_SORTABLE_IND = this.viewMD.FLD_COLUMN_LIST[i].FLD_SORTABLE_IND == 'Y'? true : false;
		  	this.viewMD.FLD_COLUMN_LIST[i].FLD_FILTER_ENABLE_IND = this.viewMD.FLD_COLUMN_LIST[i].FLD_FILTER_ENABLE_IND == 'Y'? true : false;
		  	this.viewMD.FLD_COLUMN_LIST[i].DRILLDOWN_IND = this.viewMD.FLD_COLUMN_LIST[i].FLD_DD_REQ_IND;
		  	this.viewMD.FLD_COLUMN_LIST[i].toolTipforSorting = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LBL_SORT_BY");
		  	this.viewMD.FLD_COLUMN_LIST[i].toolTipforFilter = iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"TOOLTIP_FILTER");
		}
		this.widgetMD = this.metadata;
	},
	
	/**@method  "getPerPage"
	 * @memberof "canvas.lib.listMetadataMassage"
	 * @return	 Records per page
	 * @description Returns the count of records to be displayed per page.
	 */
	getPerPage:function(){
		return  this.perPage;
	},
	
	/**@method  "getViewMD"
	 * @memberof "canvas.lib.listMetadataMassage"
	 * @return	 list metadata
	 * @description Returns the view related metadata. 
	 */
	getViewMD : function(){
		return this.viewMD;
	},
	
	/**@method  "getViewColumnMD"
	 * @memberof "canvas.lib.listMetadataMassage"
	 * @return 	 list column metadata 
	 * @description Returns the list of columns of a view.
	 */
	getViewColumnMD:function(){
		return this.viewMD.FLD_COLUMN_LIST;
	},
	
	/**@method  "getWidgetMD"
	 * @memberof "canvas.lib.listMetadataMassage"
	 * @return	 widget metadata
	 * @description Returns the widget related metadata.
	 */
	getWidgetMD : function(){
		return this.widgetMD;
	},
	
	/**@method  "getViewType"
	 * @memberof "canvas.lib.listMetadataMassage"
	 * @return	 view type
	 * @description Returns the view type of the particular view.
	 */
	getViewType : function(){
		return this.viewMD.FLD_VIEW_TYPE;
	}
	
});