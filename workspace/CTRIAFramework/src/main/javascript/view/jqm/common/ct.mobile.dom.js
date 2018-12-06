/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

			document.write('<span id="fastclick">'),
			document.write('<div id="app" class="main-page" data-role="page" data-theme="cbxjqm"">'),
			document.write('<div id="HEADER_DIV" data-role="header"></div>'),
			document.write('<div id="CONTENT_DIV" data-role="content"  class="jqm-main-content">'),
			document
						.write("<div id = \"context-app-img\" style='display:none;position:absolute;right:0px;top:50%;height: 37px; width: 35px;'>"),
			document
						.write('<a href="#context-app-panel" data-rel="popup" data-shadow="false"  data-transition="slideup" data-role="button" class="slideright" style="height: 37px; width: 35px;" data-iconpos="notext"></a>'),
			document.write("</div>"), document.write("</div>"),
			// document.write('<div id = "FOOTER_DIV" data-role="footer" class="page-footer"
			// data-position="fixed"></div> '),
			// document.write("</div>"),
			document.write('<div id="context-menu" class="main-page" data-role="page" data-theme="a">'), document
						.write('<div id="CONTEXT-HEADER" data-role="header">'), document.write("	  "), document
						.write("</div>"), document.write('<div id="CONTEXT-CONTENT" data-role="content"></div>'),
			document.write("</div>"), document.write('<span id="ruler"></span>'), document.write("</span>");
var navPopup = "";
navPopup += "<div data-role=\"popup\" class=\"ui-content ct-pref-popup\" style=\"min-width:250px;max-width:350px;\" id=\"preferencePopup\" data-position-to=\".ct-misc-icon\" data-theme=\"c\">";
navPopup += "<div class=\"ct-pref-menu\" onclick=\"javacript:canvas.headerListeners.handleClick('preferences');\">";
navPopup += "<span class=\"fa-stack fa-lg\">";
navPopup += "  <i class=\"fa fa-square-o fa-stack-2x\"><\/i>";
navPopup += "  <i class=\"fa fa-cog fa-stack-1x\"><\/i>";
navPopup += "<\/span><span id=\"preferenceLabel\">" + CRB.getFWBundle()["LBL_PREF"] + "<\/span>";
navPopup += "<i class=\"ct-font-chevron fa fa-chevron-right pull-right\"><\/i>";
navPopup += "<\/div>";
navPopup += "<hr>";
navPopup += "<div class=\"ct-logout-menu\" onclick=\"javacript:canvas.headerListeners.handleClick('logout');\">";
navPopup += "<span  class=\"fa-stack fa-lg\">";
navPopup += "  <i class=\"fa fa-square-o fa-stack-2x\"><\/i>";
navPopup += "  <i class=\"fa fa-power-off fa-stack-1x\"><\/i>";
navPopup += "<\/span><span id=\"logoutLabel\">" + CRB.getFWBundle()["LBL_LOGOUT"] + "<\/span>";
navPopup += "<i class=\"ct-font-other fa fa-chevron-right pull-right\"><\/i>";
navPopup += "<\/div>"
navPopup += "<\/div>";
document.write(navPopup);
delete navPopup;
var popupLink = "";
popupLink += "<a href=\"#preferencePopup\" id=\"miscLink\" data-rel=\"popup\" data-role=\"button\" class=\"ui-icon-alt\" data-inline=\"true\" data-transition=\"slidedown\" data-icon=\"info\" data-theme=\"e\" data-iconpos=\"notext\" style=\"display:none\"><\/a>";
document.write(popupLink);
delete popupLink;

