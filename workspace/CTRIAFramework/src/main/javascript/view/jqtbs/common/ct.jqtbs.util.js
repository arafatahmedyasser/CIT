/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
Ext = {};
Ext.ns = function (name, separator, container)
{
	var ns = name.split(separator || '.'), o = container || window, i, len;
	for (i = 0, len = ns.length; i < len; i++)
	{
		o = o[ns[i]] = o[ns[i]] || {};
	}
	return o;
};

Ext.namespace = Ext.ns;

Ext.override = function (origclass, overrides)
{
	if (overrides)
	{
		var p = origclass.prototype;
		p = $.extend(p, overrides);
		if (Ext.isIE && overrides.hasOwnProperty('toString'))
		{
			p.toString = overrides.toString;
		}
	}
};

Ext.extend = function ()
{

};

Ext.isEmpty = cbx.isEmpty;

Ext.ns('Ext.util.Observable');
Ext.util.Observable = function ()
{
};

cbx.namespace("iportal");

iportal.logoutUser = function ()
{
	var bundle = CRB.getBundle(CRB.getFWBundleKey());
	var logoutConfirmationDialog = new canvas.Dialog({
		title : bundle['LBL_MESSAGE'],
		message : bundle['MSG_SIGNOF_CONF'],
		dialogType : "USERDEFINED",
		dialogStyle : "YES_NO",
		yesHandler : function ()
		{
			logoutConfirmationDialog.close();
			iportal.logoutSuccess();
		}
	});
	logoutConfirmationDialog.show();

};

