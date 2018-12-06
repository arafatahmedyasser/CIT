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

cbx.namespace("iportal");
/**
 * Global Ajax Hooks and Session Timeout Tasks
 */
iportal.sessionTimeout = new Ext.util.DelayedTask(function ()
{
	iportal.showTimeoutWarningMessage(function ()
	{
		iportal.sendActiveToken();
	});
});

/**
 * 
 */
Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
	expires : null
}));
/*
 * 
 * 
 * 
 */
/**
 * This is a seperate task which will execute for 2 minutes after which it will fire an AJAX request to synchronize the
 * timers at client side and server side. This is required as there is still images to be loaded after the last AJAX
 * request at loading time.
 */
iportal.imageLoadAdjust = new Ext.util.DelayedTask(function ()
{
	// iportal.apps.alertPiggybackListner.processHighUnPoppedupAlerts();
});

/**
 * 
 */
iportal.imageLoadAdjust.delay(120000);

/**
 * 
 */
iportal.NULL_VAL_REPLACE = '--';

/**
 * The main method to be used to open a warning dialog incase of session timeout notification. The parameter expected is
 * a js function which will be invoked in sequence with the closing of dialog after the user clicked on OK button.
 */
iportal.showTimeoutWarningMessage = function (okHandlerFn)
{
	var rb = CRB.getFWBundle();
	var warnWin = new iportal.Dialog({
		dialogType : 'ERROR',
		id : 'TIMEOUT_DIALOG_ID',
		modal : true,
		shadow : false,
		buttonStyleOverride : true,
		buttonStyle : 'background:#D4E1F2;',
		cls : 'portal_pos_btn',
		closeIconRequired : false,
		message : rb['TIMEOUT_NOTIFICATION'],
		okHandler : function ()
		{
			warnWin.close();
			okHandlerFn();
		},
		title : rb['LBL_WARN']

	});
	warnWin.show();
	iportal.sessionTimeout.cancel();
	var dialogToCloseArray = [];
	dialogToCloseArray.push(warnWin);
	iportal.timedoutWindowClose.delay(60000, iportal.timedoutWindowCloseFn, this, dialogToCloseArray);
}

/**
 * 
 */
iportal.timedoutWindowCloseFn = function (warnWin)
{
	iportal.deleteCookies();
	iportal.closeAllWin();
	if (warnWin)
	{
		iportal.deleteCookies();
		warnWin.close();
	}
	window.close();

	window.location.href = iportal.systempreferences.getSessionTimeOutURL();

}

/**
 * 
 */
iportal.timedoutWindowClose = new Ext.util.DelayedTask(function ()
{
	window.close();
});

/**
 * 
 */
iportal.startTimer = function ()
{
	iportal.sessionTimeout.delay(iportal.systempreferences.getIdleSessionTimeoutInSeconds());
}

/**
 * 
 */
