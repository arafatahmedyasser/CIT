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

cbx.ns('cbx.lib.utility');
/*
 * This class helps to make the ajax calls for retrieving the data

 */


cbx.lib.utility = function(){
	return {
		appendCmp : function(scope,item){
			if(typeof scope == 'object'){
				$(scope).append(item).trigger('create');
				doIScroll('CONTENT_DIV','refresh');
			}
			return true;
		},
		prependCmp : function(scope, item){
			if(typeof scope == 'object'){
				$(scope).prepend(item).trigger('create');
				doIScroll('CONTENT_DIV','refresh');
			}
			return true;
		},
		/* Removing the child elements of an element from DOM */
		removeChildElements: function(parentContainer){
			while(parentContainer.firstChild) {
				parentContainer.removeChild(parentContainer.firstChild);
			}
		},
		maskPage : function(){

		},
		unmaskPage : function(){

		},

		applyOverLay : function(){
			//$('#app').wrap('<div class="overlay"/>');
			doIScroll('CONTENT_DIV','disable');
		},
		removeOverLay : function(){
			//$('#app').unwrap();
			setTimeout(function(){
				doIScroll('CONTENT_DIV','refresh');
			},400)
		},

		formatDate : function(v,inFormat, outFormat) {
			inFormat = inFormat||'d/m/Y';
			if (!v) {
				return "";
			}
			var dateRegExp = /\d{2}\/\d{2}\/\d{4}/;
			var parsedDate=dateRegExp.exec(v).join("");
			if (!cbx.isDate(parsedDate)) {
				v = new Date.parseDate(parsedDate,inFormat);
			}
			return v.dateFormat(outFormat || "m/d/Y");
		},

		openHeaderPopup : function(){
			if(!$('.cbx-maskable-content')[0] || $('.cbx-maskable-content').hasClass('cbx-panel-closed')){
				$("#wscontainer").panel().show();
				$("#wscontainer").on({
					panelopen : function(){
						//$("#wscontainer").removeClass('cbx-panel-closed');
						var scrollEle =$('#wswrapper')[0];
						var scrllConfig = {
									"ele":	scrollEle,
									"duration":0,
									"clickEventReq":false  
						};
						//doIScroll('wswrapper','add');
						doIScroll('wswrapper','add',scrllConfig); 
					},
					panelbeforeopen : function(){
						$('.ct-quicklink').addClass('close');
						
					},
					panelbeforeclose : function(){
						$('.ct-quicklink').removeClass('close');
						
					},
					panelclose : function(){
						doIScroll('wswrapper','remove');
						//$("#wscontainer").addClass('cbx-panel-closed');
					}
				});
				$("#wscontainer").panel("open");
			}
		}	

		,promptUserLogOut : function(){
			var that = this;
			var rb = CRB.getFWBundle();
			var err_Dialog = new iportal.Dialog({
				dialogType : 'WARNING',
				title : rb['LBL_CONFIRMATION'],
				message : rb['LBL_SIGNOUT_CONFIRM'],
				okHandler : function (){
					err_Dialog.close();
					cbx.jsutil.logoutUser();
				},
				cancelHandler : function (){
					if(iportal.systempreferences.isNavigationEnabled()){
						/**
						 * Resetting the url cache and loading the inital workspace
						 */
						//$.mobile.urlHistory.clearForward();
						err_Dialog.on('popupafterclose',function(){
							that.loadInitialWorkspace(null);
						})
					}
					err_Dialog.close();
				}
			});
			err_Dialog.show();
		},
		navigateToPrev:function(e){
			//window.history.back();
			window.history.go(-1);
			e.stopImmediatePropagation();
		},

		loadInitialWorkspace : function (wsId)
		{

			// Validate if Workspace Object Exists for the given workspace-id
			var wsObj = cbx.core.ws.metadata.getWorkSpaceById(wsId);
			if (!cbx.isEmpty(wsObj))
			{
				cbx.lib.workspacehandler.activateWorkspace(wsId);
			} else
			{
				cbx.lib.workspacehandler.activateWorkspace(null, 0, null, null, true);
			}

		},
		loadPreferences:function(){
			CBXDOWNLOADMGR.requestScripts(cbx.downloadProvider.getMergedArray(["FORM_CONTAINER","WSPACE_PREF_FORMS"]), function ()
						{

				CBXFORMCONTAINER.getWindowByFormId("UPDATE_PREF_FORM", "UPDATE_PREF_FORM_CONTAINER", null,null);
						});
		},
		resizeContentDiv:function(){

			var bodyht = $.mobile.activePage.height();
			var footerHt = $('#FOOTER_DIV').is(':visible')?$('#FOOTER_DIV').height():0;
			var headerHt = $('#HEADER_DIV').height();
			var subHt = headerHt+footerHt;
			var newHt = bodyht-subHt;
			if(cbx.isEmpty(window.focusEle)){
				$('#CONTENT_DIV').height(newHt);
				doIScroll('CONTENT_DIV','refresh');
				setTimeout(function(){
					var focusFields = $('input,select,textarea').filter(':focus');
					if(focusFields.length<1/* && !(cbx.isNativeIOS()&& cbx.getBrowserVersion()<=6)*/){
						window.scrollTo(0,0);
					}
				},100);
			}
		}, 
		focusActiveEl : function(){
			if(window.focusEle){
				$('#CONTENT_DIV')[0].iscrollEle.scrollToElement(window.focusEle,null,null,true);
			}

		},
		scrollToElement : function(scrollConfig,iscroller){
			if(scrollConfig && iscroller){
				var duration = scrollConfig.duration?scrollConfig.duration:500;
				if(scrollConfig.ele){
					iscroller.scrollToElement(scrollConfig.ele,duration);
				}
			}
		}

		,performUtilityOperations : function(){
			/*var activeDp = cbx.lib.datePicker.getActiveDatePicker();

			if(!cbx.isEmpty(activeDp)){
				activeDp.datebox();

				activeDp.trigger('datebox', {'method':'close'});

			}*/
			
			/**
			 * 
			 */
			canvas.contextTree = $(canvas.contextAppPanel).parents('.footable-row-detail-row');
			
			
		},
		focusActiveElement : function(){

			if ( typeof $('input') !== 'undefined' && $('input').length > 0 ) {
				$(document.activeElement).blur();
			}
			else if ( typeof $('texarea') !== 'undefined' && $('texarea').length > 0 ) {
				$(document.activeElement).blur();
			}

			else if ( typeof $('select') !== 'undefined' && $('select').length > 0 ) {
				$(document.activeElement).blur();
			}
		},
		doOnBeforeScroll : function(scrollConfig){
			if(!$('#context-app-panel-popup').hasClass('ui-popup-hidden')){
				$('#context-app-panel').popup('close');
			}
		},
		splitDate: function(date,monthInc) {
			var d;
			var incrementCount=monthInc===false ? 0 : 1;
			var dateArray = new Array();
			if ( !cbx.isEmpty(date)) {
				d = iportal.jsutil.convertStringToDateObject(date);
			}
			else {
				d = new Date();
			}
			dateArray.push(d.getFullYear());
			dateArray.push(("0" + (d.getMonth() + incrementCount)).slice(-2));
			dateArray.push(d.getDate());
			return dateArray;
		},
		convertDateFormat: function(inFormat, value, outputformat ) {
			inFormat = inFormat||'d/m/Y';
			var d, d1;
			if (!value) {
				return "";
			}
			if (!cbx.isDate(value)) {
				d = $.datepicker.parseDate(inFormat, value);
				d1 = $.datepicker.formatDate(outputformat, d);
				return d1;
			}
		},

		logoutUserWithPrompt : function(){
			var rb = CRB.getFWBundle();
			var win = new iportal.Dialog({
				dialogType:'WARNING',
				cls:'portal_pos_btn',
				cancelHandler:function(){
					win.close();				
				},
				message : '<div style=\'padding:3px;\'><div style=\'padding:3px;\'>'+
				rb['LOGOUT_CONFIRM_MESSAGE']+
				'</div></div>',
				okHandler : function(){
					win.close();
					setTimeout(function(){
						cbx.lib.utility.logoutUser();
					},100)
				},
				title : rb['LBL_LOGOUT']
			});
			win.show();

		},

		logoutUser : function(){ 
			var rb = CRB.getFWBundle();
			var logout_params = {};
			logout_params['transactionCode'] = 'logout';
			cbx.lib.logoutInProgress = true;
			var commonbundle = CRB.getBundle("common");
			var successFn=function (responseP, optionsP)
				{
					document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
					setTimeout(function(){
						if (iportal.systempreferences.isHybrid() == "true")
							window.location = "index.html";
						else if (iportal.systempreferences.isHybrid() == "false")
							window.location = iportal.workspace.metadata.getContextRoot() + '/m_index.jsp';
					},100);
			};
			var failureFn=function (responseP, optionsP)
				{
					var logoutWin = new iportal.Dialog({
						dialogType : 'ERROR',
						message : rb['LBL_EXIT_FAILURE'],
						cls : 'portal_neg_btn',
						title : commonbundle['LBL_ERROR'],
						okHandler : function ()
						{
							logoutWin.close();
							document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
							setTimeout(function(){
							if (iportal.systempreferences.isHybrid() == "true")
								window.location = "index.html";
							else if (iportal.systempreferences.isHybrid() == "false")
									window.location = iportal.workspace.metadata.getContextRoot() + '/m_index.jsp';
							},100);
						}
					});
					logoutWin.show();
			};
			if(canvas.env.network.getState() != 'ACTIVE'){
				successFn();	
			}
			else{
			cbx.ajax({
				type : 'html',
				params : logout_params,
				url : iportal.workspace.metadata.getContextRoot() + "/PortalLoginServlet",
				success : function (responseP, optionsP)
				{
					successFn(responseP, optionsP);
				},
				failure : function (responseP, optionsP)
				{
					failureFn(responseP, optionsP);
				}
			});		
			}
		}
	};
}();
/**
* Getting Android Version
**/
function getAndroidVersion(ua) {
    ua = (ua || navigator.userAgent).toLowerCase(); 
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
};
/**
* Onload Getting the orientation
*/
var windHeightFix = $( window ).height();
var resizHeightFix;
var Orientatoin;
$(window).load(function(event){
	$( window ).orientationchange();
});
/**
* Orientation related stuff
**/
$(window).on("orientationchange",function(event){
  	if(event.orientation == "landscape"){
		Orientatoin = 'L';
		//setTimeout(function () {iscrollReheight();},400);
	}else{
		Orientatoin = 'P';
	}
	var focusFields = $('input,textarea').filter(':focus');
	if( focusFields.length > 0 ){
		if(cbx.isChrome() == true || cbx.isOpera() == true){
			if(Orientatoin == "P" ){
				$("#"+focusFields.attr("id")).blur();
			}
		}
	}
});
/**
* Updating the height
**/
function iscrollReheight(){
	var bodyht = $(window).height();		
	var headerHt = $('#HEADER_DIV').height();
	var footerHt = $('#FOOTER_DIV').height();
	var subHt = headerHt+footerHt;
	var newHt = bodyht-subHt;
	$('#CONTENT_DIV').height(newHt);
	doIScroll('CONTENT_DIV','refresh');
}
/**
* Resizing Stuff
**/
$(window).resize(function(){
	if( cbx.isNativeAndroid() )
	{
		if(parseFloat(getAndroidVersion()) > 4.4 || getAndroidVersion() == '4.1.2'){
			if(cbx.isChrome() == true || cbx.isOpera() == true){
					resizHeightFix = $( window ).height();
			}
		}
	}                          
	setTimeout(function () {
		if( cbx.isNativeAndroid() )
		{
				if(cbx.isFireFox() == true){
					resizHeightFix = $( window ).height();
				}

			if(parseFloat(getAndroidVersion()) > 4.4 || getAndroidVersion() == '4.1.2'){
				if(cbx.isChrome() == true || cbx.isOpera() == true){
					if(Orientatoin == "P"){
						iscrollReheight();
					}
				}
			}
		}              
		//$("#TEXTBOX_ALPHA_NUMERIC_2_field").val(windHeightFix +"=="+ resizHeightFix);
		if( windHeightFix == resizHeightFix ){
			var focusFields = $('input,textarea').filter(':focus');
			if( focusFields.length > 0 ){
				$("#"+focusFields.attr("id")).blur();
			}
		}
	}, 400);
});
window.addEventListener('afterLoad', function (e) {
	$.mobile.loading('hide');
	$(".overlay").hide();
	$(".overlay").remove();
	$(".modalWindow").remove();
}, false);
window.addEventListener('beforeLoad', function (e) {
	$("body").append('<div class="modalWindow"/>');
	if($("body .overlay").length <= 0){
		$("body").append('<div class="overlay"/>');
	}
	$(".overlay").show();
	$(document).ready(function(){
		$.mobile.loading( 'show', {
			text: e.detail.text,
			textVisible: true,
			theme: 'e',

			html:"<div class='loaderWrapperCls'>"+e.detail.text+"<span class='loaderImgCls ui-icon ui-icon-loading'><span id='progressText' class='progressTextCls'></span></span></div>"

		});
	});
}, false);
window.addEventListener('tfdconfirm', function (e) {
	cbx.lib.workspacehandler.activateWorkspace(cbx.core.ws.metadata.getCurrentWorkspace().prevWs);
}, false);
/*
 *   Widget Tools GROUPED Menu
 */