iportal.openNewWindow = function (path, type, params)
{
	if (type === "helpwin")
	{
		window.open(path, "_blank", params);
	}
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

iportal.logoutSuccess = function() {
    iportal.deleteCookies();
    iportal.jsutil.setLogoutPiggybackFlag(false);
    var rb = CRB.getFWBundle();
    var logout_params = {};
    logout_params['transactionCode'] = 'logout';
/*    var bundle = CRB.getBundle(CRB.getFWBundleKey());
    var logoutSuccessDialog = new canvas.Dialog({
        title: bundle['LBL_EXIT_SUCCESS'],
        message: bundle['LOGOUT_SUCCESS_MESSAGE'],
        dialogType: "USERDEFINED",
        dialogStyle: "OK",
        okHandler : function() {
        	 window.location = iportal.workspace.metadata.getContextRoot() + '/PortalLoginServlet';
        }
    });
    logoutSuccessDialog.show();*/
 
    cbx.ajax({
        type: 'html',
        url: iportal.workspace.metadata.getContextRoot() + '/PorlLoginServlet',
        success: function(responseP, optionsP) {
            var response_obj = cbx.decode(responseP.responseText);
            LOGGER.log("responseP", responseP);
            LOGGER.log("optionsP", optionsP);
            var logoutSuccessDialog;
            if (response_obj.logout == 'success') {
                appRefresh = true;
                var bundle = CRB.getBundle(CRB.getFWBundleKey());
                logoutSuccessDialog = new canvas.Dialog({
                    title: bundle['LBL_EXIT_SUCCESS'],
                    message: bundle['LOGOUT_SUCCESS_MESSAGE'],
                    dialogType: "USERDEFINED",
        			dialogStyle: "OK",
                });
                logoutSuccessDialog.show();
            } else if (response_obj.logout == 'session_timedout') {
                logoutSuccessDialog = new canvas.Dialog({
                    message: bundle['LOGOUT_SUCCESS_MESSAGE'],
                    title: bundle['LBL_EXIT_SUCCESS'],
                    dialogType: "USERDEFINED",
        			dialogStyle: "OK",
                });
                logoutSuccessDialog.show();
            }
        },
        failure: function(responseP, optionsP) {
        	 LOGGER.log("responseP failure", responseP);
             LOGGER.log("optionsP failure", optionsP);
            var failureLogout = new canvas.Dialog({
                dialogType: 'ERROR',
                message: bundle['LOGOUT_FAILURE_MESSAGE'],
                title: bundle['LBL_EXIT_FAILURE']
            });
            failureLogout.show();
        },
        complete: function (response) {
        	window.location.href = iportal.workspace.metadata.getContextRoot() + '/PortalLoginServlet';
        },
        params: logout_params
    });
};

/**
 * This function is used to close all open windows when doing sign off
 */

cbx.ns("cbx.form.util");
cbx.form.util = function ()
{
	var idSeed = 0;
	var _ob = {};
	return {
		/**
		 * Expected to receive the date in form of string and converting to appropriate date format.
		 */
		convertStringToDateObject : function (stdat)
		{
			if (!cbx.core.isEmpty(stdat) && typeof (stdat) == 'string')
			{
				var vals = stdat.split("/");
				var xdate = null;
				var monthfield = vals[1];
				var dayfield = vals[0];
				var yearfield = vals[2];
				xdate = new Date(yearfield, monthfield - 1, dayfield);
				if ((xdate.getMonth() + 1 != monthfield) || (xdate.getDate() != dayfield)
							|| (xdate.getFullYear() != yearfield))
				{
					return "Invalid Date";
				} else
				{
					xdate = new Date();
					var intvals = [ Number(vals[0]), Number(vals[1]), Number(vals[2]) ];
					xdate.setFullYear(intvals[2], intvals[1] - 1, intvals[0]);
					return xdate;
				}
			} else
			{
				return stdat;
			}
		},
		id : function ()
		{
			return idSeed++;
		}
	};
}();

cbx.ns("canvas");
canvas.editUploadPicture = function ()
{
	var that = this;
	this.wndDetailedPictureEdit = null;
	this.paramObj = {};
	this.pictUploadForm = null;
	var bundle = CRB.getBundle(CRB.getFWBundleKey());
	var uploadPictureDialog = new canvas.Dialog(
				{
					title : bundle['LBL_CHANGE_PICTURE'],
					message : '<form data-item-id="picUploadForm"><fieldset><legend> '
								+ bundle["uploadText"]
								+ ' </legend><div class="form-group form-inline"><label class="control-label errorLabel" for="uploadPic" style="display:none;">'
								+ bundle["FILE_NOT_SUPPORTED"]
								+ '</label>'
								+ '<input type="file" id="uploadPic" name="upload" accept="image/*"  required=required ></div></fieldset></form>',
					dialogType : "USERDEFINED",
					dialogStyle : "OK_CANCEL",
					okHandler : function ()
					{
						if ($("#uploadPic").val() == "" || $("#uploadPic").val() == null)
						{
							$("#uploadPic").parent().addClass("has-error");
							$("#uploadPic").siblings('label.errorLabel').hide();
							return false;
						} else
						{

							var imagefile = $("#uploadPic").val().substring($("#uploadPic").val().lastIndexOf(".") + 1,
										$("#uploadPic").val().length);
							if (imagefile && imagefile.toLowerCase() != "jpg" && imagefile.toLowerCase() != "jpeg"
										&& imagefile.toLowerCase() != "gif" && imagefile != "JPG" && imagefile != "GIF"
										&& imagefile.toLowerCase() != "bmp" && imagefile.toLowerCase() != "png")
							{
								$("#uploadPic").parent().addClass("has-error");
								$("#uploadPic").siblings('label').show();
							} else
							{
								var URL = './PictureUploadServlet?imgHandle=STORE_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout='
											+ new Date() + '';
								var form = $('form[data-item-id="picUploadForm"]');
								form.attr(iportal.systempreferences.getCSRFKeyName(), iportal.systempreferences
											.getCSRFUniqueId());
								form.attr('__PIGGYBACKREQUEST', 'N');
								var element = $('#FOOTER_DIV').find('form[data-item-id="picUploadForm"]').parent();
								CTLOADMASKMANAGER.initiateLoadMask(element, '', element);
								ct
											.pictureUpload({
												form : form,
												url : URL,
												getResponse : function (res)
												{
													var showInfoWindow;
													CTLOADMASKMANAGER.hideLoadMask(element, element);
													if (res.success == "true")
													{
														$('#HEADER_DIV')
																	.find(
																				'[data-item-id="ct_picedit"],[data-item-id="ct-pic"]')
																	.attr(
																				'src',
																				"./PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout="
																							+ new Date());
														uploadPictureDialog.close();
														showInfoWindow = new canvas.Dialog({
															title : 'Update',
															message : 'Picture Updated Succesfully',
															dialogType : "USERDEFINED",
															dialogStyle : "OK"
														});
														showInfoWindow.show();
													} else
													{
														uploadPictureDialog.close();
														if (res.data.response)
														{
															showInfoWindow = new canvas.Dialog({
																title : 'Update',
																message : res.data.response,
																dialogType : "USERDEFINED",
																dialogStyle : "OK"
															});
															showInfoWindow.show();
														}
													}
												}
											});
							}
						}
					}
				});
	uploadPictureDialog.show();
};
/* return 'true' if the value passed is within the range of minValue and maxValue else returns false */
canvas.compareNumber = function (value, maxValue, minValue)
{
	var result = true;
	var beforeDecimal = [ parseInt(value, 10), parseInt(maxValue, 10), parseInt(minValue, 10) ];
	var afterDecimal = [];
	afterDecimal[0] = value - beforeDecimal[0];
	afterDecimal[1] = maxValue - beforeDecimal[1];
	afterDecimal[2] = minValue - beforeDecimal[2];
	// case for failure checks
	if ((beforeDecimal[0] > beforeDecimal[1] || beforeDecimal[0] < beforeDecimal[2]))
	{
		result = false;
	} else if (((beforeDecimal[0] == beforeDecimal[1]) && (afterDecimal[0] > afterDecimal[1]))
				|| ((beforeDecimal[0] == beforeDecimal[2]) && (afterDecimal[0] < afterDecimal[2])))
	{
		result = false;
	}
	return result;
};

canvas.showPreferences = function ()
{
	CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray([ "FORM_CONTAINER", "WSPACE_PREF_FORMS" ]),
				function ()
				{
					var fm = new cbx.form.FormManager({
						formId : "UPDATE_PREF_FORM"
					});
					CBXFORMCONTAINER.getWindowByFormObj(fm, "UPDATE_PREF_FORM_CONTAINER", null);
				});
};