Ext.Ajax.on('beforerequest', function (conn, options)
{
	var configTime = Number(iportal.systempreferences.getAjaxRequestTimeOutPeriod());
	this.timeout = Ext.isNumber(configTime) ? configTime : this.timeout;
	if (!options.url)
	{
		options.url = iportal.jsutil.getController();
	}
	options.method = 'POST';
	/**
	 * Adding CSRF Prevention Token to the request
	 */
	options.params[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
	options.params['GEO_LOCATION']=Ext.encode(canvas.env.location.getGeoLocation());
	/**
	 * Reset Client Side Timers for Session
	 */
	iportal.sessionTimeout.cancel();
	iportal.sessionTimeout.delay(iportal.systempreferences.getIdleSessionTimeoutInSeconds());
	iportal.timedoutWindowClose.cancel();
	if (/* !iportal.util.ajaxPiggyback.isPiggybackRequest(options) && */!options.params.__LISTVIEW_REQUEST
				&& !options.params.__FRAMEWORK_REQUEST && !options.params.IGNORE_MASKING)
	{
		iportal.jsutil.showLoadingMsgOnBody();
	}

	addEncryptionLayerToAjaxForPC(options);
});

/**
 */
iportal.doLogoutViaAjax = function ()
{
	iportal.deleteCookies();
	cbx.ajax({
		type : 'html',
		url : iportal.workspace.metadata.getContextRoot() + '/PortalLoginServlet',
		success : function (responseP, optionsP)
		{
			window.close();
		},
		failure : function (responseP, optionsP)
		{
			window.close();
		},
		params : {
			'transactionCode' : 'logout'
		}
	});
}

/**
 * 
 */
iportal.handleCloseEvent = function (e)
{
	var posx = 0;
	var posy = 0;
	if (!e)
		var e = window.event;
	if (e.pageX || e.pageY)
	{
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY)
	{
		posx = e.clientX;
		posy = e.clientY;
	}
	/**
	 * This is to check whether the event beforeunload has been triggered by window close button at the right top
	 */
	if (posy < 0 && posy > -80)
	{
		iportal.doLogoutViaAjax();
	}
	/**
	 * This is to check whether the event beforeunload has been triggered by the click of Alt and F4
	 */
	else if (Ext.EventObject.getKey() == 115 && Ext.EventObject.altKey)
	{
		iportal.doLogoutViaAjax();
	} else
	{
		if (!Ext.getCmp('SUCCESS_LOGGEDOUT_WINDOW_ID'))
		{
			/**
			 * Retain the state of Opened windows
			 */
			var isWindowsOpen = false;
			var cp = Ext.state.Manager.getProvider();
			Ext.WindowMgr.each(function (windowparam)
			{
				if (windowparam.id == 'productRateCardWinId')
				{
					isWindowsOpen = true;
					cp.set('OPEN_WIN', cp.encodeValue(windowparam.id));
				} else if (windowparam.id == 'AUDIT_LIST_VIEW_WINDOW')
				{
					isWindowsOpen = true;
					cp.set('OPEN_WIN', cp.encodeValue(windowparam.id));
				}
			});
			if (!isWindowsOpen)
			{
				cp.clear('OPEN_WIN');
			}
		}
	}
}

window.onbeforeunload = iportal.handleCloseEvent;
/**
 * 
 */
Ext.Ajax.on('requestcomplete', function (conn, response, options)
{

	decryptResponseTextForPc(response, options);

	if (/* !iportal.util.ajaxPiggyback.isPiggybackRequest(options) && */!options.params.__LISTVIEW_REQUEST
				&& !options.params.__FRAMEWORK_REQUEST && !options.params.IGNORE_MASKING)
	{
		iportal.jsutil.hideLoadingMsgOnBody();
	}
	if (iportal.systempreferences.isAlertViaPiggyBack()) {//AlertViaPiggyBack flag enable or disable
		
	
	if(!iportal.util.ajaxPiggyback.isPiggybackRequest(options) && !iportal.util.ajaxPiggyback.isPiggyBackInprocess){
		iportal.util.ajaxPiggyback.isPiggyBackInprocess=true;
		iportal.apps.alertPiggybackListner.getUrgentNormalAlertsCounts();
	}
	else if(iportal.util.ajaxPiggyback.isPiggybackRequest(options)){
		iportal.util.ajaxPiggyback.isPiggyBackInprocess = false;
	}
	}
	iportal.sessionTimeout.cancel(); 
	iportal.sessionTimeout.delay(iportal.systempreferences.getIdleSessionTimeoutInSeconds()); 
	iportal.timedoutWindowClose.cancel();  
	var rb = CRB.getFWBundle();
	var errorbundle = CRB.getFWBundle();
	function purgeCallbacks ()
	{
		if (!options.params.forceCallbacks)
		{
			options.success = Ext.emptyFn;
			options.failure = Ext.emptyFn;
		}
	}
	function showErrWin (msg, msgtitle)
	{
		var message = msg || errorbundle['SYSERROR'];
		var errWin = new iportal.Dialog({
			dialogType : 'ERROR',
			cls : 'portal_pos_btn',
			message : message,
			toolButtons : [ 'close' ],
			okHandler : function ()
			{
				errWin.close();
			},
			title : msgtitle
		})
		if (!msgtitle)
			errWin.setTitle(rb['LBL_ERROR']);
		errWin.show();
		purgeCallbacks();
	}

	if (Ext.isEmpty(response) || Ext.isEmpty(response.responseText) || response.responseText == '{}')
	{
		showErrWin(errorbundle['SYSERROR']);
		return;
	}
	else if(options.responseContentType == "html"){
		return;
	}
	else if ((response.responseText.indexOf('<html') != -1) && (response.responseText.indexOf('</html>') != -1))
	{
		purgeCallbacks();
		window.location.href = iportal.systempreferences.getSessionTimeOutURL();
	} else
	{
		var resp_object = Ext.decode(response.responseText);
		if (resp_object.JSON_MAP && resp_object.JSON_MAP.response && resp_object.JSON_MAP.response.FATAL_ERROR)
		{
			var messagetoshow = resp_object.JSON_MAP.response.FATAL_ERROR;
			if (iportal.systempreferences.isRequestIdLogged())
			{
				if (resp_object.JSON_MAP.response.REQUEST_ID)
				{
					messagetoshow += '<br/><br/>' + rb['LBL_REFERENCE'] + ':'
								+ resp_object.JSON_MAP.response.REQUEST_ID;
				}
			}
			showErrWin(messagetoshow);
		} else if (resp_object.TRANSACTION_ERROR)
		{
			var messagetoshow = resp_object.TRANSACTION_ERROR;
			var messagetitle = resp_object.TRANSACTION_ERROR_TITLE;
			if (iportal.systempreferences.isRequestIdLogged())
			{
				if (resp_object.REQUEST_ID)
				{
					messagetoshow += '<br/><br/>' + rb['LBL_REFERENCE'] + ':' + resp_object.REQUEST_ID;

				}
			}
			showErrWin(messagetoshow, messagetitle);
		} else if (resp_object.FDIC_ERROR)
		{
			showErrWin(resp_object.FDIC_ERROR);
		} else if (!Ext.isEmpty(resp_object.JSON_MAP) && !Ext.isEmpty(resp_object.JSON_MAP.SESSION_ERROR))
		{
			// showErrWin(errorbundle[SESSION_EXPIRE_MESSAGE],errorbundle[SESSION_EXPIRE_TITLE]);
			window.location.href = iportal.systempreferences.getSessionTimeOutURL();
		} else if (resp_object.SIMULATION_SUCCESS_FLAG === 'true' && resp_object.success === 'true')
		{
			if (resp_object.RESPONSE_ACTION != 'PREFERENCE_SAVE_SUCCESS')
			{
				var message_simulation = "";
				if (resp_object.TRANSACTION_TYPE)
				{
					var message_simulation = rb["LBL_SIMULATION_MODE_SUCCESS_MESSAGE"] + "<br/>"
								+ resp_object.TRANSACTION_TYPE + '&nbsp;' + resp_object.RESPONSE_ACTION;
				} else
				{
					var message_simulation = rb["LBL_SIMULATION_MODE_SUCCESS_MESSAGE"] + "<br/>"
								+ resp_object.RESPONSE_ACTION;
				}
				var mask_el = Ext.getBody();
				mask_el.unmask();
				var win = new iportal.Dialog({
					dialogType : 'MESSAGE',
					cls : 'portal_neg_btn',
					closeHandler : function ()
					{
						Ext.WindowMgr.each(function (windowparam)
						{
							windowparam.close();
						});
					},
					message : message_simulation,
					okHandler : function ()
					{
						win.close();
						Ext.WindowMgr.each(function (windowparam)
						{
							windowparam.close();
						});
					},
					title : rb['LBL_CONFIRMATION']
				});
				Ext.WindowMgr.each(function (windowparam)
				{
					windowparam.close();
				});
				win.show();
				purgeCallbacks();
			}
		} else if (resp_object.response && resp_object.response.value && resp_object.response.value.ADDITIONAL_DATA
					&& resp_object.response.value.ADDITIONAL_DATA.SIMULATION_SUCCESS_FLAG)
		{
			if (resp_object.response.value.ADDITIONAL_DATA.SIMULATION_SUCCESS_FLAG === 'true')
			{
				var win = new iportal.Dialog({
					dialogType : 'MESSAGE',
					cls : 'portal_pos_btn',
					message : resp_object.response.value.ADDITIONAL_DATA.RESPONSE_ACTION,
					okHandler : function ()
					{
						win.close();
					},
					title : rb['LBL_CONFIRMATION']
				});
				win.show();
				purgeCallbacks();
			}
		}
	}
	return;
});

/**
 * delete all cookies created by iportal application
 */
iportal.deleteCookies = function ()
{
	var cookie_value = document.cookie;
	var cookie_key;
	var cp = Ext.state.Manager.getProvider();
	var allcookies = cookie_value.split(';');
	Ext.each(allcookies, function (cookieitem)
	{
		if (~(String(cookieitem).indexOf('ys-')))
		{
			cookie_key = cookieitem.split('=')[0];
			cookie_key = String(cookie_key).trim();
			cookie_key = cookie_key.substring(3, cookie_key.length);
			cp.clear(cookie_key);
		}
	});
}

/**
 * 
 */
iportal.deleteEquivalentCCYCookies = function ()
{
	var cookie_value = document.cookie;
	var cookie_key;
	var cp = Ext.state.Manager.getProvider();
	var allcookies = cookie_value.split(';');
	Ext.each(allcookies, function (cookieitem)
	{
		cookieitem = String(cookieitem);
		if (~(cookieitem.indexOf('ys-')))
		{
			cookie_key = cookieitem.split('=')[0];
			cookie_key = String(cookie_key).trim();
			if (cookie_key.endsWith('_GV'))
			{
				cookie_key = cookie_key.substring(3, cookie_key.length);
				cp.clear(cookie_key);
			}

		}
	});
}

/**
 * 
 */
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
			document.cookie = "DESKTOP_MODE=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
			err_Dialog.close();
			iportal.logoutSuccess();
		},
		noHandler : function ()
		{
			err_Dialog.close();
		}
	});
	err_Dialog.show();
}

