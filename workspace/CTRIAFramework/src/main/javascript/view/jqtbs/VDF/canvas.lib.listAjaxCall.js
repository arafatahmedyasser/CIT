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
 * @description The name space canvas.lib is useful for organizing the code.<br>
 * It provides 2 main benefits.<br>
 * The first is that we can use them to prevent polluting the global namespace with objects,which is generally
 * considered to be undesireable. cbx, for example has just a single global object (the cbx object). It's good practice
 * to put any classes inside a namespace, a common one is the name of your company or the name of your application.The
 * other advantage is that assists in keeping our code organized, we can group together similar or co-dependent classes
 * in the same namespace, which helps to specify your intent to other developers.
 */
cbx.ns('canvas.lib');

/**
 * @class "canvas.lib.listAjaxCall"
 * @description This class is responsible to make an ajax call to get the data for the current list view
 * @example 
 * var ajaxResultDataObj = new canvas.lib.listAjaxCall();
 */	
canvas.lib.listAjaxCall = Class({
	ajaxParams : null,
	
	/**@method  "setInitialParams"
	 * @memberof "canvas.lib.listAjaxCall"
	 * @description Responsible to get the initial params from the canvas.lib.listParamsReady class before making an ajax call
	 */
	setInitialParams : function(){
		this.ajaxParams=this.params.getParams();
	},
	
	/**@method  "doAjax"
	 * @memberof "canvas.lib.listAjaxCall"
	 * @param	 callbackfn - Callback function after ajax<BR>
	 * 			 scope - list scope
	 * @description Responsible to make the ajax call to get the data for the list view by passing the params set in setInitialParams
	 */
	doAjax: function(callbackfn,scope){
		var that = this;
		that.clsRefs={};
		CTLOADMASKMANAGER.initiateLoadMask(that.listview.elem,iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),"LOADING")+that.listViewMD.viewMD.VIEW_DISPLAY_NM,that.listview.elem);
		cbx.ajax({
			isGlobalMaskReq:false,
			params : that.ajaxParams,
			success : function(data){
				CTLOADMASKMANAGER.hideLoadMask(that.listview.elem,that.listview.elem);
				that.params.listview.viewConf.raiseEvent(CWEC.BEFORE_LOAD,data.response.value,that.listViewMD.viewMD);
				callbackfn.apply(scope, [data]);
			}
		});
	}
});