/*
 * IGPM global Object
 */
IGPM = function ()
{
	return {};
}();

cbx.ns("ct.app.exportHandler");
ct.app.exportHandler = function ()
{
	return {
		execute : function (config, exportType)
		{
			var filterParamsExport;
			var recordsCount;
			var wdgtID;
			var exportContent;
			var url;
			var colProp;
			var chartParams;
			var md = config.md.md.VIEW_MD;
			wdgtID = config.md.WIDGET_ID;
			if (md.FLD_VIEW_TYPE != "CHART")
			{

				filterParamsExport = config.renderer.prepareParams();
				recordsCount = md.FLD_VIEW_TYPE == "ADVGROUP" ? config.renderer.perPage : config.renderer.recordsLength;
				colProp = JSON.stringify(config.renderer.headerArrayContent);
			}

			var type = exportType.toUpperCase();
			var baseUrl = iportal.workspace.metadata.getContextRoot() + "/ExportServiceServlet";

			var defaultInputs = {
				'INPUT_FUNCTION_CODE' : md.FUNCTION_CODE || 'VSBLTY',
				'PRODUCT_NAME' : md.PRODUCT_CODE || 'CUSER',
				'INPUT_SUB_PRODUCT' : md.SUB_PRODUCT_CODE || 'CUSER',
				'GROUP_HEADER_REQD' : md.FLD_GROUP_HEADER_REQD || 'N',
				'INPUT_ACTION' : 'EXPORT_ACTION',
				'WIDGET_ID' : wdgtID,
				'VIEW_ID' : md.VIEW_ID,
				'CURRENCY_CD' : iportal.preferences.getEquivalentCurrency(),
				'WID_BUNDLE_KEY' : md.FLD_BUNDLE_KEY,
				'_colProperties' : colProp
			};
			defaultInputs[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
			if (type === "PRINT")
			{
				if (md.FLD_VIEW_TYPE == "CHART"/*
												 * || config.respData != null || config.respData.ADDITIONAL_DATA !=
												 * undefined
												 */)
				{// Need to optimize
					if (config.renderer.config.isGridView)
						exportContent = config.renderer.getGridData();
					else
						exportContent = config.renderer.getExportContent();
					colProp = [];
					chartParams = {
						'PAGE_CODE_TYPE' : 'VECTOR_EXPORT',
						'EXPORT_FORMAT' : 'VECTOR' + type,
						'HTMLDATA' : exportContent,
						'ONLY_CONTENT' : 'Y'
					};
					$.extend(chartParams, defaultInputs);
					IGPM.params = chartParams;
				} else
				{
					$.extend(filterParamsExport, defaultInputs);
					IGPM.params = filterParamsExport;
				}
				IGPM.params["INPUT_ACTION"] = "INIT_DATA_ACTION";
				window
							.open(
										iportal.workspace.metadata.getContextRoot()
													+ '/CTRIAFramework/jsp/JqtbsPrint.jsp'
													+ '?elementIdForConfirmationMsg=' + wdgtID + '',
										'print',
										'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,border=thin,top=20,left=110,width=750,height=650');
				return;

			} else if ((md.FLD_VIEW_TYPE == "CLASSIC_GRID" || md.FLD_VIEW_TYPE == "LIST"
						|| md.FLD_VIEW_TYPE == "PAGING" || md.FLD_VIEW_TYPE == "PROPERTY"
						|| md.FLD_VIEW_TYPE == "ADVGROUP" || md.FLD_VIEW_TYPE == "GROUP")
						&& (recordsCount > 1))
			{

				filterParamsExport.EXPORT_FORMAT = type;
				$.extend(filterParamsExport, defaultInputs);

			} else if (md.FLD_VIEW_TYPE == "CHART" /*
													 * || config.respData != null || config.respData.ADDITIONAL_DATA !=
													 * undefined
													 */)
			{
				delete defaultInputs._colProperties;
				if (config.renderer.config.isGridView)
					exportContent = config.renderer.getGridData();
				else
					exportContent = config.renderer.getExportContent();
				colProp = [];
				filterParamsExport = {
					'PAGE_CODE_TYPE' : 'VECTOR_EXPORT',
					'EXPORT_FORMAT' : 'VECTOR' + type,
					'HTMLDATA' : exportContent,
					'ONLY_CONTENT' : 'Y'
				};

				$.extend(filterParamsExport, defaultInputs);

			} else
			{
				var bundle = CRB.getBundle(CRB.getFWBundleKey());
				var noDataDialog = new canvas.Dialog({
					dialogType : 'ERROR',
					message : bundle['NO_DATA_MSG'],
					title : bundle['LBL_WARN']
				});
				noDataDialog.show();
				return;
			}

			var method = "post";
			var form = document.createElement("form");
			form.setAttribute("method", method);
			form.setAttribute("action", baseUrl);
			form.setAttribute("target", "_blank");
			if (!cbx.isEmpty(filterParamsExport))
			{
				for ( var i in filterParamsExport)
				{
					var hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", i);
					hiddenField.setAttribute("value", filterParamsExport[i]);
					form.appendChild(hiddenField);
				}
			}
			document.body.appendChild(form);
			try
			{
				form.submit();
				form.parentNode.removeChild(form);
			} catch (e)
			{
				LOGGER.info("Already temprary form Deleted");
			}
		}
	};
}();

/**
 * 
 */

cbx.ns("ct.app.helpHandler");
ct.app.helpHandler = function ()
{
	return {
		execute : function (fileName)
		{
			var paramshelp = 'toolbar=no,location=no,directories=no,status=no,'
						+ 'menubar=no,scrollbars=yes,resizable=yes,border=thin,top=150,left=130,width='
						+ (screen.availWidth - 230) + ',height=' + (screen.availHeight - 240);
			var filePath = '';
			if (!cbx.isEmpty(fileName))
			{
				filePath = iportal.workspace.metadata.getContextRoot() + "/help_files/"
							+ iportal.preferences.getPrimaryLang() + "/" + fileName;
				var scope = {
					'path' : filePath,
					'paramsHelp' : paramshelp
				};
				var config = {
					'url' : filePath,
					type : "html",
					originalPath : filePath,
					success : function ()
					{
						var helphandle = window.open(scope.path, scope.paramsHelp);
					},
					fail : function ()
					{
						var filePath = iportal.workspace.metadata.getContextRoot() + "/help_files/"
									+ iportal.preferences.getPrimaryLang() + "/" + "UnderConstruction.html";
						var helphandle = window.open(filePath, scope.paramsHelp);
					},
					error : function (data)
					{
						var filePath = iportal.workspace.metadata.getContextRoot() + "/help_files/"
									+ iportal.preferences.getPrimaryLang() + "/" + "UnderConstruction.html";
						var helphandle = window.open(filePath, scope.paramsHelp);
					}
				};
				var req = reqwest(config);
			} else
			{
				filePath = iportal.workspace.metadata.getContextRoot() + "/help_files/"
							+ iportal.preferences.getPrimaryLang() + "/" + "UnderConstruction.html";
				var helphandle = window.open(filePath, paramshelp);
			}
		}
	};
}();

isNative = function ()
{
	var useNative = null;
	return function ()
	{
		if (useNative === null)
		{
			useNative = window.JSON && JSON.toString() == '[object JSON]';
		}
		return useNative;
	};
}();
doDecode = function (json)
{
	try
	{
		return json ? eval("(" + json + ")") : "";
	} catch (e)
	{
		LOGGER.error(e);
	}
};
cbx.core.objectDecode = function ()
{
	var dc;
	return function (json)
	{
		if (!dc)
		{
			// setup decoding function on first access
			dc = isNative() ? JSON.parse : doDecode;
		}
		return dc(json);
	};
}();

/**
 * This function is used for  awa
 */

jQuery.fn.ForceNumericOnly = function ()
{
	return this.each(function ()
	{
		$(this).keydown(
					function (e)
					{
						var key = e.charCode || e.keyCode || 0;
						// allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
						return (key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40)
									|| (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
					});
	});
};

$.browser = bowser;