iportal.logoutSuccess = function ()
{
	iportal.deleteCookies();
	iportal.jsutil.setLogoutPiggybackFlag(false);
	var rb = CRB.getFWBundle();
	var logout_params = {};
	logout_params['transactionCode'] = 'logout';
	// iportal.util.ajaxPiggyback.generatePiggybackRequest(logout_params);
	cbx.ajax({
		type : 'html',
		url : iportal.workspace.metadata.getContextRoot() + '/PortalLoginServlet',
		success : function (responseP, optionsP)
		{
			var response_obj = cbx.decode(responseP);
			if (response_obj.logout == 'success')
			{
				appRefresh = true;
				var successLogout = new iportal.Dialog({
					dialogType : 'MESSAGE',
					closeIconRequired : false,
					cls : 'portal_pos_btn',
					id : 'SUCCESS_LOGGEDOUT_WINDOW_ID',
					closeHandler : function ()
					{
						iportal.closeAllWin();
						window.close();
					},
					message : '<div style=\'padding:3px;\'><div style=\'padding:3px;\'>' + rb['LOGOUT_SUCCESS_MESSAGE']
								+ '</div></div>',
					okHandler : function ()
					{
						iportal.closeAllWin();
						window.close();
					},
					title : rb['LBL_EXIT_SUCCESS']
				}).show();
			} else if (response_obj.logout == 'session_timedout')
			{
				var successLogout = new iportal.Dialog({
					dialogType : 'MESSAGE',
					cls : 'portal_neg_btn',
					closeIconRequired : false,
					closeHandler : function ()
					{
						iportal.closeAllWin();
						window.close();
					},
					message : '<div style=\'padding:3px;\'><div style=\'padding:3px;\'>' + rb['LOGOUT_SUCCESS_MESSAGE']
								+ '</div></div>',
					okHandler : function ()
					{
						iportal.closeAllWin();
						window.close();
					},
					title : rb['LBL_EXIT_SUCCESS']
				}).show();
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
					iportal.closeAllWin();
					window.close();
				},
				title : rb['LBL_EXIT_FAILURE']
			}).show();
		},
		params : logout_params
	});
}
/**
 * This function is used to close all open windows when doing sign off
 */
