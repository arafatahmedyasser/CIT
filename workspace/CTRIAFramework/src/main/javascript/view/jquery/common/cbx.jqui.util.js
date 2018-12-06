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
Ext = {};
Ext.ns = function (name, separator, container){
	var ns = name.split(separator || '.'), o = container || window, i, len;
	for (i = 0, len = ns.length; i < len; i++) {
		o = o[ns[i]] = o[ns[i]] || {};
	}
	return o;
};

Ext.namespace = Ext.ns;

Ext.override = function (origclass, overrides){
	if (overrides) {
		var p = origclass.prototype;
		p = $.extend(p, overrides);
		if (Ext.isIE && overrides.hasOwnProperty('toString')) {
			p.toString = overrides.toString;
		}
	}
};

Ext.extend = function (){

};

Ext.ns('Ext.util.Observable');
Ext.util.Observable = function (){
};


cbx.ns("cbx.form.util");
cbx.form.util = function (){
	var idSeed = 0;
	var _ob = {};
	return {
		/**
		 * Expected to receive the date in form of string and converting to
		 * appropriate date format.
		 */
		convertStringToDateObject : function (stdat){
			if (!cbx.core.isEmpty(stdat) && typeof (stdat) == 'string') {
				var vals = stdat.split("/");
				var xdate = null;
				var monthfield = vals[1];
				var dayfield = vals[0];
				var yearfield = vals[2];
				xdate = new Date(yearfield, monthfield - 1, dayfield);
				if ((xdate.getMonth() + 1 != monthfield) || (xdate.getDate() != dayfield)
							|| (xdate.getFullYear() != yearfield)) {
					return "Invalid Date";
				} else {
					xdate = new Date();
					var intvals = [ Number(vals[0]), Number(vals[1]), Number(vals[2]) ];
					xdate.setFullYear(intvals[2], intvals[1] - 1, intvals[0]);
					return xdate;
				}
			} else
				return stdat;
		},
		id : function (){
			return idSeed++;
		}
	};
}();

isNative = function (){
	var useNative = null;
	return function (){
		if (useNative === null) {
			useNative =window.JSON && JSON.toString() == '[object JSON]';
		}
		return useNative;
	};
}();
doDecode = function (json){
	try{
	return json ? eval("(" + json + ")") : "";
	}catch(e){
		LOGGER.error(e);
	}
};
cbx.core.objectDecode = function (){
	var dc;
	return function (json){
		if (!dc) {
			// setup decoding function on first access
			dc = isNative() ? JSON.parse : doDecode;
		}
		return dc(json);
	};
}();

