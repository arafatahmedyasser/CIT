/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.tab');
/**
 * @namespace "canvas.applnlayout.tab"
 * @description This component is currently responsible Jquery Framework to rendered tab layout header.
 */
canvas.applnlayout.tab.header = Class({
    /**
     * @class "canvas.applnlayout.tab.header"
     * @description The constructor gets the metadata and parent element (#HEADER)
     */
    headerData: null,
    parentElem: null,
    wsArray: null,
    applicationTabLayoutObj: null,
    constructor: function(config) {
        this.customJSON = config.config;
        this.headerData = config.md || {};
        this.parentElem = config.parentElem;
    },
    /**
     * @method getHeaderDOM
     * @memberof "canvas.applnlayout.tab.header"
     * @description This method is responsible for loading the user picture, user info, last login time with the
     *              template (tabheader.cttpl)
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
        var tmpLayer = new ct.lib.tmplLayer('al-tab-header.cttpl', componentJSON);
        tmpLayer.getTemplate(this.applyTemplate, this);

        $('#HEADER_DIV').after('<div data-item-id="applicationTabLayoutContainer" class="container-fuild ct-paddingtop-md"></div>'); //Add tab layout div to the body just after application header 

        var applicationTabLayoutClass = CLCR.getCmp({ //Get tab layout component class
            "COMP_TYPE": "LAYOUT",
            "LAYOUT_TYPE": "TAB"
        });

        if (applicationTabLayoutClass) {
            this.wsArray = iportal.workspace.metadata.getWorkspaces(); //Get the list of workspaces
            var wsFormattedArray = [];
            /*Start: Massaging the data for tab layout engine*/
            for (var index = 0; index < this.wsArray.length; index++) {
                this.wsArray[index].WORKSPACE_DISPLAY_NM = cbx.isEmpty(CRB.getBundleValue(
                    this.wsArray[index].BUNDLE_KEY, this.wsArray[index].WORKSPACE_ID)) ? this.wsArray[index].WORKSPACE_DISPLAY_NM : CRB.getBundleValue(
                    this.wsArray[index].BUNDLE_KEY, this.wsArray[index].WORKSPACE_ID);
                var wsObj = {};
                wsObj['ITEM_ID'] = this.wsArray[index].WORKSPACE_ID;
                wsObj['ITEM_LABEL'] = this.wsArray[index].WORKSPACE_DISPLAY_NM;
                wsFormattedArray.push(wsObj);
            }
            /*End: Massaging data*/

            if (!cbx.isEmpty(this.customJSON.getWorkSpaceLayoutConfig())) {
                var activeTabIndex = cbx.isEmpty(this.customJSON.getWorkSpaceLayoutConfig().activeTab) ? 0 : this.customJSON.getWorkSpaceLayoutConfig().activeTab;
            } else {
                var activeTabIndex = 0;
            }

            var applicationContainerTabLayoutConfig = { //JSON to be sent to the tab layout engine
                parent_elem: $('div[data-item-id=applicationTabLayoutContainer]'), // the parent elem to which tab layout to be appended
                defaultActiveTab: activeTabIndex, //Default tab to be activated initially
                activationHandler: this.activateWorkspace, //Method to be called to activate a tab(workspace)
                implementationSubstring: 'workspace_', //Prefix for the IDs of tab strip  
                presentation: 1, //Configuring the appearance of the tab layout (application of "WELL" class of bootstrap)
                itemList: wsFormattedArray, //Massaged data containing the workspace list 
                additionalTab: iportal.systempreferences.getDesignCanvasInd() == 'Y' ? true : false, //Setting tab to render Design Canvas workspace
                parentScope: this
            };

            this.applicationTabLayoutObj = new applicationTabLayoutClass(applicationContainerTabLayoutConfig); //Invoke tab layout engine with the config parameter
        }
    },
    /**
     * @method applyTemplate
     * @memberof "canvas.applnlayout.tab.header"
     * @description This method gets the template, appends it to the parent element and adds click listener for user
     *              prefernces and logout.
     */
    applyTemplate: function(template, tmpClass) {
        var that = this;
        if (!cbx.core.isEmpty(this.parentElem)) {
            $(this.parentElem).append(template);
        }
        var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName();
        $('[data-item-id=ct-ws-title]').html(wsName);
        $(this.parentElem).find('[data-item-id=ct-user-details]').on('click', function(event) {
            event.stopPropagation();
            $('[data-item-id=ct-menu-desktop__ws-user-info]').slideToggle('fast');
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
        $(this.parentElem).find('[data-item-id=ct_logo]').on('click', function() {
            var home_action = iportal.workspace.metadata.getWorkspaceManager().getContainer().logoHandler(that);
            if (home_action) {
                if (iportal.workspace.metadata.isWidgetCatalogRequired()) {
                    iportal.workspace.metadata.getAppDock().hideAppDock();
                }
                $(this.parentElem).find('.workspace_tab__holder').find('li.active').removeClass('active')
                $(this.parentElem).find('[data-item-id=workspace__' + homeWorkspaceId + '_TabStrip]').addClass('active');
            }

        });
        $(document).on('click', '.navbar-collapse.in', function(e) {
            if ($(e.target).is('a')) {
                $(this).collapse('hide');
            }
        });
        /*$('body').not("[data-target=#img1]").on('click',function(){
        	 $('.navbar-collapse.in').collapse('hide');
        });*/
        $(".form-group #uploadPic").on('focus', function() {
            $("#uploadPic").parent().removeClass("has-error");
            $("#uploadPic").siblings('label.errorLabel').hide();
        });
        $('[data-toggle="tooltip"]').tooltip();
    },
    /**
     * @method activateWorkspace
     * @memberof "canvas.applnlayout.tab.header"
     * @description This method receives workspace Id, application container tab layout content container in which the workspace to be rendered and the scope 
     */
    activateWorkspace: function(workspaceId, wkspcContDataItemId, scope) {
        if (iportal.workspace.metadata.isWidgetCatalogRequired()) {
            iportal.workspace.metadata.getAppDock().showAppDock();
        }
        scope = scope ? scope : this;
        if (wkspcContDataItemId != undefined && wkspcContDataItemId != null && $('div[data-item-id= ' + wkspcContDataItemId + ']').has($('#CONTENT_DIV')).length === 0) {
            /**Append the CONTENT_DIV to the tab layout container*/
            $('div[data-item-id= ' + wkspcContDataItemId + ']').append($('#CONTENT_DIV'));
        }
        cbx.core.ws.metadata.getWorkspaceManager().getContainer().getCmp().empty();
        if (workspaceId == 'additionalTab') {
            alert("Design Canvas");
        }
        /**Get the url of the page to be rendered instead of workspace if set*/
        else if (cbx.core.ws.metadata.getWorkSpaceById(workspaceId).WORKSPACE_ACTIVATE_HANDLER != "") {
            cbx.core.ws.metadata.getWorkspaceManager().getContainer().getCmp().append(
                '<object type="text/html" data="' + cbx.core.ws.metadata.getWorkSpaceById(workspaceId).WORKSPACE_ACTIVATE_HANDLER + '"  style="overflow:auto;border:5px ridge blue"></object>');
        } else {
            var workspaceConfig = {
                /**Set application container as the parent for the workspace to be rendered*/
                elem: cbx.core.ws.metadata.getWorkspaceManager().getContainer().getCmp(),
                WORKSPACE_ID: workspaceId,
                SYSTEM_WORKSPACE_IND: cbx.core.ws.metadata.getWorkSpaceById(workspaceId).SYSTEM_WORKSPACE_IND,
                wsMD: cbx.core.ws.metadata.getWorkSpaceById(workspaceId)
            };
            cbx.HashManager.setHash({'WORKSPACE_ID':workspaceId});

           /* cbx.core.ws.metadata.getWorkspaceManager().wsSelectionHandler(workspaceConfig, null, function(wsContainer) {
                *//**Invoke workspace selection handler to render the workspace*//*
                cbx.core.ws.metadata.setCurrentWorkspace(wsContainer);
            }, scope);*/
        }


    }
});

CLCR.registerCmp({
    "COMPONENT": "tabheader",
    "APPLICATION_FW": "JQTBS"
}, canvas.applnlayout.tab.header);