iportal.closeAllWin = function ()
{
	iportal.deleteCookies();
	while (true)
	{
		var win = iportal.openWindows.pop();
		if (win)
		{
			if (!win.closed)
			{
				iportal.deleteCookies();
				win.close();
			}
		} else
		{
			break;
		}
	}
}

Ext.Ajax.on('requestexception', function (conn, response, options)
{
	if (/* !iportal.util.ajaxPiggyback.isPiggybackRequest(options) && */!options.params.__LISTVIEW_REQUEST
				&& !options.params.__FRAMEWORK_REQUEST && !options.params.IGNORE_MASKING)
	{
		iportal.jsutil.hideLoadingMsgOnBody();
	}
	iportal.sessionTimeout.cancel();
	iportal.sessionTimeout.delay(iportal.systempreferences.getIdleSessionTimeoutInSeconds());
	iportal.timedoutWindowClose.cancel();
	var rb = CRB.getFWBundle();
	if (response.status == "403" && iportal.jsutil.getLogoutPiggybackFlag())
	{
		options.failure = Ext.emptyFn;
		window.location.href = iportal.systempreferences.getSessionTimeOutURL();
	} else
	{
		var mask_el = Ext.getBody();
		mask_el.unmask();
		if (!options.params.forceCallbacks)
		{
			options.failure = Ext.emptyFn;
			options.success = Ext.emptyFn;
		}
		var respText = (response.responseText) ? response.responseText.toLowerCase() : '';
		if ((respText.indexOf('<html') != -1) && (respText.indexOf('</html>') != -1))
		{
			window.location.href = iportal.systempreferences.getSessionTimeOutURL();
		} else
		{
			var errorbundle = CRB.getFWBundle();
			var applicationTimedOut = new iportal.Dialog({
				dialogType : 'MESSAGE',
				cls : 'portal_neg_btn',
				message : errorbundle['REQUEST_EXCEPTION_MESSAGE'],
				okHandler : function ()
				{
					applicationTimedOut.close();
				},
				title : rb['LBL_ERROR']
			});
			applicationTimedOut.show();
		}
	}
	return;
});

