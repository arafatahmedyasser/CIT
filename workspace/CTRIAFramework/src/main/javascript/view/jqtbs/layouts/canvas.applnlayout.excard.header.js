/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.excard');
/**
 * @namespace "canvas.applnlayout.excard"
 * @description This component is currently responsible Jquery Framework to rendered excard layout header.
 */
canvas.applnlayout.excard.header = Class({
	/**
	 * @class "canvas.applnlayout.excard.header"
	 * @description The constructor gets the metadata and parent element (#HEADER)
	 */
	headerData : null,
	parentElem : null,
	constructor : function (config)
	{
		this.customJSON = config.config;
		this.headerData = config.md || {};
		this.parentElem = config.parentElem;
		$('#CONTENT_DIV').addClass("ct-excard-headerbuffer");
	},
	/**
	 * @method getHeaderDOM
	 * @memberof "canvas.applnlayout.excard.header"
	 * @description This method is responsible for loading the user picture, user info, last login time with the
	 *              template (excardheader.cttpl)
	 */
	getHeaderDOM : function ()
	{
		var user_img_path = './PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout='
					+ new Date();
		var componentJSON = {};
		componentJSON['HEADER_REQ'] = this.customJSON.isHeaderEnabled();
		componentJSON['CSS_CLASS'] = this.customJSON.getHeaderCls();	
		componentJSON['USR_IMG_PATH'] = user_img_path;
		var user_info = iportal.preferences.getLoggedInUserName();
		componentJSON['USR_INFO'] = user_info;
		var user_log_time = iportal.preferences.getLastLoginDateTime();
		componentJSON['USR_LOGIN'] = user_log_time;
		var bundle = CRB.getFWBundle();
		componentJSON['LAST_LOGIN_TEXT'] = bundle['LBL_LAST_LOGIN'];

		componentJSON['HEADER_PREF'] = bundle['LBL_PREF'];
		componentJSON['HEADER_LOGOUT'] = bundle['LBL_LOGOUT'];
		componentJSON['PIC_TOOL_TIP'] = bundle['LBL_CHANGE_PROF_PIC'];

		var wsList = iportal.workspace.metadata.getWorkspaces();	
		for(var i=0; i<wsList.length; i++) {
			var displayName = CRB.getBundleValue(wsList[i].BUNDLE_KEY, wsList[i].WORKSPACE_ID);
			if(!cbx.isEmpty(displayName)) {
				wsList[i].WORKSPACE_DISPLAY_NM = displayName;
			}
			if(cbx.isEmpty(wsList[i].WORKSPACE_DISPLAY_NM)) {
				wsList[i].WORKSPACE_DISPLAY_NM = wsList[i].WORKSPACE_ID;
			}
		}	
		
		componentJSON['EXCARD_WORKSPACES'] = wsList;
		var tmpLayer = new ct.lib.tmplLayer('al-excard-header.cttpl', componentJSON);
		tmpLayer.getTemplate(this.applyTemplate, this);

	},
	/**
	 * @method applyTemplate
	 * @memberof "canvas.applnlayout.excard.header"
	 * @description This method gets the template, appends it to the parent element and adds click listener for user
	 *              prefernces and logout.
	 */
	applyTemplate : function (template, tmpClass)
	{
		var that=this;
			
		if (!cbx.core.isEmpty(this.parentElem))
		{
			$(this.parentElem).append(template);
			var curentWorkspace=iportal.workspace.metadata.getCurrentWorkspaceId();
			if (!cbx.core.isEmpty(that.customJSON) && that.customJSON.isLandingPageRequired() == false) {
				//$(".ct-al__excard-each:first").addClass("ct-al__excard-is_selected");
				$('[data-item-id=ct-al__excard-ws-list] [data-selection-id='+curentWorkspace+']').addClass('ct-al__excard-is_selected');
			}
		}
			
		
		$(this.parentElem).find('[data-item-id=ct_logo]').on('click', function ()
		{
			var home_action = iportal.workspace.metadata.getWorkspaceManager().getContainer().logoHandler(that);
			if(home_action){
				$(".ct-al__excard-each").removeClass('ct-al__excard-is_selected');
				if (!cbx.core.isEmpty(that.customJSON) && that.customJSON.isLandingPageRequired() == false) {
					$(".ct-al__excard-each:first").addClass("ct-al__excard-is_selected");
				}
				var homeWorkspaceId=iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_ID;
				if (iportal.workspace.metadata.isWidgetCatalogRequired())
				{iportal.workspace.metadata.getAppDock().hideAppDock();}
			}
			
		});
		
		
		$('.ct-al__excard-each-js').unbind('click').bind('click', function ()
		{
			$(this).parent().children().removeClass('ct-al__excard-is_selected');
			$(this).addClass('ct-al__excard-is_selected');
			var element = this;
			var workspaceid = $(element).find('.ct-al__wslink-icon-js').attr('dat-item-id');
			//iportal.workspace.metadata.getWorkspaceManager().getContainer().switchWorkspace(workspaceid, null, true);
			cbx.HashManager.setHash({'WORKSPACE_ID':workspaceid});
		});
		
		$(this.parentElem).find('[data-item-id=ct_pref]').on('click', function ()
		{
			canvas.showPreferences();
		});
		$(this.parentElem).find('[data-item-id=ct_logout]').on('click', function ()
		{
			iportal.logoutUser();
		});
		$(this.parentElem).find('[data-item-id=ct_picedit]').on('click', function ()
		{
			canvas.editUploadPicture();
		});
		$(this.parentElem).find('[data-item-id=ct-user-details]').on('click', function (event) {
			event.stopPropagation();
			$('[data-item-id=ct-menu-desktop__ws-user-info]').slideToggle('fast');
		});
		$(".form-group #uploadPic").on('focus', function(){
			$("#uploadPic").parent().removeClass("has-error");
			$("#uploadPic").siblings('label.errorLabel').hide();
		});
		$(document).on('click','.navbar-collapse.in',function(e) {
		    if( $(e.target).is('a') ) {
		        $(this).collapse('hide');
		    }
		});
		$("body").on('click', function(e) {
			$('[data-item-id=ct-menu-desktop__ws-user-info]').slideUp();
		});
		$('body').not("[data-target=#img1]").on('click',function(){
			 $('.navbar-collapse.in').collapse('hide');
		});
		$("[data-item-id=ct-al__excard-ws-list]").mCustomScrollbar({
		    axis:"x"
		});
		if (iportal.preferences.isLangDirectionRTL()) {
			canvas.applnlayout.excard.rtl();
		}
		$('#mCSB_1_scrollbar_horizontal').on('click', function(e){
			e.stopPropagation();
		});
		$('[data-toggle="tooltip"]').tooltip();
	}
});

CLCR.registerCmp({
	"COMPONENT" : "excardheader",
	"APPLICATION_FW" : "JQTBS"
}, canvas.applnlayout.excard.header);