$.widget('init.tooltipMenu',{

	defaults : {
		data : {},
		scope : {},
		showImage : true,
		theme : 'a'
	},
	_create : function(){
		this.opts = $.extend({},this.defaults, this.options);

	},
	_init : function(){
		if(this.opts.data.length == 0 ||
					this.opts.scope == '') return false;
		this.createContainer();
	},
	getHandler : function(key){
		return key+'Handler';
	},
	getAdditionalAttrs : function(key){
		return this.opts.scope.attachAdditionalAttributes(key);
	},

	isCollapsed : function(){
		return this.opts.scope.isCollapsed;
	},

	createContainer : function(){
		var ul = this.createListItem();
		var $container = $('<div/>').addClass('toolTipMenu').attr({ 'id':'toolTipPopupContainer' }).css('width','300px');
		if($("#app .toolTipMenu").length > 0){
			$("#app .toolTipMenu").remove();
		}
		$("#app").append($container.append(ul));
		$container.trigger('create');

		$container.popup();
		$container.popup('open',{
            positionTo: this.opts.evt.target,
            transition: "flow" });
	},

	updateToolsConfig:function(tools){
		if(this.isCollapsed()){
			tools=[{"qtip":"expand"}];
		}

		return tools;
	},

	createListItem : function(){
		var ul  = $('<ul/>').attr({
			'data-role':'listview',
			'data-corners' : 'true'
		});
		var _that = this;

		var toolsConf = this.opts.data;
		toolsConf = _that.updateToolsConfig(toolsConf);
		$.each(toolsConf,function(index,value){

			var text = value.qtip||"";
			var label = CRB.getFWBundleValue(text.toUpperCase()+"_APP_TOOL")||text;
			var li = $('<li/>').addClass('tools-icons').attr('data-icon',text).html('<a href="#" style="text-transform:capitalize">'+label+'</a>');
			var handlerMethod = new cbx.lib.widget.listeners();
			var handler = _that.getHandler(text);
			var callback = value.handler?value.handler:handlerMethod[handler];
			var extraParams = _that.getAdditionalAttrs(text);
			li.on('click', function(e){
				var fn = function(evt){
					var params = evt.data.scope?evt.data.scope:this;
					//$.extend(params, extraParams.eventParams);
					evt.data.callback.apply(params,[params]);
				}
				$( ".toolTipMenu" ).on('popupafterclose',{
					'callback':callback,
					scope:value.scope?value.scope:extraParams && extraParams.eventParams?extraParams.eventParams:_that
				},fn);
				$('.toolTipMenu').popup('close');
			});

			ul.append(li);
		});
		return ul;
	}
});
canvas.NULL_VAL_REPLACE='--';