if ($("[id^=popupUserImg]").length <= 0)
{
	var userImagePopup = "";
	userImagePopup += "<div data-role=\"popup\" id=\"popupUserImg\" data-overlay-theme=\"a\" data-theme=\"d\" data-corners=\"false\">";
	userImagePopup += "<h3 class=\"ct-user-name-max\"><\/h3><p class=\"ct-user-info-max\"><\/p>";
	userImagePopup += "<a href=\"#\" data-rel=\"back\" data-role=\"button\" data-theme=\"a\" data-icon=\"delete\" data-iconpos=\"notext\" class=\"ui-btn-right\">Close<\/a><form id='imgUploadForm' enctype='multipart/form-data'><img class=\"popphoto ct-maximize-userimg\" src=\"\" style=\"max-height:70%;\"><div style='display:none;'><input type=\"file\" style='display:none;' accept=\"image/*\" id=\"takePictureField\"></div></form><div id='nav1' data-role='navbar'><ul><li><a id='pictureupload' href='#' data-theme='a'>Change..</a></li></ul></div>";
	userImagePopup += "<\/div>";
	$("body #app").append(userImagePopup);
	// document.write(userImagePopup);
	delete userImagePopup;

}
window.onbeforeunload = function ()
{
	CBXTXNMGR.destroyActiveTransaction();
}

window.onDragStart = function ()
{
	return;
}

function msieversion ()
{
	var ua = window.navigator.userAgent
	var msie = ua.indexOf("MSIE ")

	if (msie > 0) // If Internet Explorer, return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)))
	else
		// If another browser, return 0
		return 0

}

this.preLoadEvent = document.createEvent("CustomEvent");
// Define that the event name is 'build'.
this.preLoadEvent.initCustomEvent('beforeLoad', true, true, {});
this.postLoadEvent = document.createEvent("CustomEvent");
// Define that the event name is 'build'.
this.postLoadEvent.initEvent('afterLoad', true, true);
this.transactionComplete = document.createEvent("CustomEvent");
this.transactionComplete.initEvent('tfdconfirm', true, true);
var iscroller; // CTMQ315F16
var doIScroll = function (id, mode, scrollConfig)
{

	/**
	 * Added for IE browser compat
	 */
	if (cbx.isIE() && msieversion() <= 9)
	{
		var wrapperEle = $('#' + id)
		wrapperEle.removeClass('jqm-main-content').addClass('ie-jqm-main-content');
		var scrollerEle = wrapperEle.children(':first');
		scrollerEle.css('overflow', 'auto !important');
	} else
	{
		/**
		 * Above IE 10,11 iscroll is woking in bellow script
		 */
		// var iscroller; //CTMQ315F16
		var options = {
			scrollX : scrollConfig && !cbx.isEmpty(scrollConfig.scrollX) ? scrollConfig.scrollX : false,
			scrollY : scrollConfig && !cbx.isEmpty(scrollConfig.scrollY) ? scrollConfig.scrollY : true,
			// useTransform: true,
			tap : true,
			// click:true,
			bounce : false,
			scrollbars : scrollConfig && !cbx.isEmpty(scrollConfig.scrollbars) ? scrollConfig.scrollbars : true,
			preventDefaultException : {
				className : /(^|\s)ct-form-component|ui-btn-inner|cbx-combobox|cbx-textbox|ui-select|ui-input-text(\s|$)/
			}
		}
		var element = cbx.isString(id) ? $('#' + id) : $(id);
		if (mode === "add")
		{
			var addFlag = scrollConfig && scrollConfig['forceadd'] == true ? true : false;
			if ((element && !element[0].iscrollEle) || addFlag)
			{
				iscroller = new IScroll("#" + id, options);
				element[0].iscrollEle = iscroller;
				cbx.lib.utility.scrollToElement(scrollConfig, iscroller);

				iscroller.on('scrollStart', function (e)
				{
					cbx.lib.utility.focusActiveElement();
				});
				if (!scrollConfig || (scrollConfig && !scrollConfig.preventBeforeScroll))
				{
					iscroller.on('beforeScrollStart', function ()
					{
						cbx.lib.utility.doOnBeforeScroll(this);
					});
				}
			}

			else
			{
				doIScroll(id, 'refresh', scrollConfig);
				return;
			}
			// else if(element && element[0].iscrollEle){
			// $("#"+id)[0].iscrollEle.destroy();
			// delete $("#"+id)[0].iscrollEle;
			// $("#"+id)[0].iscrollEle = new iScroll(id,options);
			// iscroller = $("#"+id)[0].iscrollEle;
			// }
			setTimeout(function ()
			{
				iscroller.refresh();
			}, 0);
		} else if (mode == "refresh")
		{
			if (element && element[0].iscrollEle)
			{
				iscroller = element[0].iscrollEle
				setTimeout(function ()
				{
					iscroller.enable();
					iscroller.refresh();

					cbx.lib.utility.scrollToElement(scrollConfig, iscroller);
				}, 0);
			} else
			{
				// doIScroll(id,'add',scrollConfig);
				return;

			}
		} else if (mode == "disable")
		{
			if (element && element[0].iscrollEle)
			{
				element[0].iscrollEle.disable();
			}
		} else if (mode == "enable")
		{
			if (element && element[0].iscrollEle)
			{
				element[0].iscrollEle.enable();
				doIScroll(id, 'refresh');

			}
		} else
		{
			if (element && element[0].iscrollEle)
			{
				$("#" + id)[0].iscrollEle.destroy();
				delete $("#" + id)[0].iscrollEle
			}

		}
	}
}
$(document).ready(function ()
{
	var bodyht = $(window).height();

	var headerHt = $('#HEADER_DIV').height();
	var footerHt = $('#FOOTER_DIV').height();
	var subHt = headerHt + footerHt;
	var newHt = bodyht - subHt;
	$('#CONTENT_DIV').height(newHt);

	/*
	 * var top = $('#context-app-img').offset().top - parseFloat($('#context-app-img').css('marginTop').replace(/auto/,
	 * 0)); $(window).scroll(function (event) { // what the y poiscrsition of the scroll is var y = $(this).scrollTop(); //
	 * whether that's below the form if (y >= top) { // if so, ad the fixed class
	 * $('#context-app-img').addClass('context-app-fixed'); } else { // otherwise remove it
	 * $('#c96%ontext-app-img').removeClass('context-app-fixed'); } });
	 */
	// addIscroll('context-app-panel-popup');
	// Create the event.
});