jQuery.fn.ForceNumericOnly =
	function()
	{
	    return this.each(function()
	    {
	        $(this).keydown(function(e)
	        {
	            var key = e.charCode || e.keyCode || 0;
	            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
	            return (
	                key == 8 ||
	                key == 9 ||
	                key == 46 ||
	                (key >= 37 && key <= 40) ||
	                (key >= 48 && key <= 57) ||
	                (key >= 96 && key <= 105));
	        });
	    });
	};
	
	cbx.lib.beforeAjax = function(scope){
		//var updateText = scope.text || iportal.jsutil.getTextFromBundle(IRB.COMMON,"LOADING_MSG");
		var updateText = scope.text || iportal.jsutil.getTextFromBundle("CANVAS","LOADING_MSG");

		var configTime = Number(iportal.systempreferences.getAjaxRequestTimeOutPeriod());
		if(scope.config != undefined){
			scope.config.timeout = cbx.isNumber(configTime)? configTime:10000000;
		}

		if(window.preLoadEvent){
			window.preLoadEvent.detail['text'] =updateText; 
			window.dispatchEvent(window.preLoadEvent);
		}
	};
	CLCR.registerCmp({"COMP_TYPE":"GLOBAL_AJAX_LISTENERS","SEQUENCE":"INIT"},cbx.lib.beforeAjax); 
	cbx.lib.postAjax = function(request){
		if(window.postLoadEvent){
			window.dispatchEvent(window.postLoadEvent);
		}
	};
	CLCR.registerCmp({"COMP_TYPE":"GLOBAL_AJAX_LISTENERS","SEQUENCE":"COMPLETE"},cbx.lib.postAjax); 
	
	
	
	
	
	
	cbx.namespace("iportal");	
	iportal.logoutUser = function ()
	{
		var rb = CRB.getFWBundle();
		var err_Dialog = new iportal.Dialog({
			dialogType : 'USERDEFINED',
			dialogStyle : 'YES_NO',
			title : rb.LBL_MESSAGE,
			message : rb.MSG_SIGNOF_CONF,
			yesHandler : function ()
			{
				err_Dialog.close();
				iportal.logoutSuccess();
			},
			noHandler : function ()
			{
				err_Dialog.close();
			}
		});
		err_Dialog.show();
	};
	
	iportal.deleteCookies = function ()
	{
		var cookie_value = document.cookie;
		var cookie_key;
		var allcookies = cookie_value.split(';');
		$.each(allcookies, function (cookieitem)
		{
			if (~(String(cookieitem).indexOf('ys-')))
			{
				cookie_key = cookieitem.split('=')[0];
				cookie_key = String(cookie_key).trim();
				cookie_key = cookie_key.substring(3, cookie_key.length);
				$.removeCookie(cookie_key);
			}
		});
	};


	iportal.logoutSuccess = function ()
	{
		iportal.deleteCookies();
		iportal.jsutil.setLogoutPiggybackFlag(false);
		var rb = CRB.getFWBundle();
		var logout_params = {};
		logout_params['transactionCode'] = 'logout';
		cbx.ajax({
			type : 'html',
			url : iportal.workspace.metadata.getContextRoot() + '/PortalLoginServlet',
			success : function (responseP, optionsP)
			{
				var response_obj = cbx.decode(responseP.responseText);
				if (response_obj.logout == 'success')
				{
					appRefresh = true;
					var successLogout = new iportal.Dialog({
						dialogType : 'MESSAGE',
						closeIconRequired : false,
						cls : 'portal_pos_btn',
						id : 'SUCCESS_LOGGEDOUT_WINDOW_ID',
						message : '<div style=\'padding:3px;\'><div style=\'padding:3px;\'>' + rb['LOGOUT_SUCCESS_MESSAGE']
									+ '</div></div>',
						okHandler : function ()
						{
							successLogout.close();
							window.close();
						},
						title : rb['LBL_EXIT_SUCCESS']
					});
					successLogout.show();
				} else if (response_obj.logout == 'session_timedout')
				{
					var successLogout = new iportal.Dialog({
						dialogType : 'MESSAGE',
						cls : 'portal_neg_btn',
						closeIconRequired : false,
						message : '<div style=\'padding:3px;\'><div style=\'padding:3px;\'>' + rb['LOGOUT_SUCCESS_MESSAGE']
									+ '</div></div>',
						okHandler : function ()
						{
							successLogout.close();
							window.close(); 
						},
						title : rb['LBL_EXIT_SUCCESS']
					});
					successLogout.show();
				}
			},
			failure : function (responseP, optionsP)
			{
				var failureLogout = new iportal.Dialog({
					dialogType : 'ERROR',
					cls : 'portal_neg_btn',
					message : rb['LOGOUT_FAILURE_MESSAGE'],
					closeIconRequired : false,
					okHandler : function ()
					{
						failureLogout.close();
						window.close();
					},
					title : rb['LBL_EXIT_FAILURE']
				});
				failureLogout.show();
			},
			params : logout_params
		});
	};
	
	
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
	 * 
	 * 
	 * @description Singleton class which handles the loading indicator/mask whenever the asynchronous call is happening.  
	 * 
	 */



	cbx.ns('canvas.core');
	canvas.core.loadMaskManager = Class(cbx.Observable, {
		loadMaskRequestQueue : [],
		getLoadMaskManager : function() {
			return this;
		},
		constructor: function(){
	        this.loadMaskRequestQueue = [];
		},
		/**
		 * loadMaskRequestQueue : Its an array it holds the every ajax requests which is currently processing.
		 * initiateLoadMask : It initiates the load mask and keeps the every request in the processing queue.
	     * hideLoadMask : It resets the queue once the request is completed or callback or error and removes the load mask whenever the request is completed.
		 */
	    initiateLoadMask : function(request,text){
	    				cbx.LoadMask.show();
	                    /* generate a random number for request ID */
	                    var reqID = iportal.jsutil.getRandomNumber();
	                    /* store request id into array */
	                    this.loadMaskRequestQueue.push({requestID: reqID, loadingText: (text && text.length > 0) ? text : ""});
	                    /* pass the generated request ID to config */
	                    request.requestID = reqID;
	                    var cClass = CLCR.getCmp({
	                                        "COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
	                                        "SEQUENCE":"INIT"
	                                             });
	                                if(cClass){
	                                    var scope = {'config' : request, 'text' : text};
	                                    new cClass(scope);
	                                }
	    },
	    hideLoadMask : function(response){
	    				cbx.LoadMask.hide();
	    				//Once the response is processed for a particular request it will be removed from the processing array
	                    this.loadMaskRequestQueue =
	                                 this.loadMaskRequestQueue.filter(function (el) {
	                                            return el.requestID !== response.requestID;
	                                });
	                    if(this.loadMaskRequestQueue.length == 0){ // all the ajax requests has been processed and remove the loading mask
	                        var cClass = CLCR.getCmp({
	                                    "COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
	                                    "SEQUENCE":"COMPLETE"
	                        });
	                    if(cClass){
	                            new cClass(response);
	                            }
	                    }
	                    else{ 
	                    	// Once the current request is completed it updates the loading mask text as top most request request in the processing queue
	                            var cClass = CLCR.getCmp({
	                                    "COMP_TYPE":"GLOBAL_AJAX_LISTENERS",
	                                    "SEQUENCE":"INIT"
	                            });
	                            if(cClass){
	                                var scope = {'config' : response, 'text' : this.loadMaskRequestQueue[this.loadMaskRequestQueue.length-1].text};
	                                new cClass(scope);
	                            }
	                        }
	            }
	});
	CTLOADMASKMANAGER = new canvas.core.loadMaskManager();


	
	cbx.LoadMask = function() {
		var counter=0;
		return {
			show : function() {
				$('body').mask('');
				counter++;
				setTimeout(function() {
					counter=0;
					$('body').unmask('');
				}, 5000);
			},
			hide : function() {
				counter--;
				if(counter<=0){
					$('body').unmask('');
				}
			}
		};
	}();