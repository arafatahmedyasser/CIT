/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.app');
/**
 * @namespace "canvas.applnlayout.app"
 * @description This component is currently responsible Jquery Framework to rendered app layout header.
 */
canvas.applnlayout.app.header = Class({
    /**
     * @class "canvas.applnlayout.app.header"
     * @description The constructor gets the metadata and parent element (#HEADER)
     */
    headerData: null,
    parentElem: null,
    constructor: function(config) {
        this.customJSON = config.config;
        this.headerData = config.md || {};
        this.parentElem = config.parentElem;
        $('#CONTENT_DIV').addClass("ct-paddingtop-md");
    },
    /**
     * @method getHeaderDOM
     * @memberof "canvas.applnlayout.app.header"
     * @description This method is responsible for loading the user picture, user info, last login time with the
     *              template (appheader.cttpl)
     */
    getHeaderDOM: function() {
        var user_img_path = './PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout=' + new Date();
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
        var tmpLayer = new ct.lib.tmplLayer('al-app-header.cttpl', componentJSON);
        tmpLayer.getTemplate(this.applyTemplate, this);
    },
    /**
     * @method applyTemplate
     * @memberof "canvas.applnlayout.app.header"
     * @description This method gets the template, appends it to the parent element and adds click listener for user
     *              prefernces and logout.
     */
    applyTemplate: function(template, tmpClass) {
        var that = this;
        if (!cbx.core.isEmpty(this.parentElem)) {
            $(this.parentElem).append(template);
        }
        if (!cbx.core.isEmpty(that.customJSON) && that.customJSON.isLandingPageRequired() == false) {
            var homeWorkspaceId =iportal.workspace.metadata.getCurrentWorkspaceId(); //iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_ID;
            var homeWorkspaceDN = iportal.workspace.metadata.getCurrentWorkspace().wsMD.WORKSPACE_DISPLAY_NM;//iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_DISPLAY_NM;
            var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName(homeWorkspaceId, homeWorkspaceDN);
            $('[data-item-id=ct-ws-title]').html(wsName);
        }
        $(this.parentElem).find('[data-item-id=ct-user-details]').on('click', function(event) {
            event.stopPropagation();
            $('[data-item-id=ct-menu-desktop__ws-user-info]').slideToggle('fast');
        });
        $("body").on('click', function(e) {
            $('[data-item-id=ct-menu-desktop__ws-user-info]').slideUp();
        });
        $(this.parentElem).find('[data-item-id=ct_logo]').on('click', function() {
            var home_action = iportal.workspace.metadata.getWorkspaceManager().getContainer().logoHandler(this);
            if (home_action) {
                $("#FOOTER_DIV .ct-al__app-each").removeClass('ct-al__app-is_selected');
                if (!cbx.core.isEmpty(that.customJSON) && that.customJSON.isLandingPageRequired() == false) {
                    $("#FOOTER_DIV .ct-al__app-each:first").addClass("ct-al__app-is_selected");
                    $('[data-item-id=ct-ws-title]').html(wsName);
                } else {
                    var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName();
                    $('[data-item-id=ct-ws-title]').html(wsName);
                }
                var homeWorkspaceId = iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_ID;
                if (iportal.workspace.metadata.isWidgetCatalogRequired()) {
                    iportal.workspace.metadata.getAppDock().hideAppDock();
                }
            }
        });
        $(this.parentElem).find('[data-item-id=ct_pref]').on('click', function() {
            canvas.showPreferences();

        });
        $(this.parentElem).find('[data-item-id=ct_logout]').on('click', function() {
            iportal.logoutUser();
        });

        $(this.parentElem).find('[data-item-id=ct_picedit]').on('click', function() {
            canvas.editUploadPicture();
        });
        $(".form-group #uploadPic").on('focus', function() {
            $("#uploadPic").parent().removeClass("has-error");
            $("#uploadPic").siblings('label.errorLabel').hide();
        });
        $('[data-toggle="tooltip"]').tooltip();
        /*		$(document.body).on('show.bs.modal', function () {
        		    if (this.clientHeight <= window.innerHeight) {
        		        return;
        		    }
        		    // Get scrollbar width
        		    var scrollbarWidth = getScrollBarWidth()
        		    if (scrollbarWidth) {
        		        $('.navbar-fixed-bottom').css('margin-right', scrollbarWidth);    
        		        $('.navbar-fixed-top').css('margin-right', scrollbarWidth);    
        		    }
        		}).on('hide.bs.modal', function () {
        		    $('.navbar-fixed-bottom').css('margin-right', 0);
        		    $('.navbar-fixed-top').css('margin-right', 0);
        		});
        */
        $(document).on('click', '.navbar-collapse.in', function(e) {
            if ($(e.target).is('a')) {
                $(this).collapse('hide');
            }
        });
        /*		$('body').not("[data-target=#img1]").on('click',function(){
        			 $('.navbar-collapse.in').collapse('hide');
        		});*/
    }
});

CLCR.registerCmp({
    "COMPONENT": "appheader",
    "APPLICATION_FW": "JQTBS"
}, canvas.applnlayout.app.header);