if (window.navigator.msPointerEnabled)
{
	document.addEventListener("MSGestureTap", function (e)
	{
		e.preventDefault();
	}, false);
	// Disables selection
	document.addEventListener("selectstart", function (e)
	{
		e.preventDefault();
	}, false);
	// Disables visual
	document.addEventListener("MSHoldVisual", function (e)
	{
		e.preventDefault();
	}, false);
	// Disables menu
	document.addEventListener("contextmenu", function (e)
	{
		e.preventDefault();
	}, false);
	document.addEventListener("MSInertiaStart", function (e)
	{
		e.preventDefault();
	}, false);
	document.addEventListener('MSGestureStart', function (event)
	{
		event.preventDefault();
	}, false);
	document.addEventListener('MSGestureEnd', function (event)
	{
		event.preventDefault();
	}, false);
	document.addEventListener('MSPointerMove', function (e)
	{
		e.preventDefault();
	}, false);
}
document.addEventListener('touchmove', function (e)
{
	e.preventDefault();
}, false);

$(document).on("pageinit", function ()
{
	$("#popupUserImg").on({
		popupbeforeposition : function ()
		{
			var maxHeight = $(window).height() - 150 + "px";
			$(".ct-maximize-userimg").css("max-height", maxHeight).css('width', '100%');
			$(".ct-user-info-max").css("max-width", "100%");
		}
	});
});