/**
 * Single Gateway for opening new windows and showmodal dialogs
 */
iportal.openWindows = new Array();
/**
 * 
 */
iportal.printWindow;
/**
 * 
 */
iportal.openNewWindow = function (windowurl, handle, params)
{
	if (windowurl.indexOf('?') != -1)
	{
		windowurl += '&' + iportal.systempreferences.getCSRFKeyName() + '='
					+ iportal.systempreferences.getCSRFUniqueId();
	} else
	{
		windowurl += '?' + iportal.systempreferences.getCSRFKeyName() + '='
					+ iportal.systempreferences.getCSRFUniqueId();
	}
	iportal.sessionTimeout.cancel();
	iportal.timedoutWindowClose.cancel();
	iportal.startTimer();
	if (!params)
	{
		params = "resizable=1;";
	}
	var windowhandle = window.open(windowurl, handle, params);
	iportal.openWindows.push(windowhandle);

	if (handle === 'PRINT_IMAGE')
	{
		iportal.printWindow = windowhandle;
		iportal.showPrint(windowhandle);
	}
}
/**
 * 
 */
iportal.showPrint = function (windowhandle)
{
	windowhandle.print();
	self.setInterval("iportal.closePrintWin()", 2000);
}
/**
 * 
 */
iportal.closePrintWin = function ()
{
	var win = iportal.printWindow;
	if (win)
	{
		if (!win.closed)
		{
			if (win.document.readyState === 'complete')
			{
				win.close();
			}
		}
	}
}
/**
 * 
 */
