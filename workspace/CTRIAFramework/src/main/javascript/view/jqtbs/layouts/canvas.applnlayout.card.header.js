/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.card');
/**
 * @namespace "canvas.applnlayout.card"
 * @description This component is currently responsible Jquery Framework to rendered card layout header.
 */
canvas.applnlayout.card.header = Class({
    /**
     * @class "canvas.applnlayout.card.header"
     * @description The constructor gets the metadata and parent element (#HEADER)
     */
    headerData: null,
    parentElem: null,
    constructor: function(config) {
        this.customJSON = config.config;
        this.headerData = config.md || {};
        this.parentElem = config.parentElem;
        $('#CONTENT_DIV').addClass("ct-headerbuffer ct-card-headerbuffer");
        $("#HEADER_DIV").addClass("ct-al-card__home-page");
    },
    /**
     * @method getHeaderDOM
     * @memberof "canvas.applnlayout.card.header"
     * @description This method is responsible for loading the user picture, user info, last login time with the
     *              template (cardheader.cttpl)
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
        var tmpLayer = new ct.lib.tmplLayer('al-card-header.cttpl', componentJSON);
        tmpLayer.getTemplate(this.applyTemplate, this);
    },
    /**
     * @method applyTemplate
     * @memberof "canvas.applnlayout.card.header"
     * @description This method gets the template, appends it to the parent element and adds click listener for user
     *              prefernces and logout.
     */
    applyTemplate: function(template, tmpClass) {

        var that = this;
        if (!cbx.core.isEmpty(this.parentElem)) {
            $(this.parentElem).append(template);

        }
        $('[data-item-id=ct-ws-title]').html("CANVAS TECHNOLOGY");

        $(this.parentElem).find('[data-item-id=ct-user-details]').on('click', function(event) {
            event.stopPropagation();
            $('[data-item-id=ct-card-desktop__ws-user-info]').slideToggle('fast');
        });
        $("body").on('click', function(e) {
            $('[data-item-id=ct-card-desktop__ws-user-info]').slideUp();
        });

        $(this.parentElem).find('[data-item-id="ct_logo"]').on('click', function() {
            var home_action = iportal.workspace.metadata.getWorkspaceManager().getContainer().logoHandler(that);
            if (home_action) {
                /*$("#HEADER_DIV").find("[data-item-id='ct-workspace__name']").empty();*/
                $('[data-item-id=ct-ws-title]').html("CANVAS TECHNOLOGY");
                $("#HEADER_DIV").addClass("ct-al-card__home-page").removeClass("ct-al-card__ws-page");
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

        $(window).scroll(function() {
            if ($(this).scrollTop() > 75) {
                $('[data-item-id=ct-al-card__header]').addClass("ct-sticky_header");
                $('[data-item-id=ct_logo]').addClass("ct-sticky_header");
                $('#HEADER_DIV').addClass("ct-sticky_header");
                $('[data-item-id=ct-ws-title]').addClass("ct-sticky_header");
                $('#CONTENT_DIV').addClass("ct-sticky_header");
                $('[data-item-id=ct-user-details]').addClass("ct-sticky_header");
                $('[data-item-id=ct-card-desktop__ws-user-info]').addClass("ct-sticky_header");
                $('[data-item-id=clicker]').addClass("ct-sticky_header");
            } else {
                $('[data-item-id=ct-al-card__header]').removeClass("ct-sticky_header");
                $('[data-item-id=ct_logo]').removeClass("ct-sticky_header");
                $('#HEADER_DIV').removeClass("ct-sticky_header");
                $('[data-item-id=ct-ws-title]').removeClass("ct-sticky_header");
                $('#CONTENT_DIV').removeClass("ct-sticky_header");
                $('[data-item-id=ct-user-details]').removeClass("ct-sticky_header");
                $('[data-item-id=ct-card-desktop__ws-user-info]').removeClass("ct-sticky_header");
                $('[data-item-id=clicker]').removeClass("ct-sticky_header");
            }
        });

        }


});

CLCR.registerCmp({
    "COMPONENT": "cardheader",
    "APPLICATION_FW": "JQTBS"
}, canvas.applnlayout.card.header);