cbx.lib.datePicker = function(){
	activeDp : null;
return{
	renderedPickerArray : {},
	getActiveDatePicker : function(){
		return this.activeDp;
	},
	setActiveDatePicker : function(inputOb){
		this.activeDp = inputOb;
	},

	addToArray : function(inputObj){
		this.renderedPickerArray[inputObj.id] = inputObj;
	},
	getFromArray : function(id){
		return this.renderedPickerArray[id];
	},
	clearArray : function(){
		this.renderedPickerArray ={};
	},
	callBack : function(that){
		that.getFormField().blur();
	}
};

}();
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
	/*if (iportal.systempreferences.isAlertViaPiggyBack()) {
		if(iportal.util.ajaxPiggyback.isPiggybackRequest(request) && !iportal.util.ajaxPiggyback.isPiggyBackInprocess){
			iportal.util.ajaxPiggyback.isPiggyBackInprocess=true;
			iportal.apps.alertPiggybackListner.getUrgentNormalAlertsCounts();
		}
		else if(iportal.util.ajaxPiggyback.isPiggybackRequest(request)){
			iportal.util.ajaxPiggyback.isPiggyBackInprocess = false;
		}
	}*/
};
CLCR.registerCmp({"COMP_TYPE":"GLOBAL_AJAX_LISTENERS","SEQUENCE":"COMPLETE"},cbx.lib.postAjax); 