$('#takePictureField')
			.on(
						'change',
						function (event)
						{
							event.preventDefault();
							if (this.files.length === 0)
								return;
							var imageFile = this.files[0];
							var img = new Image();
							var url = window.URL ? window.URL : window.webkitURL;
							img.src = url.createObjectURL(imageFile);
							img.onload = function (event)
							{
								url.revokeObjectURL(this.src);

								var width;
								var height;
								var binaryReader = new FileReader();
								var config = {};
								binaryReader.onloadend = function (d)
								{
									var exif, transform = "none";
									exif = EXIF.readFromBinaryFile(d.target.result);

									var paramObj = {};
									paramObj["__PIGGYBACKREQUEST"] = 'N';
									paramObj["headers"] = "{'Content-type' :'multipart/form-data'}";
									paramObj[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences
												.getCSRFUniqueId();

									var fd = new FormData();
									fd.append('files', imageFile);
									fd.append('params', paramObj);

									CTLOADMASKMANAGER.initiateLoadMask(config, "Uploading. Please wait...");
									var isHybrid = iportal.systempreferences.isHybrid() === "true" ? "H" : "M";
									var uploadServletUrl = iportal.systempreferences.isHybrid() === "true"
												? getDomainUrl() + "PictureUploadServlet?" : "./PictureUploadServlet?";
									var xhr = new XMLHttpRequest();
									xhr.upload.addEventListener("error", imguploadFailed, false);
									xhr.upload.addEventListener("abort", imguploadCanceled, false);
									xhr
												.open(
															"POST",
															uploadServletUrl
																		+ "imgHandle=STORE_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&IMG_ORIENTATION="
																		+ exif.Orientation
																		+ "&PRODUCT_NAME=CUSER&isHybrid=" + isHybrid
																		+ "&timeout='+new Date()'");
									/*
									 * Only after the user image gets uploaded,request has been sent to the server to
									 * display the newly uploaded image using onreadystatechange.After fetching the
									 * imagedata from the server it will be stored into the cache.
									 */
									xhr.onreadystatechange = function (evt)
								{
										if (xhr.readyState == 4 && xhr.status == 200)
										{
									var isHybrid = iportal.systempreferences.isHybrid() === "true" ? "H" : "M";
									var uploadServletUrl = iportal.systempreferences.isHybrid() === "true"
														? getDomainUrl() + "PictureUploadServlet?"
														: "./PictureUploadServlet?";
											var upload_params = {
												imgHandle : 'GET_USER_IMAGE',
												INPUT_ACTION : 'PICTURE_PROCESS_ACTION',
												INPUT_FUNCTION_CODE : 'VSBLTY',
												INPUT_SUB_PRODUCT : 'CUSER',
												PAGE_CODE_TYPE : 'PICTURE_PROCESS',
												PRODUCT_NAME : 'CUSER',
												isHybrid : isHybrid,
												timeout : new Date()
											};
											cbx.ajax({
												type : 'json',
												params : upload_params,
												url : uploadServletUrl,
												success : function (metadata)
									{
													var lastModified = metadata.response.lastModified;
													var imageSource = metadata.response.imageData;
										$(".popphoto").attr('src', imageSource);
										$('.ui-li-thumb').attr('src', imageSource);
										$("#pictureupload").removeClass("ui-btn-active");
										$("#popupUserImg").popup("close");
										CTLOADMASKMANAGER.hideLoadMask(config);
													try
													{
														canvas.metadata.storeMetaData("USER_IMAGE", {
															id : "USER_IMAGE",
															value : {
																imageData : metadata.response.imageData,
																lastModified : metadata.response.lastModified
															},
															serverdatetime : metadata.response.SERVER_SYNCTIME
														});
													} catch (e)
													{
														LOGGER.error('Error while storing user image cache ', e);
								}
												},
												error : function ()
												{
													LOGGER.error("Error while loading response", arguments);
												}
											});
										}
									};
									xhr.send(fd);
								};
								binaryReader.readAsArrayBuffer(imageFile);
								function imguploadFailed (evt)
								{
									CTLOADMASKMANAGER.hideLoadMask(config);
									$("#pictureupload").removeClass("ui-btn-active");
								}
								function imguploadCanceled (evt)
								{
									CTLOADMASKMANAGER.hideLoadMask(config);
									$("#pictureupload").removeClass("ui-btn-active");
								}
							};
						});
$('#pictureupload').on('click', function (event)
{
	if (canvas.env.network.getState() == 'ACTIVE')
	{
	$('#takePictureField').click();
	} else
	{
		$("#pictureupload").removeClass("ui-btn-active");
		$("#popupUserImg").popup("close");
		/*
		 * var successDialog = new iportal.Dialog({ dialogType : "ERROR", //title : "Error Window", message : "No
		 * Network connection..Please connect to any network", okHandler : function () { successDialog.close(); } });
		 * successDialog.show();
		 */
	}
});
canvas.MessageBus.subscribe("canvas.hybrid.lazyChanges", 'canvas.hybrid' + cbx.id(), this, function (data)
{
	$('#preferencePopup').find('#preferenceLabel').html(CRB.getFWBundle()["LBL_PREF"]);
	$('#preferencePopup').find('#logoutLabel').html(CRB.getFWBundle()["LBL_LOGOUT"])
	initFastButtons();
});