iportal.showModalDialog = function (windowurl, handle, params)
{
	if (windowurl.indexOf('?') != -1)
	{
		windowurl += '&' + iportal.systempreferences.getCSRFKeyName() + '='
					+ iportal.systempreferences.getCSRFUniqueId();
	} else
	{
		windowurl += '?' + iportal.systempreferences.getCSRFKeyName() + '='
					+ iportal.systempreferences.getCSRFUniqueId();
	}
	iportal.sessionTimeout.cancel();
	iportal.timedoutWindowClose.cancel();
	/**
	 * The last entry put inside dialogArgument array for any portal showModal Dialogs will be the inactive time
	 * interval to be waited until the session timeout warning message shown to the user.
	 */
	handle.push(iportal.systempreferences.getIdleSessionTimeoutInSeconds());
	var windowhandle = window.showModalDialog(windowurl, handle, params);
	if (windowhandle)
	{
		/**
		 * if dialog's returnValue property has been set as 'show_warning_message' show timeout warning message to the
		 * user alerting him the session validity notification.
		 */
		if (windowhandle == 'show_warning_message')
		{
			iportal.showTimeoutWarningMessage(function ()
			{
				/**
				 * Since modal dialog is true modal, this XHR doesnt guaranteed to be returned with results, by the time
				 * modal dialog opened. This XHR will fire after 14 minutes if user inactive and again timeout dialog
				 * shown, which will effectively extend the portal session. So commenting this code.
				 * iportal.apps.alertPiggybackListner.processHighUnPoppedupAlerts();
				 */
				iportal.timedoutWindowClose.cancel();
				/**
				 * pop-out the last inactive interval as the succeeeding recursive call will put it anyway.
				 */
				handle.pop();
				iportal.showModalDialog(windowurl, handle, params);
			});
		} else
		{
			iportal.startTimer();
		}
	} else
	{
		if (handle[0].onCloseMethodRequired)
		{
			handle[handle[0].methodIndex].createDelegate(this, handle[0].arguments)();
		}
		iportal.startTimer();
	}
}

/**
 * @returns {___anonymous_IGPM}
 */
IGPM = function ()
{
	return {};
}();

/**
 * 
 */
iportal.createPrintModel = function (dataStructure, panelId, mode)
{
	var printModel = new iportal.framework.print.PrintModel(dataStructure.formtitle, mode);
	printModel.setPageHeader(dataStructure.formtitle);
	var fieldsets;
	var fields;
	if (dataStructure.fieldsets)
	{
		var fieldSetArray = new Array;
		Ext.each(dataStructure.fieldsets, function (fieldsetObj)
		{
			var fieldsArray = new Array;
			fieldsets = new iportal.framework.print.FieldSet(fieldsetObj.sectiontitle);
			if (fieldsetObj.fields)
			{
				Ext.each(fieldsetObj.fields, function (fieldsObj)
				{
					fields = new iportal.framework.print.Field();
					fieldsArray[fieldsArray.length] = fieldsObj;

				});
				fields.setFields(fieldsArray);
				fieldsets.setFields(fields);
			}
			fieldSetArray[fieldSetArray.length] = fieldsets;
		});
		printModel.setFieldSets(fieldSetArray);
	}
	IGPM[panelId] = printModel;
}

/**
 * 
 */
appRefresh = false;
/**
 * 
 */
iportal.application_refresh = function ()
{
	appRefresh = true;
	window.location.reload(true);
}

canvas.activeWindowClose = function ()
{
	Ext.WindowMgr.getActive().close();
}

/**
 * Method to activate a session of the user
 */
iportal.sendActiveToken = function ()
{
	var params = {
		INPUT_ACTION : 'ACTIVE_TOKEN',
		PAGE_CODE_TYPE : 'USER_PREF_CODE',
		PRODUCT_NAME : 'CANVAS',
		INPUT_FUNCTION_CODE : 'VSBLTY',
		INPUT_SUB_PRODUCT : 'CANVAS',
		INPUT_PRODUCT : 'CANVAS'
	};
	cbx.ajax({
		params : params,
		success : function (response)
		{
			iportal.sessionTimeout.cancel();
			iportal.sessionTimeout.delay(iportal.systempreferences.getIdleSessionTimeoutInSeconds());
			iportal.timedoutWindowClose.cancel();

		},
		failure : function ()
		{

			var errWin = new iportal.Dialog({
				dialogType : 'ERROR',
				cls : 'portal_pos_btn',
				message : CRB.getFWBundle()['SYSERROR'],
				toolButtons : [ 'close' ],
				okHandler : function ()
				{
					errWin.close();
				}
			})
			errWin.show();

		}
	});

}
